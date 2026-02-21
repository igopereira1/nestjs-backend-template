import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { UserRepository } from './user.repository.abstract';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '@prisma/client';
import { CryptoService } from 'src/modules/crypto/crypto.service.abstract';
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
    return this.prisma.user.findFirst({ where: { email } });
  }

  async update(data: UpdateUserDto, id: string): Promise<User> {
    return this.prisma.user.update({ where: { id }, data: { ...data } });
  }

  async getByForgotCode(code: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { forgotCode: code } });
  }

  async setForgotCode(
    id: string,
    code: string | null,
    expiresIn: Date | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        forgotCode: code,
        forgotCodeExpiration: expiresIn,
      },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        password: passwordHash,
        forgotCode: null,
        forgotCodeExpiration: null,
      },
    });
  }

  async setConfirmationCode(
    id: string,
    code: string | null,
    expiresIn: Date | null,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        confirmationCode: code,
        confirmationCodeExpiration: expiresIn,
      },
    });
  }

  async getByConfirmationCode(code: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { confirmationCode: code } });
  }

  async activateAccount(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmationCode: null,
        confirmationCodeExpiration: null,
      },
    });
  }
}
