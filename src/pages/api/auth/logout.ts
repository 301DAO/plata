import type { NextApiRequest, NextApiResponse } from "next";
import { removeTokenCookie, magic, authenticate } from "@/lib";
import { TOKEN_NAME } from "@/constants";

export default async function signOut(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== "GET") {
    return response
      .status(405)
      .json({ success: false, message: "GETa request is required" });
  }

  try {
    const { verifiedPayload } = await authenticate(request);
    console.log(
      `from /api/auth/logout.ts: `,
      JSON.stringify(verifiedPayload, null, 2)
    );
    if (verifiedPayload && verifiedPayload.issuer) {
      await magic.users.logoutByIssuer(verifiedPayload.issuer);
      removeTokenCookie(response);
    }
  } catch (error) {
    removeTokenCookie(response);
    console.error(error);
    return response.status(422).json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }

  const parsedCookie = request.cookies[TOKEN_NAME];
  if (!parsedCookie)
    return response.status(200).send({ success: true, message: "no cookie" });

  removeTokenCookie(response);
  return response.writeHead(302, { Location: "/login" }).end();
}
