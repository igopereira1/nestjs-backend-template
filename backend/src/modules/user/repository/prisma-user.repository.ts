import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { UserRepository } from './abstract-user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import { CryptoService } from '../../../modules/crypto/abstract.crypto.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {
    super();
  }

  async create(data: CreateUserDto): Promise<User> {
    const passwordHash = await this.cryptoService.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: passwordHash,
      },
    });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { email } });
  }

  async update(data: UpdateUserDto, id: string): Promise<User> {
    return await this.prisma.user.update({ where: { id }, data: { ...data } });
  }

  async getByForgotCode(code: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { forgotCode: code } });
  }
}
