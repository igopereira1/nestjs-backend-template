import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { Cookies } from 'src/decorators/cookies.decorator';
import { IsPublic } from 'src/decorators/is-public.decorator';
import { setCookie } from 'src/utils/cookies';
import {
  AuthResponseDto,
  RefreshTokenResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import {
  MessageResponseDto,
  ForgotPasswordDto,
  VerifyCodeDto,
  ResetPasswordDto,
} from './dto/password-recovery.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokensDto } from './dto/validate-tokens.dto';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ForgotPasswordUseCase } from './usecase/forgot-password.usecase.abstract';
import { LoginUseCase } from './usecase/login.usecase.abstract';
import { RefreshTokenUseCase } from './usecase/refresh-token.usecase.abstract';
import { ResetPasswordUseCase } from './usecase/reset-password.usecase.abstract';
import { ValidateTokensUseCase } from './usecase/validate-tokens.usecase.abstract';
import { VerifyCodeUseCase } from './usecase/verify-code.usecase.abstract';
import { ConfirmAccountUseCase } from './usecase/confirm-account.usecase.abstract';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly validateTokensUseCase: ValidateTokensUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyCodeUseCase: VerifyCodeUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly confirmAccountUseCase: ConfirmAccountUseCase,
  ) {}

  @IsPublic()
  @Post('login')
  @ApiOperation({ summary: 'Rota para autenticação de usuário' })
  @ApiOkResponse({ type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const { access_token, refresh_token } =
      await this.loginUseCase.execute(loginDto);

    setCookie('access_token', access_token, response);
    setCookie('refresh_token', refresh_token, response);

    return { access_token, refresh_token };
  }

  @IsPublic()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Rota para renovação de token' })
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: RefreshTokenDto,
    @Cookies('refresh_token') cookieRefreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    const refreshToken = body.refresh_token || cookieRefreshToken;

    const { access_token, refresh_token: newRefreshToken } =
      await this.refreshTokenUseCase.execute(refreshToken);

    setCookie('access_token', access_token, response);
    if (newRefreshToken) {
      setCookie('refresh_token', newRefreshToken, response);
    }

    return { access_token };
  }

  @IsPublic()
  @Post('validate/tokens')
  @ApiOperation({ summary: 'Rota para validação de tokens' })
  @ApiOkResponse({ type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  async validateTokens(
    @Body() body: ValidateTokensDto,
    @Cookies('access_token') cookieAccessToken: string,
    @Cookies('refresh_token') cookieRefreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const accessToken = body.access_token || cookieAccessToken;
    const refreshToken = body.refresh_token || cookieRefreshToken;

    const cookieString = `access_token=${accessToken}; refresh_token=${refreshToken}`;

    const result = await this.validateTokensUseCase.execute({
      authorization: cookieString,
    });

    setCookie('access_token', result.access_token, response);
    setCookie('refresh_token', result.refresh_token, response);

    return result;
  }

  @IsPublic()
  @Post('forgot')
  @ApiOperation({ summary: 'Rota para envio de código ao email.' })
  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  async forgot(@Body() body: ForgotPasswordDto): Promise<MessageResponseDto> {
    await this.forgotPasswordUseCase.execute(body);
    return { message: 'Email enviado com sucesso!' };
  }

  @IsPublic()
  @Post('verify-code')
  @ApiOperation({
    summary: 'Rota para verificação do código (somente para mobile).',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() body: VerifyCodeDto): Promise<MessageResponseDto> {
    await this.verifyCodeUseCase.execute(body);
    return { message: 'Código verificado com sucesso!' };
  }

  @IsPublic()
  @Post('reset')
  @ApiOperation({ summary: 'Rota para redefinir nova senha.' })
  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  async reset(@Body() body: ResetPasswordDto): Promise<MessageResponseDto> {
    await this.resetPasswordUseCase.execute(body);
    return { message: 'Senha resetada com sucesso.' };
  }

  @IsPublic()
  @Post('confirm-email')
  @ApiOperation({
    summary: 'Rota para confirmar a conta do usuário recém-cadastrado.',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @HttpCode(HttpStatus.OK)
  async confirmAccount(
    @Body() body: ConfirmAccountDto,
  ): Promise<MessageResponseDto> {
    await this.confirmAccountUseCase.execute(body);
    return { message: 'Conta ativada com sucesso!' };
  }
}
