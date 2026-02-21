import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { ToggleUserStatusUseCase } from './toggle-user-status.usecase.abstract';

@Injectable()
export class DefaultToggleUserStatusUseCase extends ToggleUserStatusUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.findByIdAndRole(id, Role.USER);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    const newStatus =
      user.status === UserStatus.INACTIVE
        ? UserStatus.CONFIRMED
        : UserStatus.INACTIVE;

    const updatedUser = await this.adminRepository.updateStatus(id, newStatus);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      permissions: [],
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
