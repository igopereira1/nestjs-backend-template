import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class InputCreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user (min 6 chars)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional profile picture',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
