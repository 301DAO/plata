import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { authenticate, generateAccessCookie, setTokenCookie, UserAuth } from "@/lib";
import { User } from "@prisma/client";

export type NextApiRequestWithUser = NextApiRequest & {
  user: User;
};

type NextApiHandlerWithUser<T> = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<T>
) => void | Promise<void>;

export function withAuth(handler: NextApiHandlerWithUser<any>) {
  return async function (req: NextApiRequestWithUser, res: NextApiResponse<any>) {
    try {
      const { authenticated, user }: UserAuth = await authenticate(req);

      if (authenticated && user) {
        const token = generateAccessCookie(user);
        setTokenCookie(res, token);

        req.user = user;
        return handler(req, res);
      }

      return res.status(401).end("Not authenticated.");
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      return res.status(500).end(message);
    }
  };
}
