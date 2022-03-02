import React, { useCallback, useState } from "react";

import {
  usePlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
} from "react-plaid-link";

const PlaidLink = () => {
  const [token, setToken] = useState<string | null>(null);

  // get a link_token from your API when component mounts
  React.useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
      });
      const { data } = await response.json();
      setToken(data.link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log(publicToken, metadata);
  }, []);
  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log(eventName, metadata);
  }, []);
  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
  }, []);

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

  return (
    <button
      className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={() => open()}
      disabled={!ready}
    >
      <a>Link a financial institution</a>
    </button>
  );
};

export default PlaidLink;
