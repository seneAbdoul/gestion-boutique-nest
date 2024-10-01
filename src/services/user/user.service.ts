import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client'; 
import * as nodemailer from 'nodemailer'; 
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRATION: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get<string>('JSECRET_ACCESS_TOKEN');
    this.JWT_EXPIRATION = this.configService.get<string>('JSECRET_TIME_TO_EXPIRE');
  }

  // Configuration Nodemailer
  private createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Générer un QR code
  private async generateQRCode(data: string): Promise<string> {
    try {
      const qrCodeUrl = await QRCode.toDataURL(data);
      console.log('QR Code URL:', qrCodeUrl); 
      return qrCodeUrl;
    } catch (error) {
      console.error('Erreur lors de la génération du QR code', error);
      throw new Error('Erreur lors de la génération du QR code');
    }
  }
  
  private async sendWelcomeEmail(to: string, clientData: { nom: string; prenom: string; adresse: string; telephone: string; genre: string; photo: string }): Promise<void> {
    const transporter = this.createTransporter();

    // Préparer les données du QR Code
    const qrCodeData = `
      Nom: ${clientData.nom}
      Prénom: ${clientData.prenom}
      Téléphone: ${clientData.telephone}
      Genre: ${clientData.genre}
      Adresse: ${clientData.adresse}
    `;
    const qrCodeImageUrl = await this.generateQRCode(qrCodeData);  // Générer le QR Code avec plus de données

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Bienvenue chez Nous',
        html: `
        <body style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f3f4f6;">
            <div style="background-color: #ffffff; padding: 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); max-width: 800px; width: 100%;">
                <div style="display: flex;">

                    <!-- Colonne Gauche - Formulaire -->
                    <div style="width: 66.6667%; padding-right: 32px;">
                        
                        <!-- Profil Section -->
                        <div style="display: flex; justify-content: center; margin-bottom: 16px;">
                            <div style="width: 96px; height: 96px; background-color: #e5e7eb; border-radius: 9999px; display: flex; align-items: center; justify-content: center;">
                                <img src="${clientData.photo}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 9999px;">
                            </div>
                        </div>

                        <!-- Formulaire -->
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Nom :</label>
                            <input type="text" value="${clientData.nom}" readonly style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Prénom :</label>
                            <input type="text" value="${clientData.prenom}" readonly style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Téléphone :</label>
                            <input type="text" value="${clientData.telephone}" readonly style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Genre :</label>
                            <input type="text" value="${clientData.genre}" readonly style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; color: #374151; font-weight: bold; margin-bottom: 8px;">Adresse :</label>
                            <input type="text" value="${clientData.adresse}" readonly style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background-color: #f9fafb;">
                        </div>
                    </div>

                      <!-- Colonne Droite - QR Code -->
                      <div style="flex: 1 1 40%; display: flex; justify-content: center; align-items: center; background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 16px;">
                         <!-- Exemple avec une image QR code encodée en base64 -->
                         <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAADkCAYAAACIV4iNAAAAAklEQVR4Aewa..." alt="QR Code" width="200" height="200" style="border: 1px solid #d1d5db; border-radius: 8px;">
                       </div>
                </div>
            </div>
        </body>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email envoyé avec succès à ${to}: ${info.response}`);
    } catch (error) {
        console.error(`Erreur lors de l'envoi de l'email à ${to}: ${error.message}`);
    }
}






  // Méthode pour l'inscription d'un utilisateur
  async register(data: { mail: string; password: string; role: Role; clientId?: number }): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          mail: data.mail,
          password: hashedPassword,
          role: data.role,
          clientId: data.clientId,
        },
        include: {
          client: true,
        },
      });

      // Récupérer les données du client
      const clientData = newUser.client;

      // Envoyer un email après l'inscription avec les données du client
      await this.sendWelcomeEmail(newUser.mail, {
        nom: clientData.nom,
        prenom: clientData.prenom,
        telephone: clientData.telephone,
        adresse: clientData.adresse,
        genre: clientData.genre,
        photo: clientData.photo,
      });

      return { message: 'Utilisateur créé avec succès et email envoyé', user: newUser };
    } catch (error) {
      throw new ConflictException('Erreur lors de l\'inscription de l\'utilisateur');
    }
  }

  // Méthode pour la connexion d'un utilisateur
  async login(data: { mail: string; password: string }): Promise<any> {
    const { mail, password } = data;

    try {
      const user = await this.prisma.user.findUnique({
        where: { mail },
        include: { client: true },
      });

      if (!user) {
        throw new UnauthorizedException('Adresse e-mail incorrecte');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Mot de passe incorrect');
      }

      const token = jwt.sign({ id: user.id, email: user.mail, role: user.role, clientId: user.clientId }, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRATION,
      });

      return { message: 'Connexion réussie', token };
    } catch (error) {
      throw new UnauthorizedException('Erreur lors de la connexion');
    }
  }

  // Méthode pour récupérer tous les utilisateurs
  async getAllUsers(): Promise<any> {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          client: true,
        },
      });

      return { users };
    } catch (error) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  }
}
