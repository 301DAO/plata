import { TOKEN_SECRET } from '@/constants';
import { getTokenCookie } from '@/lib';
import type { User } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';
import type { NextApiRequest } from 'next';

type UserJwtPayload = JwtPayload & {
  user: User;
};

export type UserAuth = {
  authenticated: boolean;
  message: string | null;
  user: User | null;
};

export const authenticate = async (req: NextApiRequest): Promise<UserAuth> => {
  try {
    const token = getTokenCookie(req);
    if (!token) {
      return {
        authenticated: false,
        message: 'missing token',
        user: null,
      };
    }
    const verified = verify(token, TOKEN_SECRET) as UserJwtPayload;

    return {
      authenticated: true,
      message: null,
      user: verified.user,
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
    user: null,
  };
};
