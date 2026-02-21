import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';

@Injectable()
export class JwtTokenService extends TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {
    super();
  }

  generateAccessToken(payload: JwtUserPayload): string {
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('ACCESS_TOKEN_EXPIRES') ||
        '15m') as any,
    };
    return this.jwtService.sign(payload, options);
  }

  generateRefreshToken(payload: JwtUserPayload): string {
    const options: JwtSignOptions = {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: (this.configService.get<string>('REFRESH_TOKEN_EXPIRES') ||
        '7d') as any,
    };
    return this.jwtService.sign(payload, options);
  }

  verifyRefreshToken(token: string): JwtUserPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  verifyAccessToken(token: string): JwtUserPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  isValidAccessToken(token: string): JwtUserPayload | false {
    try {
      return this.verifyAccessToken(token);
    } catch {
      return false;
    }
  }

  isValidRefreshToken(token: string): JwtUserPayload | false {
    try {
      return this.verifyRefreshToken(token);
    } catch {
      return false;
    }
  }
}
