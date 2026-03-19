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
          translations: {
            some: {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { content: { contains: search, mode: 'insensitive' as const } },
              ],
            },
          },
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.teaching.findMany({
        where,
        skip,
        take: limit,
        include: { teacher: true, translations: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.teaching.count({ where }),
    ]);

    return createPaginatedResponse(data, total, page, limit);
  }

  async findPublished() {
    return this.prisma.teaching.findMany({
      where: { isPublished: true },
      include: { teacher: true, translations: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.teaching.findMany({
      where: { category, isPublished: true },
      include: { teacher: true, translations: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.teaching.findUnique({
      where: { id },
      include: { teacher: true, translations: true },
    });
  }

  async create(dto: CreateTeachingDto) {
    return this.prisma.teaching.create({
      data: {
        category: dto.category,
        coverImageUrl: dto.coverImageUrl,
        audioUrl: dto.audioUrl,
        videoUrl: dto.videoUrl,
        documentUrl: dto.documentUrl,
        documentName: dto.documentName,
        documentType: dto.documentType,
        documentSize: dto.documentSize,
        teacherId: dto.teacherId,
        isPublished: dto.isPublished ?? true,
        translations: {
          create: dto.translations,
        },
      },
      include: { teacher: true, translations: true },
    });
  }

  async update(id: string, dto: UpdateTeachingDto) {
    const updates = {
      category: dto.category,
      coverImageUrl: dto.coverImageUrl,
      audioUrl: dto.audioUrl,
      videoUrl: dto.videoUrl,
      documentUrl: dto.documentUrl,
      documentName: dto.documentName,
      documentType: dto.documentType,
      documentSize: dto.documentSize,
      teacherId: dto.teacherId,
      isPublished: dto.isPublished,
    };

    if (!dto.translations) {
      return this.prisma.teaching.update({
        where: { id },
        data: updates,
        include: { teacher: true, translations: true },
      });
    }

    const locales = dto.translations.map((t) => t.locale);

    await this.prisma.$transaction([
      this.prisma.teachingTranslation.deleteMany({
        where: { teachingId: id, locale: { notIn: locales } },
      }),
      ...dto.translations.map((translation) =>
        this.prisma.teachingTranslation.upsert({
          where: {
            teachingId_locale: {
              teachingId: id,
              locale: translation.locale,
            },
          },
          update: {
            title: translation.title,
            content: translation.content,
          },
          create: {
            teachingId: id,
            locale: translation.locale,
            title: translation.title,
            content: translation.content,
          },
        }),
      ),
    ]);

    return this.prisma.teaching.update({
      where: { id },
      data: updates,
      include: { teacher: true, translations: true },
    });
  }

  async remove(id: string) {
    return this.prisma.teaching.delete({ where: { id } });
  }
}
