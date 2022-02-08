import { connectors, webSocketProvider, provider } from "@/wallet";
import * as React from "react";
import { Provider } from "wagmi";
import { useUser } from "@/hooks";

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, user } = useUser({ redirectTo: "/login" });
  console.log(typeof window, authenticated);
  return (
    <>
      {typeof authenticated !== "undefined" && (
        <Provider
          autoConnect={authenticated}
          connectors={connectors}
          provider={provider}
          webSocketProvider={webSocketProvider}
        >
          {children}
        </Provider>
      )}
    </>
  );
};
