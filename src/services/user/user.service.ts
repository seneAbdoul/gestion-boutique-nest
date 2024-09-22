import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client'; // Importer l'énumération Role

@Injectable()
export class UserService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRATION: string;

  constructor(private readonly prisma: PrismaService, private readonly configService: ConfigService) {
    this.JWT_SECRET = this.configService.get<string>('JSECRET_ACCESS_TOKEN');
    this.JWT_EXPIRATION = this.configService.get<string>('JSECRET_TIME_TO_EXPIRE');
    
    console.log('JWT_SECRET:', this.JWT_SECRET); 
    console.log('JWT_EXPIRATION:', this.JWT_EXPIRATION); 
  }

  // Méthode pour l'inscription d'un utilisateur
  async register(data: { mail: string; password: string; role: Role; clientId?: number }): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          mail: data.mail,
          password: hashedPassword,
          role: data.role, // Utiliser l'énumération Role
          clientId: data.clientId,
        },
        include: {
          client: true,
        },
      });

      return { message: 'Utilisateur créé avec succès', user: newUser };
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
