import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAccountDto {
  @ApiProperty({
    description: 'Código de confirmação recebido no e-mail',
    example: '123456',
  })
  @IsString({ message: 'O código deve ser texto' })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  code: string;
}
