import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';
import { PermissionResponseDto } from './permission-response.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'The ID of the user record',
    example: 'uuid-5678',
  })
  id: string;

  @ApiProperty({ description: 'The name of the admin', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'The email of the admin',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Permissions assigned to the admin',
    type: [PermissionResponseDto],
  })
  permissions: PermissionResponseDto[];

  @ApiProperty({
    description: 'The status of the user',
    enum: UserStatus,
    example: UserStatus.CONFIRMED,
  })
  status: UserStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
