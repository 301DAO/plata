<<<<<<< HEAD
import type { NextApiRequest } from 'next'
import type { User } from '@prisma/client'
import type { JwtPayload } from 'jsonwebtoken'
import { getTokenCookie } from '@/lib'
import { verify } from 'jsonwebtoken'
import { TOKEN_SECRET } from '@/constants'
=======
import type { NextApiRequest } from "next";
import type { User } from "@prisma/client";
import type { JwtPayload } from "jsonwebtoken";
import { getTokenCookie } from "@/lib";
import { verify } from "jsonwebtoken";
import { TOKEN_SECRET } from "@/constants";
>>>>>>> 2f45864 (wip)

type UserJwtPayload = JwtPayload & {
  user: User
}

export type UserAuth = {
  authenticated: boolean;
  message: string | null;
  user: User | null;
};

export const authenticate = async (req: NextApiRequest): Promise<UserAuth> => {
  try {
    const token = getTokenCookie(req)
    if (!token) {
      return {
        authenticated: false,
<<<<<<< HEAD
        message: 'missing token',
        verifiedPayload: null,
      }
=======
        message: "missing token",
        user: null,
      };
>>>>>>> 2f45864 (wip)
    }
    const verified = verify(token, TOKEN_SECRET) as UserJwtPayload

    return {
      authenticated: true,
      message: null,
<<<<<<< HEAD
      verifiedPayload: verified.user,
    }
=======
      user: verified.user,
    };
>>>>>>> 2f45864 (wip)
  } catch (error) {
    console.error(
      "An unexpected error happened occurred:",
      error instanceof Error ? error.message : error
    )
  }
  return {
    authenticated: false,
<<<<<<< HEAD
    message: 'your token expired',
    verifiedPayload: null,
  }
}
=======
    message: "your token expired",
    user: null,
  };
};
>>>>>>> 2f45864 (wip)
