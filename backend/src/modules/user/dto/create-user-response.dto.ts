import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 'uuid-1234',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The file URL of the user avatar',
    example: 'https://example.com/avatar.jpg',
    required: false,
    nullable: true,
  })
  fileUrl: string | null;

  @ApiProperty({
    description: 'The creation date of the user',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the user',
  })
  updatedAt: Date;
}
