import { prisma } from '@/lib/prisma';

export const retrieveItemByPlaidInstitutionId = async (
  plaidInstitutionId: string,
  userId: string
) => {
  const item = await prisma.plaidItem.findFirst({
    where: {
      plaidInstitutionId,
      userId,
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
      userId,
    },
  });

  return items;
};

export enum ItemStatus {
  good = 'good',
  bad = 'bad',
}

export const updateItemStatus = async (plaidItemId: string, status: ItemStatus) => {
  const item = await prisma.plaidItem.update({
    where: {
      id: plaidItemId,
    },
    data: {
      status,
    },
  });

  return item;
};

export const removeItemById = async (plaidItemId: string) => {
  const item = await prisma.plaidItem.delete({
    where: {
      id: plaidItemId,
    },
  });

  return item;
};

export const retrieveItemById = async (plaidItemId: string, userId: string) => {
  const item = await prisma.plaidItem.findFirst({
    where: {
      id: plaidItemId,
      userId: userId,
    },
  });

  return item;
};
