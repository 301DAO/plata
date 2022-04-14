import { withAuth } from '@/lib/auth-middleware';
import { plaid } from '@/lib/plaid';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CountryCode, LinkTokenCreateRequest, LinkTokenCreateResponse, Products } from 'plaid';

type CreateLinkTokenResponse = {
  success: boolean;
  message?: string;
  data?: LinkTokenCreateResponse;
};

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse<CreateLinkTokenResponse>,
  user: User
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST request is required' });
  }

  const linkTokenCreateRequest: LinkTokenCreateRequest = {
    user: {
      client_user_id: user.id,
    },
    client_id: process.env.NEXT_PUBLIC_PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: process.env.PLAID_CLIENT_NAME,
    language: 'en',
    country_codes: [CountryCode.Us],
    products: [Products.Liabilities, Products.Investments, Products.Transactions],
    webhook:
      process.env.PLAID_ENV === 'sandbox'
        ? 'https://eod4f030c05771u.m.pipedream.net'
        : 'https://plata.vercel.app/api/plaid/webhook',
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
          : 'An unexpected error occurred while creating link token',
    });
  }
};

export default withAuth(handler);
