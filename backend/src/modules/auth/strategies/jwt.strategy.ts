import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';

const cookieExtractor = (request: any) => {
  return request?.cookies?.access_token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly _prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtUserPayload) {
    const user = await this._prismaService.user.findUnique({
      where: { id: payload.sub },
      include: {
        adminPermissions: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminPermissions: user.adminPermissions,
    };
  }
}
