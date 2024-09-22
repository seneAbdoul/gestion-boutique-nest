import { Module } from '@nestjs/common';
import { ClientController } from 'src/controllers/client/client.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/services/client/client.service';

@Module({
    controllers: [ClientController],
    providers: [PrismaService, ClientService],
})
export class ClientModule {}
