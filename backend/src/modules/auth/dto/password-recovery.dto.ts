import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email cadastrado para enviar o código de recuperação',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;
}

export class VerifyCodeDto {
  @ApiProperty({
    description: 'Código de validação recebido no e-mail',
    example: 'A1B2C3',
  })
  @IsString({ message: 'O código deve ser texto' })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Código de recuperação validado',
    example: 'A1B2C3',
  })
  @IsString({ message: 'O código deve ser texto' })
  @IsNotEmpty({ message: 'O código é obrigatório' })
  code: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'NovaSenha#123',
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenha#123',
  })
  @IsString({ message: 'A confirmação de senha deve ser texto' })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  confirmPassword: string;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensagem de retorno',
    example: 'Operação realizada com sucesso!',
  })
  message: string;
}
