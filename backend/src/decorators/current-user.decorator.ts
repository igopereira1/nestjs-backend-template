import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtUserPayload } from '../modules/auth/interfaces/jwt-user-payload.interface';

export interface AuthRequest extends Request {
  user: JwtUserPayload;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtUserPayload => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);
