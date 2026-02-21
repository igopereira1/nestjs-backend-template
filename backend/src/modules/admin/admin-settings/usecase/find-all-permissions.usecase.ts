import { Injectable } from '@nestjs/common';
import { PermissionResponseDto } from '../../shared/dto/permission-response.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { FindAllPermissionsUseCase } from './find-all-permissions.usecase.abstract';

@Injectable()
export class DefaultFindAllPermissionsUseCase extends FindAllPermissionsUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(): Promise<PermissionResponseDto[]> {
    return this.adminRepository.findAllPermissions();
  }
}
