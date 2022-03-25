import { prisma } from '@/lib/prisma';

export const retrieveItemByPlaidInstitutionId = async (
  plaidInstitutionId: string,
  userId: string
) => {
  const item = await prisma.plaidItem.findFirst({
    where: {
      plaidInstitutionId,
      user: {
        id: userId,
      },
    },
  });

  return item;
};

export const createItem = async (
  plaidInstitutionId: string,
  plaidItemId: string,
  plaidAccessToken: string,
  userId: string
) => {
  //items always start with a good status when created
  const status = 'good';
  const item = await prisma.plaidItem.create({
    data: {
      plaidInstitutionId,
      plaidItemId,
      plaidAccessToken,
      user: {
        connect: {
          id: userId,
        },
      },
      status,
    },
  });

  return item;
};

export const retrieveItemsByUserId = async (userId: string) => {
  const items = await prisma.plaidItem.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });

  return items;
};
