import { Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { UserWithPermissions } from '../../shared/repository/admin.repository.abstract';
import { FindAdminByIdUseCase } from './find-admin-by-id.usecase.abstract';

@Injectable()
export class DefaultFindAdminByIdUseCase extends FindAdminByIdUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.findById(id);

    if (!user || user.role !== 'ADMIN') {
      throw new NotFoundException('Admin not found.');
    }

    return this.mapToResponse(user);
  }

  private mapToResponse(user: UserWithPermissions): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions: user.adminPermissions.map((p: any) => ({
        key: p.key,
        label: p.label,
      })),
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
