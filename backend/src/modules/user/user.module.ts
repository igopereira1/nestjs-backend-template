import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { UserRepository } from './repository/abstract-user.repository';
import { PrismaUserRepository } from './repository/prisma-user.repository';

export const UserRepositoryProvider = {
  provide: UserRepository,
  useClass: PrismaUserRepository,
};

@Module({
  controllers: [UserController],
  providers: [CreateUserUseCase, UserRepositoryProvider],
  exports: [UserRepositoryProvider],
})
export class UserModule {}
