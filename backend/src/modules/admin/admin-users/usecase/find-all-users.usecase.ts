import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PageDto } from 'src/modules/pagination/dtos/page.dto';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { QueryDto } from '../../shared/dto/query.dto';
import { ResponseFindAllDto } from '../../shared/dto/response-find-all.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { FindAllUsersUseCase } from './find-all-users.usecase.abstract';
import { UserWithPermissions } from '../../shared/repository/admin.repository.abstract';

@Injectable()
export class DefaultFindAllUsersUseCase extends FindAllUsersUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(query: QueryDto): Promise<ResponseFindAllDto> {
    const pageUsers = await this.adminRepository.findAll(query, Role.USER);

    const data = pageUsers.data.map((user) => this.mapToResponse(user));

    return new PageDto(data, pageUsers.meta);
  }

  private mapToResponse(user: UserWithPermissions): UserResponseDto {
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
