import { AdminPermissions } from '@prisma/client';

export class CreateAdminDto {
  name: string;
  email: string;
  password: string;
  permissions: AdminPermissions[];
  fileKey?: string;
  fileUrl?: string;
}
