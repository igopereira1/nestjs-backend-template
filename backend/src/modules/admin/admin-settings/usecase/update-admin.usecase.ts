import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadService } from 'src/modules/upload/upload.service.abstract';
import { UserResponseDto } from '../../shared/dto/user-response.dto';
import { InputUpdateAdminDto } from '../dto/input-update-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminRepository } from '../../shared/repository/admin.repository.abstract';
import { UpdateAdminUseCase } from './update-admin.usecase.abstract';

@Injectable()
export class DefaultUpdateAdminUseCase extends UpdateAdminUseCase {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly uploadService: UploadService,
  ) {
    super();
  }

  async execute(
    id: string,
    data: InputUpdateAdminDto,
  ): Promise<UserResponseDto> {
    const user = await this.adminRepository.findById(id);

    if (!user || user.role !== 'ADMIN') {
      throw new NotFoundException('Admin not found.');
    }

    const { file, ...rest } = data;
    const dto: UpdateAdminDto = { ...rest };

    if (file) {
      const dataFile = await this.uploadService.uploadOneFile(file);
      dto.fileKey = dataFile.fileKey;
      dto.fileUrl = dataFile.fileUrl;
    }

    const updatedUser = await this.adminRepository.update(id, dto);
    return this.mapToResponse(updatedUser);
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
