import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminPermissions } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class InputCreateAdminDto {
  @ApiProperty({
    description: 'The name of the admin',
    example: 'Jane Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the admin',
    example: 'jane.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the admin (min 6 chars)',
    example: 'Password123!',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Permission keys for the admin',
    enum: AdminPermissions,
    isArray: true,
    example: [AdminPermissions.DASHBOARD],
  })
  @IsArray()
  @IsEnum(AdminPermissions, { each: true })
  permissions: AdminPermissions[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional profile picture',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
