import * as React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Magic } from "magic-sdk";
import { useConnect } from "wagmi";
import { SiweMessage } from "siwe";
import clsx from "clsx";
import { useUser } from "@/hooks";
import { Web3AuthModal } from "@/components";
import { timeFromNow } from "@/utils";
import {
  LoadingSpinner,
  EthereumIcon,
  MagicIcon,
  WalletIcon,
} from "@/components/icons";

import type { NextPage } from "next";
import type { User } from "@prisma/client";

type AuthFetcher = { success: boolean; message: string; user?: User };

type AuthState = {
  connecting: boolean;
  connected: boolean;
  error: boolean;
  errorMessage: string;
};

type AuthAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED" }
  | { type: "ERROR"; payload: string };

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "CONNECTING":
      return {
        ...state,
        connecting: true,
        connected: false,
        error: false,
        errorMessage: "",
      };
    case "CONNECTED":
      return {
        ...state,
        connecting: false,
        connected: true,
        error: false,
        errorMessage: "",
      };
    case "ERROR":
      return {
        ...state,
        connecting: false,
        connected: false,
        error: true,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  connecting: false,
  connected: false,
  error: false,
  errorMessage: "",
};

const Login: NextPage = () => {
  const { push } = useRouter();

  const { authenticated } = useUser({ redirectTo: "/", redirectIfFound: true });

  const [web3AuthState, web3Dispatch] = React.useReducer(
    authReducer,
    initialAuthState
  );
  const [magicAuthState, magicDispatch] = React.useReducer(
    authReducer,
    initialAuthState
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => setModalOpen((_) => !_);

  const [{ data }, connect] = useConnect();
  const { connectors } = data;

  async function handleMagicAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    magicDispatch({ type: "CONNECTING" });
    const body = { email: event.currentTarget.email.value };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      const { data: auth } = await axios.post<AuthFetcher>(
        "/api/auth/magic-login",
        body,
        {
          headers: { Authorization: `Bearer ${didToken}` },
        }
      );

      if (auth.success) {
        magicDispatch({ type: "CONNECTED" });
        return push("/");
      } else {
        throw new Error(auth.message);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      magicDispatch({
        type: "ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "An unexpected error happened",
      });
    }
  }

  async function handleWeb3Auth(connector: typeof connectors[0]) {
    toggleModal();
    web3Dispatch({ type: "CONNECTING" });

    try {
      const connection = await connect(connector);
      if (connection.error) throw new Error(connection.error.message);

      const address = await connector.getAccount();
      const chainId = await connector.getChainId();
      const signer = await connector.getSigner();

      if (!address || !chainId || !signer) {
        throw new Error(
          "Please connect to a wallet and make sure you are on Ethereum mainnet."
        );
      }

      const { data: signIn } = await axios.post(`/api/auth/web3-login`, {
        address,
      });

      if (!signIn.success) throw new Error(signIn.message);
      const { user } = signIn;

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce: user?.nonce as string,
        issuedAt: new Date().toISOString(),
        expirationTime: timeFromNow({ unit: "MINUTES", value: 5 }),
      });
      const signature = await signer.signMessage(message.prepareMessage());

      const { data: auth } = await axios.post<AuthFetcher>(
        `/api/auth/web3-verify`,
        {
          address,
          signature,
          message,
        }
      );

      if (auth.success) {
        web3Dispatch({ type: "CONNECTED" });
        return push("/");
      } else {
        throw new Error(auth.message);
      }
    } catch (error: any) {
      console.error("An unexpected error occurred:", error);
      web3Dispatch({
        type: "ERROR",
        payload:
          error instanceof Error || error["code"] // error["code"] is for metamask
            ? error.message
            : "Encountered an error while signing in with Ethereum. Refresh the page to try again. Make sure you are on the Ethereum mainnet.",
      });
    }
  }

  return (
    <main className="flex flex-col justify-center items-center w-full max-w-lg mx-auto mt-4 gap-x-8 space-y-1">
      <p>{web3AuthState.errorMessage}</p>
      <p>{magicAuthState.errorMessage}</p>
      <section className="w-full p-4 max-w-sm bg-white rounded-lg shadow-md sm:p-6 lg:p-4 dark:bg-transparent">
        <form className="space-y-6" onSubmit={handleMagicAuth}>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-200 focus:border-gray-400 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Your email address"
            required
          />
          <button
            type="submit"
            disabled={authenticated}
            className={clsx(
              `w-full text-center relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-md font-medium text-gray-900 rounded-lg group hover:text-white dark:text-white`,

              `bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80`,
              magicAuthState.connected && `bg-cyan-400`
            )}
          >
            <span
              className={clsx(
                `w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex justify-center align-middle items-center`,
                magicAuthState.connecting &&
                  `bg-cyan-500 opacity-70 text-gray-50`,
                magicAuthState.error && `dark:bg-gray-70 opacity-90 text-white`,
                magicAuthState.connected && `dark:bg-opacity-10`
              )}
            >
              {magicAuthState.connecting ? (
                <>
                  Check your email &nbsp;&nbsp;&nbsp;
                  <LoadingSpinner />
                </>
              ) : magicAuthState.error ? (
                "Something's wrong."
              ) : (
                <>
                  <MagicIcon />
                  Sign In with Magic Link
                </>
              )}
            </span>
          </button>
        </form>
      </section>

      {/** Divider */}
      <div className="relative flex py-3 items-center w-8/12 leading-[1em] outline-0 border-0 text-center h-[1.5em] opacity-50">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-3 text-gray-200">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <section className="w-full p-4 max-w-sm bg-white rounded-lg shadow-md sm:p-6 lg:p-4 dark:bg-transparent">
        <button
          disabled={authenticated}
          onClick={toggleModal}
          type="button"
          className={clsx(
            `w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-md font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 hover:text-white dark:text-white`,
            `bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80`,
            web3AuthState.connected && `bg-purple-400`
          )}
        >
          <span
            className={clsx(
              `w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex justify-center align-middle items-center`,
              web3AuthState.connecting &&
                `bg-purple-500 opacity-70 text-gray-50`,
              web3AuthState.error && `dark:bg-gray-70 opacity-90 text-white`,
              web3AuthState.connected && `dark:bg-opacity-10`
            )}
          >
            {web3AuthState.connecting ? (
              <>
                Check Wallet &nbsp;&nbsp;&nbsp;
                <LoadingSpinner />
              </>
            ) : (
              <>
                <EthereumIcon />
                Sign In with Ethereum
              </>
            )}
          </span>
        </button>
        <Web3AuthModal open={modalOpen} onModalClose={toggleModal}>
          {connectors.map((connector) => (
            <button
              type="submit"
              disabled={!connector.ready}
              key={connector.name}
              className="pt-3 w-full flex flex-col items-center justify-end pb-4 gap-y-2 hover:text-white hover:bg-[rgb(31,32,53)] focus:outline-none antialiased text-xl font-normal tracking-wide hover:cursor-pointer"
              onClick={async () => await handleWeb3Auth(connector)}
            >
              <WalletIcon name={connector.name} />
              {connector.name}
            </button>
          ))}
        </Web3AuthModal>
      </section>
    </main>
  );
};

export default Login;
