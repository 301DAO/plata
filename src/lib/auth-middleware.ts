import { authenticate, generateAccessCookie, setTokenCookie, UserAuth } from '@/lib';
import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Middleware that checks if the user is authenticated, refreshes token,
 * and passes the user object to the next middleware/handler.
 * To use this you have to wrap your handler with `withAuth` ie `withAuth(handler)`.
 */
type NextApiHandlerWithUser<T> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  user: User
) => void | Promise<void>;

export function withAuth(handler: NextApiHandlerWithUser<any>) {
  return async function (req: NextApiRequest, res: NextApiResponse<any>) {
    try {
      const { authenticated, user }: UserAuth = await authenticate(req);

      if (authenticated && user) {
        const token = generateAccessCookie(user);
        setTokenCookie(res, token);

        return handler(req, res, user);
      }

      return res.status(401).end('Not authenticated.');
    } catch (error) {
      console.error('An unexpected error happened occurred:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return res.status(500).end(message);
    }
  };
}
