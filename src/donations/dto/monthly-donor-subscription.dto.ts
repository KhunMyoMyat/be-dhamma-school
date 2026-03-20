import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMonthlyDonorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateMonthlyDonorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  status?: string; // pending, active, inactive

  @IsOptional()
  @IsDateString()
  startDate?: string;
}
