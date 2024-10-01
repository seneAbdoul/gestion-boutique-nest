import { Controller, Get, Post, HttpCode, HttpStatus, HttpException, Body } from '@nestjs/common';
import { NotificationService } from 'src/services/notification/notification.service';

@Controller('/notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // Méthode pour afficher toutes les notifications
    @Get()
    @HttpCode(HttpStatus.OK)
    async show(): Promise<any> {
      try {
          return await this.notificationService.show();
      } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    // Méthode pour ajouter une nouvelle notification et envoyer un SMS
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async store(@Body() body: any): Promise<any> {
      try {
        return await this.notificationService.store(body);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
}
