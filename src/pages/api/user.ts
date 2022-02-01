import { getLoginSession, session, setLoginSession } from "@/lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { MagicUserMetadata } from "@magic-sdk/admin";

type UserResponse = {
  user: session | null;
  message?: string;
};

export default async function user(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed", user: null });
    return;
  }

  try {
    const session = await getLoginSession(req);
    if (!session) {
      throw new Error("No session");
    }

    const { createdAt, maxAge, ...userMetadata } = session;
    //refresh the token
    await setLoginSession(res, userMetadata as MagicUserMetadata);
    res.status(200).json({ user: session });
  } catch (e) {
    console.log(e);
    res.status(200).json({ user: null });
  }
}
