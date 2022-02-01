import Iron from "@hapi/iron";
import { MagicUserMetadata } from "magic-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_AGE, setTokenCookie, getTokenCookie } from "./auth-cookies";

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export type session = {
  createdAt: number;
  email?: string;
  issuer: string;
  maxAge: number;
  oauthProvider?: string;
  phoneNumber?: string;
  publicAddress: string;
};

export async function setLoginSession(
  res: NextApiResponse,
  session: MagicUserMetadata
) {
  const createdAt = Date.now();
  // Create a session object with a max age that we can validate later
  const obj = { ...session, createdAt, maxAge: MAX_AGE };
  const token = await Iron.seal(obj, TOKEN_SECRET, Iron.defaults);

  setTokenCookie(res, token);
}

export async function getLoginSession(
  req: NextApiRequest
): Promise<session | undefined> {
  const token = getTokenCookie(req);

  if (!token) return;

  const session: session = await Iron.unseal(
    token,
    TOKEN_SECRET,
    Iron.defaults
  );
  const expiresAt = session.createdAt + session.maxAge * 1000;

  // Validate the expiration date of the session
  if (Date.now() > expiresAt) {
    throw new Error("Session expired");
  }

  return session;
}
