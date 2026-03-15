import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaginationDto, createPaginatedResponse } from '../common/dto';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { nameMm: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: { courses: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teacher.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: { courses: true, teachings: true },
    });
  }

  async create(dto: CreateTeacherDto) {
    return this.prisma.teacher.create({ data: dto });
  }

  async update(id: string, dto: UpdateTeacherDto) {
    return this.prisma.teacher.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.teacher.delete({ where: { id } });
  }
}
