import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadService } from 'src/modules/upload/upload.service.abstract';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { InputCreateAdminDto } from '../dto/input-create-admin.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { UserWithPermissions } from '../../shared/repository/admin.repository.abstract';
import { CreateAdminUseCase } from './create-admin.usecase.abstract';

@Injectable()
export class DefaultCreateAdminUseCase extends CreateAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly uploadService: UploadService,
  ) {
    super();
  }

  async execute(data: InputCreateAdminDto): Promise<UserResponseDto> {
    const { file, ...rest } = data;
    const dto: CreateAdminDto = { ...rest };

    const existingUser = await this.adminRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    if (file) {
      const dataFile = await this.uploadService.uploadOneFile(file);
      dto.fileKey = dataFile.fileKey;
      dto.fileUrl = dataFile.fileUrl;
    }

    const newAdmin = await this.adminRepository.create(dto);
    return this.mapToResponse(newAdmin);
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
