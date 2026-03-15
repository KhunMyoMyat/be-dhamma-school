import { Module } from '@nestjs/common';
import { TeachingsController } from './teachings.controller';
import { TeachingsService } from './teachings.service';

@Module({
  controllers: [TeachingsController],
  providers: [TeachingsService],
})
export class TeachingsModule {}
