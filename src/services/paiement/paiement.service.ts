import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaiementService {
  constructor(private readonly prisma: PrismaService) {}

  // Méthode pour créer un paiement
  async store(data: {
    detteId: number;
    montant: number;
    date: Date;
  }): Promise<any> {
    try {
      return await this.prisma.paiement.create({
        data: {
          dette: { connect: { id: data.detteId } },
          montant: data.montant,
          date: data.date,
        },
      });
    } catch (error) {
      throw new ConflictException('Impossible de créer le paiement');
    }
  }

  // Méthode pour récupérer tous les paiements
  async show(): Promise<any[]> {
    try {
      return await this.prisma.paiement.findMany({
        select: {
          id: true,
          detteId: true,
          montant: true,
          date: true,
          createdAt: true,
          updatedAt: true,
          dette: true,
        },
      });
    } catch (error) {
      throw new Error('Impossible de récupérer les paiements');
    }
  }

  // Méthode pour récupérer les paiements par ID de dette
  async findPaiementById(id: number): Promise<any> {
    try {
      return await this.prisma.paiement.findUnique({
        where: { id },
        select: {
            id: true,
            detteId: true,
            montant: true,
            date: true,
            createdAt: true,
            updatedAt: true,
            dette: true,
          },
      });
    } catch (error) {
      throw new Error('paiement non trouvé');
    }
  }
}