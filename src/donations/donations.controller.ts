import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/donation.dto';
import { PaginationDto } from '../common/dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MonthlyDonorsQueryDto } from './dto/monthly-donors.dto';
import { CreateMonthlyDonorDto, UpdateMonthlyDonorDto } from './dto/monthly-donor-subscription.dto';
import { Put, Delete, Param } from '@nestjs/common';

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

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.donationsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.donationsService.delete(id);
  }

  @Get('stats')
  getStats() {
    return this.donationsService.getStats();
  }

  @Get('monthly-donors')
  getMonthlyDonors(@Query() query: MonthlyDonorsQueryDto) {
    return this.donationsService.getMonthlyDonors(query);
  }

  // --- Monthly Donor Subscriptions ---

  @Post('monthly-donor-subscriptions')
  registerMonthlyDonor(@Body() dto: CreateMonthlyDonorDto) {
    return this.donationsService.registerMonthlyDonor(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('monthly-donor-subscriptions')
  findAllMonthlyDonors(@Query() query: PaginationDto) {
    return this.donationsService.findAllMonthlyDonors(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put('monthly-donor-subscriptions/:id')
  updateMonthlyDonor(@Param('id') id: string, @Body() dto: UpdateMonthlyDonorDto) {
    return this.donationsService.updateMonthlyDonor(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('monthly-donor-subscriptions/:id')
  deleteMonthlyDonor(@Param('id') id: string) {
    return this.donationsService.deleteMonthlyDonor(id);
  }
}
