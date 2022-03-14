import { NextApiRequestWithUser, withAuth } from "@/lib/auth-middleware";
import { plaid } from "@/lib/plaid";
import { User } from "@prisma/client";
import type { NextApiResponse } from "next";
import { CountryCode, LinkTokenCreateRequest, LinkTokenCreateResponse, Products } from "plaid";

type CreateLinkTokenResponse = {
  success: boolean;
  message?: string;
  data?: LinkTokenCreateResponse;
};

const handler = async function (
  req: NextApiRequestWithUser,
  res: NextApiResponse<CreateLinkTokenResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "POST request is required" });
  }

  const user: User = req.user;

  const linkTokenCreateRequest: LinkTokenCreateRequest = {
    user: {
      client_user_id: user.id,
    },
    client_id: process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: process.env.PLAID_CLIENT_NAME,
    language: "en",
    country_codes: [CountryCode.Us],
    products: [Products.Liabilities, Products.Investments],
  };

  try {
    const createTokenResponse = await plaid.linkTokenCreate(linkTokenCreateRequest);
    res.status(200).json({ success: true, data: createTokenResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating link token",
    });
  }
};

export default withAuth(handler);
