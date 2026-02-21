import { PrismaClient, AdminPermissions } from '@prisma/client';

export const seedAdminPermissions = async (prisma: PrismaClient) => {
  console.log('Seeding Admin Permissions...');

  const permissions: { key: AdminPermissions; label: string }[] = [
    { key: 'DASHBOARD', label: 'Acesso ao Dashboard' },
    { key: 'USERS', label: 'Gerenciamento de Usuários' },
    { key: 'SETTINGS', label: 'Configurações do Sistema' },
  ];

  for (const permission of permissions) {
    await prisma.adminPermission.upsert({
      where: { key: permission.key },
      update: {},
      create: permission,
    });
  }

  console.log('Admin Permissions seeded successfully.');
};
