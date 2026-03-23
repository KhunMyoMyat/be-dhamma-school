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

  async approveSponsorship(id: string) {
    const inquiry = await this.prisma.contactInquiry.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!inquiry || !inquiry.eventId) {
      throw new Error('Sponsorship inquiry not found or missing event reference.');
    }

    // Update inquiry status
    const updated = await this.prisma.contactInquiry.update({
      where: { id },
      data: { status: 'approved', isRead: true },
    });

    // Update event sponsor info based on type
    if (inquiry.event) {
      if (inquiry.sponsorType === 'main') {
        // Set as main sponsor
        await this.prisma.event.update({
          where: { id: inquiry.eventId },
          data: { 
            mainSponsor: inquiry.name,
            mainSponsorMm: inquiry.name // Using same name for MM
          }
        });
      } else {
        // Handle as co-sponsor (default)
        const currentCoSponsors = Array.isArray(inquiry.event.coSponsors) 
          ? (inquiry.event.coSponsors as any[]) 
          : [];
        
        const alreadyExists = currentCoSponsors.some(s => s.name === inquiry.name);
        
        if (!alreadyExists) {
          const newCoSponsors = [...currentCoSponsors, { name: inquiry.name, nameMm: inquiry.name }];
          await this.prisma.event.update({
            where: { id: inquiry.eventId },
            data: { coSponsors: newCoSponsors }
          });
        }
      }
    }

    return updated;
  }

  async remove(id: string) {
    return this.prisma.contactInquiry.delete({ where: { id } });
  }
}
