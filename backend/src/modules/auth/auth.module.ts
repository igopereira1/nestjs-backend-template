import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CryptoModule } from '../crypto/crypto.module';
import { UserModule } from '../user/user.module';
import { MailerModule } from '../mailer/mailer.module';
import { TemplateModule } from '../template/template.module';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './services/jwt.token.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DefaultLoginUseCase } from './usecase/login.usecase';
import { LoginUseCase } from './usecase/login.usecase.abstract';
import { DefaultRefreshTokenUseCase } from './usecase/refresh-token.usecase';
import { RefreshTokenUseCase } from './usecase/refresh-token.usecase.abstract';
import { DefaultValidateTokensUseCase } from './usecase/validate-tokens.usecase';
import { ValidateTokensUseCase } from './usecase/validate-tokens.usecase.abstract';
import { DefaultForgotPasswordUseCase } from './usecase/forgot-password.usecase';
import { ForgotPasswordUseCase } from './usecase/forgot-password.usecase.abstract';
import { DefaultResetPasswordUseCase } from './usecase/reset-password.usecase';
import { ResetPasswordUseCase } from './usecase/reset-password.usecase.abstract';
import { DefaultVerifyCodeUseCase } from './usecase/verify-code.usecase';
import { VerifyCodeUseCase } from './usecase/verify-code.usecase.abstract';
import { DefaultConfirmAccountUseCase } from './usecase/confirm-account.usecase';
import { ConfirmAccountUseCase } from './usecase/confirm-account.usecase.abstract';

@Module({
  imports: [
    UserModule,
    CryptoModule,
    MailerModule,
    TemplateModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    {
      provide: LoginUseCase,
      useClass: DefaultLoginUseCase,
    },
    {
      provide: RefreshTokenUseCase,
      useClass: DefaultRefreshTokenUseCase,
    },
    {
      provide: ValidateTokensUseCase,
      useClass: DefaultValidateTokensUseCase,
    },
    {
      provide: ForgotPasswordUseCase,
      useClass: DefaultForgotPasswordUseCase,
    },
    {
      provide: VerifyCodeUseCase,
      useClass: DefaultVerifyCodeUseCase,
    },
    {
      provide: ResetPasswordUseCase,
      useClass: DefaultResetPasswordUseCase,
    },
    {
      provide: ConfirmAccountUseCase,
      useClass: DefaultConfirmAccountUseCase,
    },
  ],
})
export class AuthModule {}
