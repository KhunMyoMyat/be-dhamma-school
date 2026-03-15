import { IsString, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameMm?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  bioMm?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export class UpdateTeacherDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nameMm?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  bioMm?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
