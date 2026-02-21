-- CreateEnum
CREATE TYPE "AdminPermissions" AS ENUM ('DASHBOARD', 'SETTINGS', 'USERS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('CONFIRMED', 'REGISTERED', 'INACTIVE');

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" TEXT NOT NULL,
    "key" "AdminPermissions" NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "confirmation_code" TEXT,
    "confirmation_code_expiration" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "file_key" TEXT,
    "file_url" TEXT,
    "forgot_code" TEXT,
    "forgot_code_expiration" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'REGISTERED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdminPermissionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminPermissionToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_key_key" ON "admin_permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_AdminPermissionToUser_B_index" ON "_AdminPermissionToUser"("B");

-- AddForeignKey
ALTER TABLE "_AdminPermissionToUser" ADD CONSTRAINT "_AdminPermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "admin_permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminPermissionToUser" ADD CONSTRAINT "_AdminPermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
