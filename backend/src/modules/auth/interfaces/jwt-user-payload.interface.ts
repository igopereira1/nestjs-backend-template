export interface JwtUserPayload {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}
