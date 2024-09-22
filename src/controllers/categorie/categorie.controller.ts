import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategorieService } from 'src/services/categorie/categorie.service';

@Controller('/categories')
export class CategorieController {
    constructor(private readonly categorieService: CategorieService) {}

    // Méthode pour afficher tous les articles
    @Get()
    @HttpCode(HttpStatus.OK)
    async show(): Promise<any> {
      return this.categorieService.show();
    }
  

    // Méthode pour ajouter un nouvel article
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@Body() body: any): Promise<any> {
      return this.categorieService.store(body);
    }
  
}
