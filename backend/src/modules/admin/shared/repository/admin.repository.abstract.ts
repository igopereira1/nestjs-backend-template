import { User, AdminPermission, Role } from '@prisma/client';
import { PageDto } from '../../../pagination/dtos/page.dto';
import { CreateAdminDto } from '../../admin-settings/dto/create-admin.dto';
import { UpdateAdminDto } from '../../admin-settings/dto/update-admin.dto';
import { QueryDto } from '../dto/query.dto';

export type UserWithPermissions = User & {
  adminPermissions: AdminPermission[];
};

export abstract class AdminRepository {
  abstract findByEmail(email: string): Promise<UserWithPermissions | null>;
  abstract findById(id: string): Promise<UserWithPermissions | null>;
  abstract findByIdAndRole(
    id: string,
    role: Role,
  ): Promise<UserWithPermissions | null>;
  abstract create(data: CreateAdminDto): Promise<UserWithPermissions>;
  abstract update(
    id: string,
    data: UpdateAdminDto,
  ): Promise<UserWithPermissions>;
  abstract findAll(
    query: QueryDto,
    role: Role,
  ): Promise<PageDto<UserWithPermissions>>;
  abstract findAllPermissions(): Promise<Array<{ key: string; label: string }>>;
  abstract updateStatus(
    id: string,
    status: string,
  ): Promise<UserWithPermissions>;
}
