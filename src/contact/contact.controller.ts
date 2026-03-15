import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.contactService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
