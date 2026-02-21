import { Response } from 'express';
import { jwtDecode } from 'jwt-decode';

type CookieType = 'access_token' | 'refresh_token';

export function setCookie(name: CookieType, token: string, res: Response) {
  if (name === 'access_token') {
    const decodedAccessToken = jwtDecode(token);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(
        new Date((decodedAccessToken.exp as number) * 1000).toUTCString(),
      ),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  } else {
    const decodedRefreshToken = jwtDecode(token);
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(
        new Date((decodedRefreshToken.exp as number) * 1000).toUTCString(),
      ),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
  }
}
