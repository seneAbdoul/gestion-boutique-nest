import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; 
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   dotenv.config();
   
  app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.setGlobalPrefix('/api/v1');
  
  await app.listen(3001);
}
bootstrap();
