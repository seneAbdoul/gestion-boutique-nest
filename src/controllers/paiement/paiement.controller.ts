import { Controller, Post, Get, Param, Body, NotFoundException, ConflictException } from '@nestjs/common';
import { PaiementService } from '../../services/paiement/paiement.service';

@Controller('/paiements')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  // Route pour créer un paiement
  @Post()
  async store(@Body() body: { detteId: number; montant: number; date: Date }) {
    try {
      const paiement = await this.paiementService.store(body);
    } catch (error) {
      throw new Error('Erreur lors de la création du paiement');
    }
  }

  // Route pour récupérer tous les paiements
  @Get()
  async show() {
    try {
      const paiements = await this.paiementService.show();
      return { status: 'success', data: paiements };
    } catch (error) {
      throw new Error('Erreur lors de la récupération des paiements');
    }
  }

  // Route pour récupérer un paiement par ID
  @Get('/:id')
  async findPaiementById(@Param('id') id: string) {
    try {
        const paiementId = parseInt(id, 10); 
      return await this.paiementService.findPaiementById(paiementId);
    } catch (error) {
      throw new Error('Erreur lors de la recherche du paiement');
    }
  }
}
