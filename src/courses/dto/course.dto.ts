import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleMm?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  descriptionMm?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  teacherId?: string;
}

export class UpdateCourseDto {
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
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
