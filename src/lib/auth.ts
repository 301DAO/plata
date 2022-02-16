import type { NextApiRequest } from 'next';
import type { User } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';
import { getTokenCookie } from '@/lib';
import { verify } from 'jsonwebtoken';
import { TOKEN_SECRET } from '@/constants';

type UserJwtPayload = JwtPayload & {
  user: User;
};

export const authenticate = async (req: NextApiRequest) => {
  try {
    const token = getTokenCookie(req);
    if (!token) {
      return {
        authenticated: false,
        message: 'missing token',
        verifiedPayload: null,
      };
    }
    const verified = verify(token, TOKEN_SECRET) as UserJwtPayload;

    return {
      authenticated: true,
      message: null,
      verifiedPayload: verified.user,
    };
  } catch (error) {
    console.error(
      'An unexpected error happened occurred:',
      error instanceof Error ? error.message : error
    );
  }
  return {
    authenticated: false,
    message: 'your token expired',
    verifiedPayload: null,
  };
};
