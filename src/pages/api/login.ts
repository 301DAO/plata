import { NextApiRequest, NextApiResponse } from "next";
import { magic } from "@/lib/magic";
import { setLoginSession } from "@/lib/auth";
import { prisma } from "@/utils/prisma";

export type loginResponse = {
  done?: boolean;
  message?: string;
};

const isExistingUser = async (issuer: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      issuer: issuer,
    },
  });
  console.log(`user: ${user}`);

  return !!user;
};

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<loginResponse>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const didToken = req.headers.authorization?.substr(7);
    if (!didToken) throw new Error("No Authorization Token");
    magic.token.validate(didToken);

    const metadata = await magic.users.getMetadataByToken(didToken);
    if (!metadata.issuer) throw new Error("No Issuer");
    console.log(`metadata: ${metadata}`);

    if (!(await isExistingUser(metadata.issuer))) {
      console.log("creating user");
      const user = await prisma.user.create({
        data: {
          issuer: metadata.issuer,
          email: metadata.email,
          lastLogin: new Date().toISOString(),
        },
      });
      console.log(`user created: ${user}`);
    } else {
      console.log("updating user");
      const user = await prisma.user.update({
        where: {
          issuer: metadata.issuer,
        },
        data: {
          lastLogin: new Date().toISOString(),
        },
      });
      console.log(`user updated: ${user}`);
    }

    const session = { ...metadata };
    await setLoginSession(res, session);

    res.status(200).send({ done: true });
  } catch (error) {
    console.error(error);
    error instanceof Error
      ? res.status(500).end(error.message)
      : res.status(500).end("Internal Server Error. No error message");
  }
}
