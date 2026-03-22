import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { message: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.contactInquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.contactInquiry.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async create(dto: CreateContactDto) {
    return this.prisma.contactInquiry.create({ data: dto });
  }

  async markAsRead(id: string) {
    return this.prisma.contactInquiry.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactInquiry.delete({ where: { id } });
  }
}
