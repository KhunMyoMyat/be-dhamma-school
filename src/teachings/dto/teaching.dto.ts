import { IsString, IsOptional, IsBoolean, IsInt, IsArray, ValidateNested, ArrayMinSize, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class TeachingTranslationDto {
  @IsString()
  @IsIn(['mm', 'en', 'th'])
  locale: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class CreateTeachingDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TeachingTranslationDto)
  translations: TeachingTranslationDto[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsString()
  documentName?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsInt()
  documentSize?: number;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateTeachingDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TeachingTranslationDto)
  translations?: TeachingTranslationDto[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;

  @IsOptional()
  @IsString()
  documentName?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsInt()
  documentSize?: number;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
