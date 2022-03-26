import { retrieveItemsByUserId } from '@/backend/db/queries/plaid/item';
import { withAuth } from '@/lib/auth-middleware';
import { GetItemsByUserResponse } from '@/lib/plaid/item';
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async function (
  _req: NextApiRequest,
  res: NextApiResponse<GetItemsByUserResponse>,
  user: User
) {
  try {
    const items = await retrieveItemsByUserId(user.id);
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while retrieving items',
    });
  }
};

export default withAuth(handler);
