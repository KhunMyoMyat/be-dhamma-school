import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateDonationDto } from './dto/donation.dto';

@Injectable()
export class DonationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.donation.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.donation.count(),
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
}
