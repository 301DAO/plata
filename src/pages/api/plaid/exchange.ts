import { createItem, retrieveItemByPlaidInstitutionId } from '@/backend/db/queries/plaid/item';
import { withAuth } from '@/lib/auth-middleware';
import { plaid } from '@/lib/plaid';
import { PlaidItem, User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseType = {
  success: boolean;
  message?: string;
  data?: PlaidItem;
};

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
  user: User
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST request is required' });
  }

  const { publicToken, institutionId } = req.body;

  const existingItem = await retrieveItemByPlaidInstitutionId(institutionId, user.id);

  if (existingItem) {
    return res
      .status(409)
      .json({ success: false, message: 'You have already linked an account at this institution.' });
  }

  const response = await plaid.itemPublicTokenExchange({ public_token: publicToken });

  const { item_id: itemId, access_token: accessToken } = response.data;

  const item = await createItem(institutionId, itemId, accessToken, user.id);

  return res.status(200).json({ success: true, data: item });
};

export default withAuth(handler);
