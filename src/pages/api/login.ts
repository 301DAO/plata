import { NextApiRequest, NextApiResponse } from "next";
import { magic } from "@/lib/magic";
import { setLoginSession } from "@/lib/auth";

export type loginResponse = {
  done?: boolean;
  message?: string;
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
