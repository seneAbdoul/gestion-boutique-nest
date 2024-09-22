import { Module } from '@nestjs/common';
import { DetteController } from 'src/controllers/dette/dette.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { DetteService } from 'src/services/dette/dette.service';

@Module({
    controllers: [DetteController],
    providers: [PrismaService, DetteService],
})
export class DetteModule {}
