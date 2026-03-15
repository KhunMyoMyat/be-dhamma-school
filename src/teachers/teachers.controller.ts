import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.teachersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teachersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeacherDto) {
    return this.teachersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
