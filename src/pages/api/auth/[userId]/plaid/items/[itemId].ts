import { removeItemById, retrieveItemById } from '@/backend/db/queries/plaid/item';
import { withAuth } from '@/lib/auth-middleware';
import { plaid } from '@/lib/plaid';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
type ResponseType = {
  success: boolean;
  message?: string;
  data?: never;
};

const handler = async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
  user: User
) {
  const {
    query: { itemId },
    method,
  } = req;

  switch (method) {
    case 'DELETE':
      const item = await retrieveItemById(itemId as string, user.id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }
      try {
        const { data } = await plaid.itemRemove({ access_token: item.plaidAccessToken });
        console.log(data);
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while removing item',
        });
      }
      await removeItemById(itemId as string);
      return res.status(200).json({ success: true });
    default:
      return res.status(405).json({ success: false, message: 'DELETE request is required' });
  }
};

export default withAuth(handler);
