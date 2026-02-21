import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { FindUserByIdUseCase } from './find-user-by-id.usecase.abstract';

@Injectable()
export class DefaultFindUserByIdUseCase extends FindUserByIdUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.adminRepository.findByIdAndRole(id, Role.USER);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      permissions: [],
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
