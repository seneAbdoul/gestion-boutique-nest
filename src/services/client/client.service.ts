import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import cloudinary from 'src/configs/cloudinaryConfig';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {
   
  }

  async store(data: any, file: Express.Multer.File): Promise<any> {
    try {
      let photoUrl = '';
      
      if (file && file.path) {
        // Enregistrez l'URL de la photo dans Cloudinary et obtenez l'URL
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: 'user_gestion_dette',
          resource_type: 'auto',
        });
        photoUrl = uploadedImage.secure_url;
      } else {
        console.warn('Aucun fichier photo reçu ou échec du téléchargement');
      }

      return await this.prisma.client.create({
        data: {
          ...data,
          photo: photoUrl, // Stockez l'URL sécurisée de la photo
        },
      });
      
    } catch (error) {
      throw new Error('Impossible de créer le client');
    }
  }

  // Méthode pour récupérer tous les clients
  async show(): Promise<any> {
    try {
      return await this.prisma.client.findMany({
        select: {
          id: true,
          nom: true,
          prenom: true,
          telephone: true,
          adresse: true,
          genre: true,
          photo: true,
          user: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error('Impossible de récupérer les clients');
    }
  }

  // Méthode pour récupérer un client à partir de son ID
  async findClientById(id: number): Promise<any> {
    try {
      return await this.prisma.client.findUnique({
        where: { id },
        select: {
          id: true,
          nom: true,
          prenom: true,
          telephone: true,
          adresse: true,
          genre: true,
          photo: true,
          user: true,
        },
      });
    } catch (error) {
      throw new Error('Client non trouvé');
    }
  }

  // Méthode pour récupérer un client par son téléphone
  async editByTelephone(telephone: string): Promise<any> {
    try {
      return await this.prisma.client.findMany({
        where: { telephone },
        select: {
          id: true,
          nom: true,
          prenom: true,
          telephone: true,
          adresse: true,
          genre: true,
          photo: true,
          user: true,
        },
      });
    } catch (error) {
      throw new Error('Client non trouvé');
    }
  }

  // Méthode pour mettre à jour un client
  async update(id: number, data: any): Promise<any> {
    try {
      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error('Impossible de mettre à jour le client');
    }
  }

  // Méthode pour supprimer un client
  async deleteClient(id: number): Promise<any> {
    try {
      await this.prisma.client.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Impossible de supprimer le client');
    }
  }

  // Méthode pour récupérer tous les utilisateurs avec leurs clients
  async getAllUsersWithClients(): Promise<any> {
    try {
      return await this.prisma.user.findMany({
        include: {
          client: true,
        },
      });
    } catch (error) {
      throw new Error('Impossible de récupérer les utilisateurs avec leurs clients');
    }
  }
}
