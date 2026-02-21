import { Module } from '@nestjs/common';
import { CryptoModule } from '../../crypto/crypto.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminRepository } from '../shared/repository/admin.repository.abstract';
import { PrismaAdminRepository } from '../shared/repository/prisma-admin.repository';
import { AdminUsersController } from './admin-users.controller';
import { DefaultFindAllUsersUseCase } from './usecase/find-all-users.usecase';
import { FindAllUsersUseCase } from './usecase/find-all-users.usecase.abstract';
import { DefaultToggleUserStatusUseCase } from './usecase/toggle-user-status.usecase';
import { ToggleUserStatusUseCase } from './usecase/toggle-user-status.usecase.abstract';
import { DefaultFindUserByIdUseCase } from './usecase/find-user-by-id.usecase';
import { FindUserByIdUseCase } from './usecase/find-user-by-id.usecase.abstract';

const AdminRepositoryProvider = {
  provide: AdminRepository,
  useClass: PrismaAdminRepository,
};

const FindAllUsersUseCaseProvider = {
  provide: FindAllUsersUseCase,
  useClass: DefaultFindAllUsersUseCase,
};

const ToggleUserStatusUseCaseProvider = {
  provide: ToggleUserStatusUseCase,
  useClass: DefaultToggleUserStatusUseCase,
};

const FindUserByIdUseCaseProvider = {
  provide: FindUserByIdUseCase,
  useClass: DefaultFindUserByIdUseCase,
};

@Module({
  imports: [PrismaModule, CryptoModule],
  controllers: [AdminUsersController],
  providers: [
    AdminRepositoryProvider,
    FindAllUsersUseCaseProvider,
    ToggleUserStatusUseCaseProvider,
    FindUserByIdUseCaseProvider,
  ],
})
export class AdminUsersModule {}
