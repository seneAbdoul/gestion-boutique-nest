import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ArticleModule } from './module/article/article.module'; 
import { CategorieModule } from './module/categorie/categorie.module'; 
import { ClientModule } from './module/client/client.module';
import { DetteModule } from './module/dette/dette.module';
import { PaiementModule } from './module/paiement/paiement.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [ArticleModule, CategorieModule, ClientModule, DetteModule, PaiementModule, UserModule], 
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

