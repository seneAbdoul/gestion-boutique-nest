import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ArticleService } from '../../services/article/article.service';

@Controller('/articles') // Pas besoin de répéter '/api/v1'
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // Méthode pour afficher tous les articles
  @Get()
  @HttpCode(HttpStatus.OK)
  async show(): Promise<any> {
    try {
        return await this.articleService.show();
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
  }

  // Méthode pour afficher un article par son libellé
  @Post('/libelle')
  @HttpCode(HttpStatus.OK)
  async findByLibelle(@Body('libelle') libelle: string): Promise<any> {
    try {
      return this.articleService.findArticleByLibelle(libelle);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Méthode pour ajouter un nouvel article
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() body: any): Promise<any> {
    return this.articleService.store(body);
  }

  // Méthode pour mettre à jour un article
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseIntPipe) id: string, @Body() body: any): Promise<any> {
    try {
        const articleId = parseInt(id, 10);
        return this.articleService.update(articleId, body);
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);  
    }
  
  }

  // Méthode pour mettre à jour la quantité d'un article
  @Put('/quantite/:id')
  @HttpCode(HttpStatus.OK)
  async updateQuantity(@Param('id', ParseIntPipe) id: number, @Body('quantiteStock') quantiteStock: number): Promise<any> {
    return this.articleService.editByQuantite(id, quantiteStock);
  }

  // Méthode pour supprimer un article
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.articleService.remove(id);
  }
}
