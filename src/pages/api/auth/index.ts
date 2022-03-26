import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticate, generateAccessCookie, setTokenCookie, UserAuth } from '@/lib';
import { User } from '@prisma/client';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { authenticated, message, user }: UserAuth = await authenticate(req);

    if (authenticated) {
      const token = generateAccessCookie(user as User);
      setTokenCookie(res, token);

      return res.status(200).json({
        authenticated,
        message,
        user,
      });
    }

    return res.status(401).json({ authenticated, message, user: null });
  } catch (error) {
    console.error('An unexpected error happened occurred:', error);

    res.status(500).send({
      authenticated: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      user: null,
    });
  }
}
