import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "@/lib";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  
  const { authenticated, message, verifiedPayload } = await authenticate(req);

  if (authenticated) {
    return res.status(200).json({
      authenticated,
      message: null,
      user: verifiedPayload,
    });
  }
  return res.status(401).json({ authenticated, message, user: null });
}
