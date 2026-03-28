import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  extractYoutubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  async getYoutubeMetadata(url: string) {
    const videoId = this.extractYoutubeId(url);
    if (!videoId) throw new BadRequestException('Invalid YouTube URL');

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) throw new BadRequestException('YouTube API key not configured');

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        return {
          title: snippet.title,
          description: snippet.description,
          thumbnail: snippet.thumbnails?.maxresdefault?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
          videoId,
        };
      }
      throw new NotFoundException('Video metadata not found');
    } catch (error) {
      console.error("Error fetching YouTube metadata:", error);
      throw new BadRequestException('Failed to fetch metadata from YouTube');
    }
  }


  async create(createLessonDto: CreateLessonDto) {
    return this.prisma.lesson.create({
      data: {
        title: createLessonDto.title,
        description: createLessonDto.description,
        youtubeId: createLessonDto.youtubeId,
        category: createLessonDto.category,
        published: createLessonDto.published ?? false,
      },
    });
  }

  async findAll(publishedOnly?: boolean) {
    const where = publishedOnly ? { published: true } : {};
    return this.prisma.lesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
