import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { Role } from '@prisma/client';

@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route pour l'inscription d'un utilisateur
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: { mail: string; password: string; role: Role; clientId?: number },
  ): Promise<any> {
    return this.userService.register(body);
  }

  // Route pour la connexion d'un utilisateur
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { mail: string; password: string }): Promise<any> {
    return this.userService.login(body);
  }

  // Route pour récupérer tous les utilisateurs
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }

}

