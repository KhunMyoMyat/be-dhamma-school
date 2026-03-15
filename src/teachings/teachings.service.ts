import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateTeachingDto, UpdateTeachingDto } from './dto/teaching.dto';

@Injectable()
export class TeachingsService {
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
      this.prisma.teaching.findMany({
        where,
        skip,
        take: limit,
        include: { teacher: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teaching.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async findPublished() {
    return this.prisma.teaching.findMany({
      where: { isPublished: true },
      include: { teacher: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.teaching.findMany({
      where: { category, isPublished: true },
      include: { teacher: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.teaching.findUnique({
      where: { id },
      include: { teacher: true },
    });
  }

  async create(dto: CreateTeachingDto) {
    return this.prisma.teaching.create({
      data: dto,
      include: { teacher: true },
    });
  }

  async update(id: string, dto: UpdateTeachingDto) {
    return this.prisma.teaching.update({
      where: { id },
      data: dto,
      include: { teacher: true },
    });
  }

  async remove(id: string) {
    return this.prisma.teaching.delete({ where: { id } });
  }
}
