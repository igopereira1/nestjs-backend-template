import { Module } from '@nestjs/common';
import { CryptoModule } from '../crypto/crypto.module';
import { MailerModule } from '../mailer/mailer.module';
import { UploadModule } from '../upload/upload.module';
import { PrismaUserRepository } from './repository/prisma-user.repository';
import { UserRepository } from './repository/user.repository.abstract';
import { DefaultCreateUserUseCase } from './usecase/create-user.usecase';
import { CreateUserUseCase } from './usecase/create-user.usecase.abstract';
import { UserController } from './user.controller';

const UserRepositoryProvider = {
  provide: UserRepository,
  useClass: PrismaUserRepository,
};

const CreateUserUseCaseProvider = {
  provide: CreateUserUseCase,
  useClass: DefaultCreateUserUseCase,
};

@Module({
  imports: [CryptoModule, UploadModule, MailerModule],
  controllers: [UserController],
  providers: [UserRepositoryProvider, CreateUserUseCaseProvider],
  exports: [UserRepositoryProvider],
})
export class UserModule {}
