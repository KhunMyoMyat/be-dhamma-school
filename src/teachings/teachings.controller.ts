import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TeachingsService } from './teachings.service';
import { CreateTeachingDto, UpdateTeachingDto } from './dto/teaching.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('teachings')
export class TeachingsController {
  constructor(private teachingsService: TeachingsService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.teachingsService.findAll(query);
  }

  @Get('published')
  findPublished(@Query() query: PaginationDto) {
    return this.teachingsService.findPublished(query);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string, @Query() query: PaginationDto) {
    return this.teachingsService.findByCategory(category, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTeachingDto) {
    return this.teachingsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeachingDto) {
    return this.teachingsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachingsService.remove(id);
  }
}
