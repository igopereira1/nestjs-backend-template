-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('REGISTERED', 'CONFIRMED') NOT NULL DEFAULT 'REGISTERED',
    `file_key` VARCHAR(191) NULL,
    `file_url` VARCHAR(191) NULL,
    `confirmation_code` VARCHAR(191) NULL,
    `confirmation_code_expiration` DATETIME(3) NULL,
    `forgot_code` VARCHAR(191) NULL,
    `forgot_code_expiration` DATETIME(3) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
