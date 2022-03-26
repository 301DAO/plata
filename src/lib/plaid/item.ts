import { PlaidItem } from '@prisma/client';
import { useQuery } from 'react-query';
import plataApi from '../axios';

export interface GetItemsByUserResponse {
  success: boolean;
  message?: string;
  data?: PlaidItem[];
}
const getItemsByUserId = async (userId?: string) => {
  const { data } = await plataApi.get<GetItemsByUserResponse>(`/auth/${userId}/items`);
  return data.data;
};

export const useGetItemsByUserId = (options = {}, userId?: string) => {
  return useQuery(['items', userId], () => getItemsByUserId(userId), options);
};
