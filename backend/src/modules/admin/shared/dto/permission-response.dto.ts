import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({ example: 'DASHBOARD', description: 'Permission key' })
  key: string;

  @ApiProperty({
    example: 'Dashboard',
    description: 'Acesso ao Dashboard',
  })
  label: string;
}
