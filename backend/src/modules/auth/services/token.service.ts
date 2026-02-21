import { JwtUserPayload } from '../interfaces/jwt-user-payload.interface';

export abstract class TokenService {
  abstract generateAccessToken(payload: JwtUserPayload): string;
  abstract generateRefreshToken(payload: JwtUserPayload): string;
  abstract verifyRefreshToken(token: string): JwtUserPayload;
  abstract verifyAccessToken(token: string): JwtUserPayload;
  abstract isValidAccessToken(token: string): JwtUserPayload | false;
  abstract isValidRefreshToken(token: string): JwtUserPayload | false;
}
