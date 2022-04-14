import { NotificationType, notify } from '@/components/base/Notification';
import { PlaidItem } from '@prisma/client';
import { useMutation, useQuery } from 'react-query';
import plataApi from '../axios';
import queryClient from '../react-query';

export interface GetItemsByUserResponse {
  success: boolean;
  message?: string;
  data?: PlaidItem[];
}
const getItemsByUserId = async (userId?: string) => {
  const { data } = await plataApi.get<GetItemsByUserResponse>(`/auth/${userId}/plaid/items`);
  return data.data;
};

export const useGetItemsByUserId = (options = {}, userId?: string) => {
  return useQuery(['items', userId], () => getItemsByUserId(userId), options);
};

export interface UserItemParameters {
  userId: string;
  itemId: string;
}

export const useRemoveItemById = () => {
  return useMutation(
    (userItemParameters: UserItemParameters) =>
      plataApi.delete(
        `/auth/${userItemParameters.userId}/plaid/items/${userItemParameters.itemId}`
      ),
    {
      onSuccess: () => {
        console.log('removed item');
        notify({ message: 'Plaid connection removed', type: NotificationType.Success });

        queryClient.refetchQueries('items');
      },
    }
  );
};
