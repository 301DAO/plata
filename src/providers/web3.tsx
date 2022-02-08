import { connectors, webSocketProvider, provider } from "@/wallet";
import * as React from "react";
import { Provider } from "wagmi";
import { useUser } from "@/hooks";

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useUser({ redirectTo: "/login" });
  // TODO: add nice spinner / loader when loading
  if (typeof authenticated === "undefined") return <></>;
  return (
    <>
      <Provider
        autoConnect={authenticated}
        connectors={connectors}
        provider={provider}
        webSocketProvider={webSocketProvider}
      >
        {children}
      </Provider>
    </>
  );
};

export default Web3Provider;
