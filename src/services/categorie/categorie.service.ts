import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategorieService {
constructor(private readonly prisma: PrismaService) {
   
}
  // Méthode pour récupérer tous les articles
  async show(): Promise<any> {
    try {
      return await this.prisma.categorie.findMany({
        select: {
          id: true,
          libelle: true,
        },
      });
    } catch (error) {
      throw new Error('Unable to fetch articles');
    }
  }

  // Méthode pour ajouter un nouvel article
  async store(data: any): Promise<any> {
    try {
      return await this.prisma.categorie.create({
        data,
      });
    } catch (error) {
      throw new Error('Unable to create article');
    }
  }
}
