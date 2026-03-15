import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as const } },
            { titleMm: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async findUpcoming() {
    return this.prisma.event.findMany({
      where: { isActive: true, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
      take: 6,
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: dto });
  }

  async update(id: string, dto: UpdateEventDto) {
    return this.prisma.event.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}
