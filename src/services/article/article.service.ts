import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArticleService   {
  constructor(private readonly prisma: PrismaService) {
  }

  // Méthode pour récupérer tous les articles
  async show(): Promise<any> {
    try {
      return await this.prisma.article.findMany({
        select: {
          id: true,
          libelle: true,
          prix: true,
          quantiteStock: true,
          prixDetail: true,
          promotion: true,
          categorieId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error('Unable to fetch articles');
    }
  }

  // Méthode pour ajouter un nouvel article
  async store(data: any): Promise<any> {
    try {
      return await this.prisma.article.create({
        data,
      });
    } catch (error) {
      throw new Error('Unable to create article');
    }
  }

  // Méthode pour supprimer un article
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.article.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Unable to delete article');
    }
  }

  // Méthode pour mettre à jour un article
  async update(id: number, data: any): Promise<any> {
    try {
      return await this.prisma.article.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error('Unable to update article');
    }
  }

  // Méthode pour récupérer un article par son libellé
async findArticleByLibelle(libelle: string): Promise<any> {
    try {
      return await this.prisma.article.findUniqueOrThrow({
        where: { libelle },
        select: {
          id: true,
          libelle: true,
          prix: true,
          quantiteStock: true,
          prixDetail: true,
          promotion: true,
          categorieId: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error('Error in findArticleByLibelle:', error);
      throw new Error('Article not found');
    }
  }
  
  // Méthode pour mettre à jour un article selon la quantité en stock
  async editByQuantite(id: number, quantiteStock: number): Promise<any> {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        throw new Error('Article not found');
      }

      const newQuantiteStock = article.quantiteStock + quantiteStock;

      return await this.prisma.article.update({
        where: { id },
        data: {
          quantiteStock: newQuantiteStock,
        },
      });
    } catch (error) {
      throw new Error('An error occurred while updating the article');
    }
  }
}
