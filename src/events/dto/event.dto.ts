import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { PaginationDto } from '../../common/dto';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleMm?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionMm?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  mainSponsor?: string;

  @IsOptional()
  @IsString()
  mainSponsorMm?: string;

  @IsOptional()
  coSponsors?: any[];
}

export class QueryEventDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  titleMm?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionMm?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  mainSponsor?: string;

  @IsOptional()
  @IsString()
  mainSponsorMm?: string;

  @IsOptional()
  coSponsors?: any[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
