import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.coursesService.findAll(query);
  }

  @Get('active')
  findActive() {
    return this.coursesService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
