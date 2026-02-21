import { PrismaClient } from '@prisma/client';
import { seedAdminPermissions } from './seeds/admin-permissions.seed';
import { seedAdmin } from './seeds/admin.seed';
import { seedUser } from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  await seedAdminPermissions(prisma);
  await seedAdmin(prisma);
  await seedUser(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
