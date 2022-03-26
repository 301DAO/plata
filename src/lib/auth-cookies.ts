import { MAX_AGE, TOKEN_NAME, TOKEN_SECRET } from '@/constants/cookie';
import type { User } from '@prisma/client';
import { parse, serialize } from 'cookie';
import { sign } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export async function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date((Date.now() + MAX_AGE) * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function removeTokenCookie(res: NextApiResponse) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

export function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getTokenCookie(req: NextApiRequest) {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function generateAccessCookie(user: User) {
  return sign({ user }, TOKEN_SECRET, {
    expiresIn: MAX_AGE,
    algorithm: 'HS256',
  });
}
