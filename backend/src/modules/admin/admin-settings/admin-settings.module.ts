import { Module } from '@nestjs/common';
import { CryptoModule } from '../../crypto/crypto.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../../upload/upload.module';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminRepository } from '../shared/repository/admin.repository.abstract';
import { PrismaAdminRepository } from '../shared/repository/prisma-admin.repository';
import { DefaultCreateAdminUseCase } from './usecase/create-admin.usecase';
import { CreateAdminUseCase } from './usecase/create-admin.usecase.abstract';
import { DefaultFindAdminByIdUseCase } from './usecase/find-admin-by-id.usecase';
import { FindAdminByIdUseCase } from './usecase/find-admin-by-id.usecase.abstract';
import { DefaultFindAllAdminsUseCase } from './usecase/find-all-admins.usecase';
import { FindAllAdminsUseCase } from './usecase/find-all-admins.usecase.abstract';
import { DefaultFindAllPermissionsUseCase } from './usecase/find-all-permissions.usecase';
import { FindAllPermissionsUseCase } from './usecase/find-all-permissions.usecase.abstract';
import { DefaultUpdateAdminUseCase } from './usecase/update-admin.usecase';
import { UpdateAdminUseCase } from './usecase/update-admin.usecase.abstract';

const AdminRepositoryProvider = {
  provide: AdminRepository,
  useClass: PrismaAdminRepository,
};

const CreateAdminUseCaseProvider = {
  provide: CreateAdminUseCase,
  useClass: DefaultCreateAdminUseCase,
};

const FindAllAdminsUseCaseProvider = {
  provide: FindAllAdminsUseCase,
  useClass: DefaultFindAllAdminsUseCase,
};

const FindAdminByIdUseCaseProvider = {
  provide: FindAdminByIdUseCase,
  useClass: DefaultFindAdminByIdUseCase,
};

const UpdateAdminUseCaseProvider = {
  provide: UpdateAdminUseCase,
  useClass: DefaultUpdateAdminUseCase,
};

const FindAllPermissionsUseCaseProvider = {
  provide: FindAllPermissionsUseCase,
  useClass: DefaultFindAllPermissionsUseCase,
};

@Module({
  imports: [PrismaModule, UploadModule, CryptoModule],
  controllers: [AdminSettingsController],
  providers: [
    AdminRepositoryProvider,
    CreateAdminUseCaseProvider,
    FindAllAdminsUseCaseProvider,
    FindAdminByIdUseCaseProvider,
    UpdateAdminUseCaseProvider,
    FindAllPermissionsUseCaseProvider,
  ],
})
export class AdminSettingsModule {}
