import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateDonationDto } from './dto/donation.dto';
import { MonthlyDonorsQueryDto } from './dto/monthly-donors.dto';
import { CreateMonthlyDonorDto, UpdateMonthlyDonorDto } from './dto/monthly-donor-subscription.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', category, search: searchRaw } = query;
    const skip = (page - 1) * limit;
    const search = searchRaw?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { donorName: { contains: search, mode: 'insensitive' as const } },
        { currency: { contains: search, mode: 'insensitive' as const } },
        { message: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const [data, total, totalsByCurrencyAgg] = await Promise.all([
      this.prisma.donation.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.donation.count({ where }),
      this.prisma.donation.groupBy({
        by: ['currency'],
        where,
        _sum: { amount: true },
      }),
    ]);

    const res = createPaginatedResponse(data, total, page, limit);
    return {
      ...res,
      meta: {
        ...res.meta,
        totalsByCurrency: totalsByCurrencyAgg.map(t => ({
          currency: t.currency,
          total: t._sum.amount || 0
        })),
      },
    };
  }

  async create(dto: CreateDonationDto) {
    return this.prisma.donation.create({ data: dto });
  }

  async getStats() {
    const totalDonations = await this.prisma.donation.count();
    const totalAmount = await this.prisma.donation.aggregate({
      _sum: { amount: true },
    });
    return {
      totalDonations,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }

  async getMonthlyDonors(query: MonthlyDonorsQueryDto) {
    const now = new Date();
    const year = query.year ?? now.getUTCFullYear();
    const month = query.month ?? now.getUTCMonth() + 1; // 1-12

    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    const whereDonations = {
      date: {
        gte: start,
        lt: end,
      },
    } as const;

    // Fetch monthly donor commitments that should be active in this month
    const whereSubscriptions: any = {
      startDate: { lt: end },
      status: { in: ['active', 'pending'] },
    };

    // If a donor has an endDate, they must not have ended before this month starts
    // i.e., endDate >= start
    whereSubscriptions.OR = [
      { endDate: null },
      { endDate: { gte: start } },
    ];

    const [donationGroups, activeSubscriptions, totalsByCurrencyAgg] = await Promise.all([
      this.prisma.donation.groupBy({
        by: ['donorName', 'currency'],
        where: whereDonations,
        _sum: { amount: true },
        _count: { _all: true },
        _max: { date: true },
      }),
      this.prisma.monthlyDonor.findMany({
        where: whereSubscriptions,
      }),
      this.prisma.donation.groupBy({
        by: ['currency'],
        where: whereDonations,
        _sum: { amount: true },
      }),
    ]);

    // Merge logic: Start with actual donations
    const donorsMap = new Map<string, any>();
    
    // 1. Add actual donations to map
    donationGroups.forEach((g) => {
      const key = `${g.donorName}-${g.currency}`.toLowerCase();
      donorsMap.set(key, {
        donorName: g.donorName,
        currency: g.currency,
        totalAmount: g._sum.amount ?? 0,
        donationCount: g._count._all,
        lastDonationAt: g._max.date,
      });
    });

    // 2. Add commitments from active subscriptions if not already present for this month
    // Only show commitments for current or future months to avoid cluttering historical data
    const isFutureOrCurrent = new Date(year, month - 1, 1) >= new Date(now.getFullYear(), now.getMonth(), 1);
    
    if (isFutureOrCurrent) {
      activeSubscriptions.forEach((s) => {
        const key = `${s.name}-${s.currency}`.toLowerCase();
        if (!donorsMap.has(key)) {
          donorsMap.set(key, {
            donorName: s.name,
            currency: s.currency,
            totalAmount: s.amount,
            donationCount: 0,
            lastDonationAt: null,
          });
        }
      });
    }

    const allData = Array.from(donorsMap.values());
    
    // Sort by amount descending
    allData.sort((a, b) => b.totalAmount - a.totalAmount);

    const paginatedData = allData.slice(skip, skip + limit);
    
    // Calculate final totals by currency (including commitments for current/future)
    const finalTotals: { currency: string, total: number }[] = totalsByCurrencyAgg.map(t => ({
      currency: t.currency,
      total: t._sum.amount || 0
    }));

    if (isFutureOrCurrent) {
      allData.forEach(d => {
        if (d.donationCount === 0) { // It's a commitment
          const existing = finalTotals.find(t => t.currency === d.currency);
          if (existing) {
            existing.total += d.totalAmount;
          } else {
            finalTotals.push({ currency: d.currency, total: d.totalAmount });
          }
        }
      });
    }

    const res = createPaginatedResponse(paginatedData, allData.length, page, limit);
    return {
      ...res,
      meta: {
        ...res.meta,
        totalsByCurrency: finalTotals,
      },
    };
  }

  // --- Monthly Donor (Subscriptions) ---

  async registerMonthlyDonor(dto: CreateMonthlyDonorDto) {
    return this.prisma.monthlyDonor.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async findAllMonthlyDonors(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', category, search: searchRaw } = query;
    const skip = (page - 1) * limit;
    const search = searchRaw?.trim();

    // Auto-expire donors
    await this.prisma.monthlyDonor.updateMany({
      where: {
        status: 'active',
        endDate: {
          lt: new Date()
        }
      },
      data: {
        status: 'inactive'
      }
    });

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { remarks: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const [data, total, totalsByCurrencyAgg] = await Promise.all([
      this.prisma.monthlyDonor.findMany({
        skip,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.monthlyDonor.count({ where }),
      this.prisma.monthlyDonor.groupBy({
        by: ['currency'],
        where,
        _sum: { amount: true },
      }),
    ]);

    const res = createPaginatedResponse(data, total, page, limit);
    return {
      ...res,
      meta: {
        ...res.meta,
        totalsByCurrency: totalsByCurrencyAgg.map(t => ({
          currency: t.currency,
          total: t._sum.amount || 0
        })),
      },
    };
  }

  async updateMonthlyDonor(id: string, dto: UpdateMonthlyDonorDto) {
    const data: any = { ...dto };
    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    } else if (dto.endDate === null) {
      data.endDate = null;
    }
    return this.prisma.monthlyDonor.update({
      where: { id },
      data,
    });
  }

  async deleteMonthlyDonor(id: string) {
    return this.prisma.monthlyDonor.delete({ where: { id } });
  }
}
