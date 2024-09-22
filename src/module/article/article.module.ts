import { Module } from '@nestjs/common';
import { ArticleController } from 'src/controllers/article/article.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleService } from 'src/services/article/article.service';

@Module({
    controllers: [ArticleController],
    providers: [PrismaService, ArticleService],
})
export class ArticleModule {}
