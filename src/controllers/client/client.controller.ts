// src/controllers/client/client.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage, fileFilter, limits } from 'src/configs/multerConfig';
import { ClientService } from 'src/services/client/client.service';

@Controller('/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  // Ajouter un nouveau client avec une photo
  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage, fileFilter, limits }))
  async store(@Body() data: any, @UploadedFile() file: Express.Multer.File) {
    try {
      return await this.clientService.store(data, file);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Récupérer tous les clients
  @Get()
  async show() {
    try {
      return await this.clientService.show();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Récupérer un client par ID
  @Get('/:id')
  async findClientById(@Param('id') id: string) {
    try {
      const clientId = parseInt(id, 10); // Convertit en entier
      return await this.clientService.findClientById(clientId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Récupérer un client par téléphone
  @Post('/telephone')
  async editByTelephone(@Body('telephone') telephone: string) {
    try {
      return await this.clientService.editByTelephone(telephone);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Mettre à jour un client par ID
  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    try {
        const clientId = parseInt(id, 10); // Convertit en entier
      return await this.clientService.update(clientId, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Supprimer un client par ID
  @Delete('/:id')
  async deleteClient(@Param('id') id: number) {
    try {
      return await this.clientService.deleteClient(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Récupérer tous les utilisateurs avec leurs clients
  @Get('/users')
  async getAllUsersWithClients() {
    try {
      return await this.clientService.getAllUsersWithClients();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
