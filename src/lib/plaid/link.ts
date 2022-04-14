import { NotificationType, notify } from '@/components/base/Notification';
import { PlaidItem } from '@prisma/client';
import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import plataApi from '../axios';
import queryClient from '../react-query';

const createLinkToken = async (itemId: string) => {
  //need itemId to refresh connection
  //TODO: add ability to reauthenticate with plaid item
  console.log(itemId);
  const response = await fetch('/api/plaid/create-link-token', {
    method: 'POST',
  });
  const { data } = await response.json();
  return data.link_token as string;
};

export function useLinkToken(options = {}, itemId = 'newConnection') {
  return useQuery([`linkToken:${itemId}`, itemId], () => createLinkToken(itemId), options);
}

export function removeToken(itemId = 'newConnection') {
  queryClient.removeQueries([`linkToken:${itemId}`, itemId], { exact: true });
}

export interface PublicTokenExchangeRequest {
  publicToken: string;
  institutionId: string;
}

export function generatePublicTokenExchangeRequest(
  publicToken: string,
  institutionId?: string
): PublicTokenExchangeRequest {
  if (!institutionId) {
    throw new Error('institutionId is required');
  }
  return {
    publicToken,
    institutionId,
  };
}

export interface PublicTokenExchangeResponse {
  success: boolean;
  message?: string;
  data?: PlaidItem;
}
const exchangeLinkToken = async (publicTokenExchangeRequest: PublicTokenExchangeRequest) => {
  const { data } = await plataApi.post<PublicTokenExchangeResponse>(
    '/plaid/exchange',
    publicTokenExchangeRequest
  );
  return data;
};

export function useExchangeToken() {
  return useMutation(
    (publicTokenExchangeRequest: PublicTokenExchangeRequest) =>
      exchangeLinkToken(publicTokenExchangeRequest),
    {
      onSuccess: data => {
        notify({
          message: 'Successfully linked account with Plaid  🎉',
          type: NotificationType.Success,
        });
        console.log(data);

        //refetch items
        queryClient.refetchQueries('items');
      },
      onError: error => {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const { response } = error;
          if (response && response.status === 409) {
            notify({
              message: 'You already linked this institution.',
              type: NotificationType.Error,
            });
          } else {
            notify({
              message: `Error exchanging link token: ${error.message}`,
              type: NotificationType.Error,
            });
          }
        } else if (error instanceof Error) {
          notify({ message: error.message, type: NotificationType.Error });
        } else {
          notify({ message: 'Error exchanging link token', type: NotificationType.Error });
        }
      },
    }
  );
}
