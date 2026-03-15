import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateEventDto, UpdateEventDto, QueryEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryEventDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { titleMm: { contains: search, mode: 'insensitive' as const } },
        { location: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (query.startDate) {
      where.date = { ...where.date, gte: new Date(query.startDate as any) };
    }

    if (query.endDate) {
      where.date = { ...where.date, lte: new Date(query.endDate as any) };
    }

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
    const now = new Date();
    return this.prisma.event.findMany({
      where: { 
        isActive: true, 
        OR: [
          { date: { gte: now } },
          { endDate: { gte: now } }
        ]
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }

  async findPast(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { 
          isActive: true, 
          date: { lt: now },
          NOT: { endDate: { gte: now } }
        },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.event.count({ 
        where: { 
          isActive: true, 
          date: { lt: now },
          NOT: { endDate: { gte: now } }
        } 
      }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
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
