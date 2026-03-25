import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEnrollmentDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId }
    });
    
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.enrollment.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.enrollment.findMany({
      include: {
        course: {
          select: {
            title: true,
            titleMm: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id }
    });
    
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    
    return enrollment;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.enrollment.update({
      where: { id },
      data: { status }
    });
  }

  async remove(id: string) {
    return this.prisma.enrollment.delete({
      where: { id }
    });
  }
}
