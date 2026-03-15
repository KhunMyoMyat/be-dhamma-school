import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { TeachersModule } from './teachers/teachers.module';
import { EventsModule } from './events/events.module';
import { TeachingsModule } from './teachings/teachings.module';
import { DonationsModule } from './donations/donations.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
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
  ],
})
export class AppModule {}
