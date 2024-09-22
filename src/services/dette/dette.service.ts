import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DetteService {
  constructor(private readonly prisma: PrismaService) {
  }

  // Méthode pour ajouter une nouvelle dette
  async store(data: {
    clientId: number;
    date: Date;
    montantDue: number;
    montantVerser: number;
    statut: string;
    etat: boolean;
    articles?: { articleId: number; quantiteArticleDette: number }[];
  }): Promise<any> {
    try {
      return await this.prisma.dette.create({
        data: {
          client: { connect: { id: data.clientId } },
          date: data.date,
          montantDue: data.montantDue,
          montantVerser: data.montantVerser,
          statut: data.statut,
          etat: data.etat,
          ArticleDette: {
            create: data.articles?.map(article => ({
              article: { connect: { id: article.articleId } },
              quantiteArticleDette: article.quantiteArticleDette,
            })),
          },
        },
      });
    } catch (error) {
      throw new ConflictException('Impossible de créer la dette');
    }
  }
  

  // Méthode pour récupérer toutes les dettes
  async show(): Promise<any[]> {
    try {
      return await this.prisma.dette.findMany({
        select: {
          id: true,
          clientId: true,
          date: true,
          montantDue: true,
          montantVerser: true,
          statut: true,
          etat: true,
          createdAt: true,
          updatedAt: true,
          client: true,
          articles: true,
          Paiement: true,
          ArticleDette: true,
        },
      });
    } catch (error) {
      throw new Error('Impossible de récupérer les dettes');
    }
  }

  // Méthode pour récupérer une dette à partir de son ID
  async findById(id: number): Promise<any> {
    try {
      const dette = await this.prisma.dette.findUnique({
        where: { id },
        select: {
          id: true,
          clientId: true,
          date: true,
          montantDue: true,
          montantVerser: true,
          statut: true,
          etat: true,
          client: true,
          articles: true,
          Paiement: true,
          ArticleDette: true,
        },
      });

      if (!dette) {
        throw new NotFoundException(`Dette avec ID ${id} non trouvée`);
      }

      return dette;
    } catch (error) {
      throw new Error('Erreur lors de la recherche de la dette');
    }
  }

  // Méthode pour récupérer une dette par le client ID
  async findByClientId(clientId: number): Promise<any[]> {
    try {
      return await this.prisma.dette.findMany({
        where: { clientId },
        select: {
          id: true,
          clientId: true,
          date: true,
          montantDue: true,
          montantVerser: true,
          statut: true,
          etat: true,
          client: true,
          articles: true,
          Paiement: true,
          ArticleDette: true,
        },
      });
    } catch (error) {
      throw new Error('Erreur lors de la recherche des dettes par client ID');
    }
  }


  // Méthode pour mettre à jour le statut d'une dette
  async updateStatut(id: number, statut: string): Promise<any> {
    try {
      // Vérifier si la dette existe
      const existingDette = await this.prisma.dette.findUnique({
        where: { id },
      });

      if (!existingDette) {
        throw new NotFoundException(`Dette avec ID ${id} non trouvée`);
      }

      // Mettre à jour le statut de la dette
      return await this.prisma.dette.update({
        where: { id },
        data: { statut },
        select: {
          id: true,
          statut: true,
          date: true,
          montantDue: true,
          montantVerser: true,
          client: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              telephone: true,
            },
          },
          ArticleDette: {
            select: {
              articleId: true,
              quantiteArticleDette: true,
              article: {
                select: {
                  id: true,
                  libelle: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du statut de la dette');
    }
  }

}
