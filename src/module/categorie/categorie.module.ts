import { Module } from '@nestjs/common';
import { CategorieController } from 'src/controllers/categorie/categorie.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategorieService } from 'src/services/categorie/categorie.service';

@Module({
    controllers: [CategorieController],
    providers: [PrismaService, CategorieService],
})
export class CategorieModule {}
