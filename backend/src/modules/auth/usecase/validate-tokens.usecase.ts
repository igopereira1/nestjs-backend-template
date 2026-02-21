import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ValidateTokensUseCase } from './validate-tokens.usecase.abstract';

@Injectable()
export class DefaultValidateTokensUseCase extends ValidateTokensUseCase {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {
    super();
  }

  async execute({
    authorization,
  }: {
    authorization: string;
  }): Promise<AuthResponseDto> {
    await Promise.resolve();

    const tokens = authorization.split(',');
    let access_token = tokens[0]?.split('=')[1];
    let refresh_token = tokens[1]?.split('=')[1];

    if (!access_token && !refresh_token)
      throw new ForbiddenException('Invalid Tokens');

    const isValidAccessToken =
      this.tokenService.isValidAccessToken(access_token);
    const isValidRefreshToken =
      this.tokenService.isValidRefreshToken(refresh_token);

    if (isValidAccessToken && isValidRefreshToken) {
      return { access_token, refresh_token };
    } else if (!isValidAccessToken && isValidRefreshToken) {
      const payload = isValidRefreshToken;
      const newPayload = {
        sub: payload.sub,
        name: payload.name,
        email: payload.email,
      };

      access_token = this.tokenService.generateAccessToken(newPayload);
      refresh_token = this.tokenService.generateRefreshToken(newPayload);

      return { access_token, refresh_token };
    } else {
      throw new ForbiddenException('Invalid Tokens');
    }
  }
}
