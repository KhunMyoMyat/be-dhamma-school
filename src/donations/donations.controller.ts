import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/donation.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MonthlyDonorsQueryDto } from './dto/monthly-donors.dto';

@Controller('donations')
export class DonationsController {
  constructor(private donationsService: DonationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.donationsService.findAll(query);
  }

  @Post()
  create(@Body() dto: CreateDonationDto) {
    return this.donationsService.create(dto);
  }

  @Get('stats')
  getStats() {
    return this.donationsService.getStats();
  }

  @Get('monthly-donors')
  getMonthlyDonors(@Query() query: MonthlyDonorsQueryDto) {
    return this.donationsService.getMonthlyDonors(query);
  }
}
