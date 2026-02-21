import { ForbiddenException } from '@nestjs/common';
import { User, AdminPermission, AdminPermissions } from '@prisma/client';

type UserWithPermissions = User & { adminPermissions?: AdminPermission[] };

export class HandleAccessControl {
  verifyAdminRole(user: User): void {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied: User is not an admin.');
    }
  }

  verifyPermission(
    user: UserWithPermissions,
    permissionKey: AdminPermissions,
  ): void {
    if (!user.adminPermissions || !Array.isArray(user.adminPermissions)) {
      console.warn(
        'Admin permissions not loaded on user object. Access might be denied unexpectedly.',
      );
      throw new ForbiddenException(`Access denied: Permissions not loaded.`);
    }

    const hasPermission = user.adminPermissions.some(
      (p) => p.key === permissionKey,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied: Missing permission '${permissionKey}'.`,
      );
    }
  }
}

export default new HandleAccessControl();
