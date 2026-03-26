import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { EventsModule } from './events/events.module';
import { TeachingsModule } from './teachings/teachings.module';
import { DonationsModule } from './donations/donations.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

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
    PrismaModule,
    AuthModule,
    CoursesModule,
    TeachersModule,
    EventsModule,
    TeachingsModule,
    DonationsModule,
    ContactModule,
    UploadModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}
