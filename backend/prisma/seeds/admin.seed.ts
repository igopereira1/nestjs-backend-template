import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

export const seedAdmin = async (prisma: PrismaClient) => {
  console.log('Seeding Admin User...');

  console.log('Seeding Admin User...');
  const passwordHash = await argon2.hash('12345678');

  const adminEmail = 'admin@admin.com';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin Master',
        email: adminEmail,
        password: passwordHash,
        role: Role.ADMIN,
        status: UserStatus.REGISTERED,
      },
    });

    const allPermissions = await prisma.adminPermission.findMany();

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        adminPermissions: {
          connect: allPermissions.map((p) => ({ id: p.id })),
        },
      },
    });

    console.log('Admin User created successfully.');
  } else {
    console.log('Admin User already exists.');
  }
};
