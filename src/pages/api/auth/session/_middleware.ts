import { NextApiRequest } from "next";
import { authenticate } from "@/lib";

export default async function session(request: NextApiRequest) {
  //console.log(`from /api/auth/session.ts: `, request);
  
  const { authenticated, message, verifiedPayload } = await authenticate(
    request
  );

  if (authenticated) {
    return jsonResponse(200, {
      authenticated,
      message: null,
      user: verifiedPayload,
    });
  }
  return jsonResponse(401, { authenticated, message, user: null });
}

const jsonResponse = (status: number, data: any, init?: ResponseInit) => {
  return new Response(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });
};
