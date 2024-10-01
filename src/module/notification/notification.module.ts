import { Module } from '@nestjs/common';
import { NotificationController } from 'src/controllers/notification/notification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/services/notification/notification.service';

@Module({
    controllers: [NotificationController],
    providers: [PrismaService, NotificationService],
})
export class NotificationModule {}
