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
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where = search
      ? {
          OR: [
            { donorName: { contains: search, mode: 'insensitive' as const } },
            { currency: { contains: search, mode: 'insensitive' as const } },
            { message: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.donation.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.donation.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
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

    const [groups, allGroups] = await Promise.all([
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
    ]);

    const data = groups.map((g) => ({
      donorName: g.donorName,
      currency: g.currency,
      totalAmount: g._sum.amount ?? 0,
      donationCount: g._count._all,
      lastDonationAt: g._max.date,
    }));

    return createPaginatedResponse(data, allGroups.length, page, limit);
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
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { remarks: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.monthlyDonor.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.monthlyDonor.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
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
