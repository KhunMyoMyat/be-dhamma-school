import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, QueryEventDto } from './dto/event.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll(@Query() query: QueryEventDto) {
    return this.eventsService.findAll(query);
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Get('past')
  findPast(@Query() query: QueryEventDto) {
    return this.eventsService.findPast(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
