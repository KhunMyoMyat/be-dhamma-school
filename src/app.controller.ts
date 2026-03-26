import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): { message: string; status: string; timestamp: string } {
    return {
      message: 'Welcome to Dhamma School API',
      status: 'success',
      timestamp: new Date().toISOString(),
    };
  }
}
