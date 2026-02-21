import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PageDto } from 'src/modules/pagination/dtos/page.dto';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { QueryDto } from '../../shared/dto/query.dto';
import { ResponseFindAllDto } from '../../shared/dto/response-find-all.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { FindAllAdminsUseCase } from './find-all-admins.usecase.abstract';

@Injectable()
export class DefaultFindAllAdminsUseCase extends FindAllAdminsUseCase {
  constructor(private readonly adminRepository: AdminRepository) {
    super();
  }

  async execute(query: QueryDto): Promise<ResponseFindAllDto> {
    const pageUsers = await this.adminRepository.findAll(query, Role.ADMIN);

    const data = pageUsers.data.map((user) => this.mapToResponse(user));

    return new PageDto(data, pageUsers.meta);
  }

  private mapToResponse(user: any): UserResponseDto {
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
