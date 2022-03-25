import {
  generatePublicTokenExchangeRequest,
  removeToken,
  useExchangeToken,
} from '@/lib/plaid/link';
import React, { Dispatch, useEffect } from 'react';
import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
  PlaidLinkStableEvent,
  usePlaidLink,
} from 'react-plaid-link';

interface PlaidLaunchLinkProps {
  isOauth?: boolean;
  token: string;
  userId: string;
  itemId?: string | undefined;
  setFetchLinkToken: Dispatch<boolean>;
}

const PlaidLaunchLink = ({
  isOauth,
  token,
  userId,
  itemId,
  setFetchLinkToken,
}: PlaidLaunchLinkProps) => {
  const exchangeTokenMutation = useExchangeToken();

  const onSuccess = async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log('onSuccess:  ', itemId, publicToken, metadata);
    if (itemId) {
      //itemId is defined if we have to update an existing connection
      //do more to retrieve the item again
    } else {
      // call to exchange public_token for access_token
      const exchangeTokenRequest = generatePublicTokenExchangeRequest(
        publicToken,
        metadata.institution?.institution_id
      );
      exchangeTokenMutation.mutate(exchangeTokenRequest);
    }

    removeToken(itemId);
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log('onEvent:  ', itemId, eventName, metadata);

    switch (eventName) {
      case PlaidLinkStableEvent.OPEN:
        setFetchLinkToken(false);
        break;
      case PlaidLinkStableEvent.EXIT:
        removeToken(itemId);
        setFetchLinkToken(false);
        break;
    }
  };

  const onExit = async (error: PlaidLinkError | null, metadata: PlaidLinkOnExitMetadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit

    if (error && error.error_code === 'INVALID_LINK_TOKEN') {
      setFetchLinkToken(true);
    }
    console.log('onExit:  ', error, metadata);
  };

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onEvent,
    onExit,
  };

  const {
    open,
    ready,
    // error,
    // exit
  } = usePlaidLink(config);
  useEffect(() => {
    if (isOauth && ready) {
      // initializes link automatically if isOauth
      open();
    } else if (ready) {
      setFetchLinkToken(false);
      // regular, non OAuth case:
      // set linkToken, userId, itemId in local storage for use if needed by oauth later
      localStorage.setItem(
        'plaidOauthConfig',
        JSON.stringify({
          token: token,
          userId: userId,
          itemId: itemId,
        })
      );
      open();
    }
  }, [isOauth, token, userId, itemId, ready, open, setFetchLinkToken]);

  return <></>;
};

export default PlaidLaunchLink;
