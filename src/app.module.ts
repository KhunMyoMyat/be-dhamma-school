import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TeachersModule } from './teachers/teachers.module';
import { EventsModule } from './events/events.module';
import { TeachingsModule } from './teachings/teachings.module';
import { DonationsModule } from './donations/donations.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { LessonsModule } from './lessons/lessons.module';

import { AppController } from './app.controller';

function getUploadsRoot() {
  const candidate = join(__dirname, '..', 'uploads');
  if (existsSync(candidate)) return candidate;
  // When compiled, __dirname is typically dist/src; uploads live at project root.
  return join(__dirname, '..', '..', 'uploads');
}

@Module({
  controllers: [AppController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: getUploadsRoot(),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    TeachersModule,
    EventsModule,
    TeachingsModule,
    DonationsModule,
    ContactModule,
    UploadModule,
    LessonsModule,
  ],
})
export class AppModule {}
