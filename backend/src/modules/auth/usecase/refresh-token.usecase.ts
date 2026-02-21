import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenUseCase } from './refresh-token.usecase.abstract';

@Injectable()
export class DefaultRefreshTokenUseCase extends RefreshTokenUseCase {
  constructor(
    @Inject(TokenService) private readonly tokenService: TokenService,
  ) {
    super();
  }

  async execute(token?: string): Promise<AuthResponseDto> {
    await Promise.resolve();
    if (!token) throw new ForbiddenException('Token is required');

    const refreshToken = token.startsWith('Bearer ')
      ? token.substring(7)
      : token;

    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new ForbiddenException('Invalid token');
    }

    const newPayload = {
      sub: payload.sub,
      name: payload.name,
      email: payload.email,
    };

    const access_token = this.tokenService.generateAccessToken(newPayload);
    const refresh_token = this.tokenService.generateRefreshToken(newPayload);

    return { access_token, refresh_token };
  }
}
