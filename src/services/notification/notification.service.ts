import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import { Cron, CronExpression } from '@nestjs/schedule'; 

@Injectable()
export class NotificationService {
  private vonage: Vonage;

  constructor(private readonly prisma: PrismaService) {
    const auth = new Auth({
      apiKey: '16c03b77',    
      apiSecret: 'IaxIWR8bvUTUCxdS',  
    });

    this.vonage = new Vonage(auth);  
  }

  // Méthode qui sera appelée automatiquement tous les jours à minuit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkDueDebtsAndNotify(): Promise<any[]> {
    const today = new Date();
    try {
      const dueDebts = await this.prisma.dette.findMany({
        where: {
          dateEcheance: {
            lte: today, // Vérifie si la date d'échéance est aujourd'hui ou avant
          },
        },
        include: {
          client: true, // Inclut les informations du client pour l'envoi du SMS
        },
      });

      for (const dette of dueDebts) {
        const notification = await this.prisma.notification.create({
          data: {
            cumuleDette: dette.montantDue,
            description: `Votre dette de ${dette.montantDue} est arrivée à échéance.`,
            date: new Date(),
            clientId: dette.clientId,
          },
        });

        // Message personnalisé à envoyer au client
        const message = `Bonjour ${dette.client.nom}, votre dette de ${dette.montantDue} est arrivée à échéance. Merci de la régler.`;
        await this.sendSMS(dette.client.telephone, message); // Envoie le SMS au client
      }

      return dueDebts; // Retourne les dettes traitées
    } catch (error) {
      console.error('Erreur lors de la vérification des dettes à échéance:', error);
      throw new Error('Unable to check due debts and send notifications');
    }
  }

  private async sendSMS(phoneNumber: string, message: string) {
    try {
      const from = 'Vonage'; // Nom de l'expéditeur
      const to = phoneNumber;
      const text = message;

      await this.vonage.sms.send({ to, from, text });
      console.log(`SMS envoyé à ${phoneNumber}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
    }
  }

  async show(): Promise<any> {
    try {
      return await this.prisma.notification.findMany({
        select: {
          id: true,
          date: true,
          description: true,
          cumuleDette: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error('Unable to fetch notifications');
    }
  }

  async store(data: any): Promise<any> {
    try {
      console.log('Data received for notification:', data);
      const notification = await this.prisma.notification.create({
        data,
      });

      const client = await this.prisma.client.findUnique({
        where: { id: notification.clientId },
      });

      if (client) {
        const message = `Bonjour ${client.nom}, votre dette de ${notification.cumuleDette} est arrivée à échéance. Merci de la régler.`;
        await this.sendSMS(client.telephone, message); 
      }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Unable to create notification');
    }
  }
}
