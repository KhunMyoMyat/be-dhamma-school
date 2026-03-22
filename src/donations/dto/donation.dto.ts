import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateDonationDto {
  @IsString()
  donorName: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  date?: string;
}
