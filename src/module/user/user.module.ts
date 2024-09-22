import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from 'src/controllers/user/user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/services/user/user.service';

@Module({
    imports: [ConfigModule],
    controllers: [UserController],
    providers: [PrismaService, UserService],
})
export class UserModule {}
