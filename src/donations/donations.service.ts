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

    const where = {
      date: {
        gte: start,
        lt: end,
      },
    } as const;

    const [groups, allGroups, totalsByCurrencyAgg] = await Promise.all([
      this.prisma.donation.groupBy({
        by: ['donorName', 'currency'],
        where,
        _sum: { amount: true },
        _count: { _all: true },
        _max: { date: true },
        orderBy: [{ _sum: { amount: 'desc' } }, { donorName: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.donation.groupBy({
        by: ['donorName', 'currency'],
        where,
      }),
      this.prisma.donation.groupBy({
        by: ['currency'],
        where,
        _sum: { amount: true },
      }),
    ]);

    const data = groups.map((g) => ({
      donorName: g.donorName,
      currency: g.currency,
      totalAmount: g._sum.amount ?? 0,
      donationCount: g._count._all,
      lastDonationAt: g._max.date,
    }));

    const res = createPaginatedResponse(data, allGroups.length, page, limit);
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

  // --- Monthly Donor (Subscriptions) ---

  async registerMonthlyDonor(dto: CreateMonthlyDonorDto) {
    return this.prisma.monthlyDonor.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
      },
    });
  }

  async findAllMonthlyDonors(query: PaginationDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', category, search: searchRaw } = query;
    const skip = (page - 1) * limit;
    const search = searchRaw?.trim();

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
    return this.prisma.monthlyDonor.update({
      where: { id },
      data,
    });
  }

  async deleteMonthlyDonor(id: string) {
    return this.prisma.monthlyDonor.delete({ where: { id } });
  }
}
