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
    return this.prisma.donation.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
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

    const allData = Array.from(donorsMap.values());
    
    // Sort by amount descending
    allData.sort((a, b) => b.totalAmount - a.totalAmount);

    const paginatedData = allData.slice(skip, skip + limit);
    
    // Calculate final totals by currency (only actual donations)
    const finalTotals: { currency: string, total: number }[] = totalsByCurrencyAgg.map(t => ({
      currency: t.currency,
      total: t._sum.amount || 0
    }));

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

    const now = new Date();
    const targetMonth = query.month;
    const targetYear = query.year || now.getFullYear();

    // If month is providing, we want a REPORT (merging donations + subscriptions)
    if (targetMonth) {
      const startOfPeriod = new Date(targetYear, targetMonth - 1, 1);
      const endOfPeriod = new Date(targetYear, targetMonth, 1);

      const [monthlyDonations, activeSubscriptions] = await Promise.all([
        this.prisma.donation.findMany({
          where: { date: { gte: startOfPeriod, lt: endOfPeriod } },
        }),
        this.prisma.monthlyDonor.findMany({
          where: {
            OR: [
              { endDate: null },
              { endDate: { gte: startOfPeriod } },
            ],
            startDate: { lte: endOfPeriod },
            status: 'active',
          },
        }),
      ]);

      const donorsMap = new Map<string, any>();

      // 1. Add all actual donations (Manual or Subscription)
      monthlyDonations.forEach(d => {
        const key = `${d.donorName}-${d.currency}`.toLowerCase();
        if (!donorsMap.has(key)) {
          donorsMap.set(key, {
            name: d.donorName,
            amount: d.amount,
            currency: d.currency,
            donationCount: 1,
            paidCurrentMonth: true,
            isSubscriber: false,
            category: d.category || 'general'
          });
        } else {
          const existing = donorsMap.get(key);
          existing.amount += d.amount;
          existing.donationCount += 1;
        }
      });

      // 2. Add subscriptions that Haven't Paid yet
      activeSubscriptions.forEach(s => {
        const key = `${s.name}-${s.currency}`.toLowerCase();
        if (!donorsMap.has(key)) {
          donorsMap.set(key, {
            name: s.name,
            amount: s.amount,
            currency: s.currency,
            donationCount: 0,
            paidCurrentMonth: false,
            isSubscriber: true,
            category: s.category
          });
        } else {
          // If already in map because they paid, mark as subscriber
          donorsMap.get(key).isSubscriber = true;
        }
      });

      // Calculate Totals BEFORE search/pagination
      const allDataForStats = Array.from(donorsMap.values());
      const paidTotals: any[] = [];
      allDataForStats.forEach(d => {
        if (d.paidCurrentMonth) {
           let pt = paidTotals.find(t => t.currency === d.currency);
           if (!pt) { pt = { currency: d.currency, total: 0, count: 0 }; paidTotals.push(pt); }
           pt.total += d.amount;
           pt.count += 1;
        }
      });

      let allData = allDataForStats;
      // Filter by search if exists
      if (search) {
        allData = allData.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
      }

      // Sort & Paginate
      allData.sort((a, b) => b.amount - a.amount);
      const paginatedData = allData.slice(skip, skip + limit);

      // Better yet, use the groupBy for expected totals
      const expectedTotalsAgg = await this.prisma.monthlyDonor.groupBy({
        by: ['currency'],
        where: {
          OR: [{ endDate: null }, { endDate: { gte: startOfPeriod } }],
          startDate: { lte: endOfPeriod },
          status: 'active',
        },
        _sum: { amount: true }
      });

      const res = createPaginatedResponse(paginatedData, allData.length, page, limit);
      return {
        ...res,
        meta: {
          ...res.meta,
          totalsByCurrency: expectedTotalsAgg.map(t => ({ currency: t.currency, total: t._sum.amount || 0 })),
          report: {
            month: targetMonth,
            year: targetYear,
            paid: paidTotals,
            totalActiveCount: allData.length,
          }
        }
      };
    }

    // --- Standard Management View (No Month Selected) ---
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

    // Simple payment check for management table (current month always)
    const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthlyDonations = await this.prisma.donation.findMany({
      where: { date: { gte: startOfCurrent, lt: endOfCurrent } },
      select: { donorName: true }
    });
    const paidNamesSet = new Set(monthlyDonations.map(d => d.donorName.toLowerCase()));

    const res = createPaginatedResponse(
      data.map((d) => ({
        ...d,
        paidCurrentMonth: paidNamesSet.has(d.name.toLowerCase()),
      })),
      total,
      page,
      limit,
    );

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
