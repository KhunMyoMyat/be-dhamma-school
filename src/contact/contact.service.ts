import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.contactInquiry.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactInquiry.count(),
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
