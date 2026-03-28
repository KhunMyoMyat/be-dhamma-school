import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  youtubeId: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
