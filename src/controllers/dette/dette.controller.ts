import { Controller, Post, Put, Get, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';
import { DetteService } from '../../services/dette/dette.service';  // Assurez-vous que le chemin est correct

@Controller('/dettes')
export class DetteController {
  constructor(private readonly detteService: DetteService) {}

  // Route pour ajouter une nouvelle dette
  @Post()
  async create(@Body() createDetteDto: {
    clientId: number;
    date: Date;
    montantDue: number;
    montantVerser: number;
    statut: string;
    etat: boolean;
    articles?: { articleId: number; quantiteArticleDette: number }[];
  }) {
    try {
      return await this.detteService.store(createDetteDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new ConflictException('Impossible de créer la dette');
    }
  }

  // Route pour récupérer toutes les dettes
  @Get()
  async findAll() {
    try {
      return await this.detteService.show();
    } catch (error) {
      throw new ConflictException('Impossible de récupérer les dettes');
    }
  }

  // Route pour récupérer une dette à partir de son ID
  @Get('/:id')
  async findById(@Param('id') id: string) {
    try {
      const detteId = parseInt(id, 10); // Convertit en entier
      return await this.detteService.findById(detteId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new ConflictException('Erreur lors de la recherche de la dette');
    }
  }

  // Route pour récupérer les dettes par client ID
  @Get('/client/:clientId')
  async findByClientId(@Param('clientId') clientId: string) {
    try {
        const clientelId = parseInt(clientId, 10);
      return await this.detteService.findByClientId(clientelId);
    } catch (error) {
      throw new ConflictException('Erreur lors de la recherche des dettes par client ID');
    }
  }
    // Méthode pour mettre à jour le statut d'une dette
    @Put('/:id/statut')
    async updateStatut(
      @Param('id') id: string,
      @Body('statut') statut: string,
    ) {
        try {
            const detteId = parseInt(id, 10);
            return this.detteService.updateStatut(detteId, statut);
        } catch (error) {
            throw new ConflictException('update failled');
        }
     
    }
}
