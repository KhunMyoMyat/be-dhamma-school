import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
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
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: { teacher: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async findActive() {
    return this.prisma.course.findMany({
      where: { isActive: true },
      include: { teacher: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: { teacher: true },
    });
  }

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: dto,
      include: { teacher: true },
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: dto,
      include: { teacher: true },
    });
  }

  async remove(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}
