import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;
 
  @IsOptional()
  @IsString()
  eventId?: string;
 
  @IsOptional()
  @IsString()
  sponsorType?: string;
}
