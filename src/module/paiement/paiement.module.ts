import { Module } from '@nestjs/common';
import { PaiementController } from 'src/controllers/paiement/paiement.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaiementService } from 'src/services/paiement/paiement.service';

@Module({
    controllers: [PaiementController],
    providers: [PrismaService, PaiementService],
})
export class PaiementModule {}
