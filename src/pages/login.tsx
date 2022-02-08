import * as React from "react";
import { useRouter } from "next/router";
import { Magic } from "magic-sdk";
import { useAccount, useConnect, useSignMessage, useNetwork } from "wagmi";
import { SiweMessage } from "siwe";
import clsx from "clsx";
import { useUser } from "@/hooks";
import { Web3AuthModal } from "@/components";
import { fetcher } from "@/utils";

import type { NextPage } from "next";
import type { User } from "@prisma/client";

type AuthFetcher = { success: boolean; message: string; user?: User };

type AuthTab = "MAGIC" | "WEB3";
type AuthState = { magic: boolean; web3: boolean };
const AuthTabReducer = (state: AuthState, action: { type: AuthTab }) => {
  switch (action.type) {
    case "MAGIC":
      return { magic: true, web3: false };
    case "WEB3":
      return { magic: false, web3: true };
    default:
      return state;
  }
};
const initialState = { magic: false, web3: false };

const Login: NextPage = () => {
  const { authenticated, refetch } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });

  const [tab, dispatch] = React.useReducer(AuthTabReducer, initialState);

  const [isOpen, setIsOpen] = React.useState(false);
  const onModalToggle = () => setIsOpen((_) => !_);

  const [errorMsg, setErrorMsg] = React.useState("");

  const [, signMessage] = useSignMessage();
  const [{ data: account }] = useAccount();
  const [
    {
      data: { connected },
    },
  ] = useConnect();
  const [{ data: network }] = useNetwork();

  const { push } = useRouter();

  async function handleMagicAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = { email: event.currentTarget.email.value };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      const auth = await fetcher<AuthFetcher>({
        url: "/api/auth/magic-login",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + didToken,
          },
          body: JSON.stringify(body),
        },
      });
      if (auth.success) {
        return push("/");
      } else {
        throw new Error(auth.message);
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      error instanceof Error
        ? setErrorMsg(error.message)
        : setErrorMsg("An unexpected error happened occurred");
    }
  }

  async function handleWeb3Auth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (errorMsg) setErrorMsg("");

    const address = account?.address;
    const chainId = network?.chain?.id;

    if (!address || !chainId) {
      return setErrorMsg(`Please connect to a wallet
        and make sure you are on Ethereum mainnet.`);
    }
    try {
      const signIn = await fetcher<AuthFetcher>({
        url: `/api/auth/web3-login`,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        },
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
      });
      const { data: signature } = await signMessage({
        message: message.prepareMessage(),
      });

      const auth = await fetcher<AuthFetcher>({
        url: `/api/auth/web3-verify`,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature, message }),
        },
      });

      if (auth.success) {
        refetch();
        return push("/");
      } else {
        throw new Error(auth.message);
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      error instanceof Error
        ? setErrorMsg(error.message)
        : setErrorMsg("An unexpected error happened occurred");
    }
  }

  const connectText = connected ? "CONNECTED" : "Connect Wallet";
  return (
    <main className="flex flex-col justify-center items-center w-full max-w-lg mx-auto mt-16 gap-x-8 space-y-12">
      <ul className="flex flex-col md:flex-row justify-center w-full gap-y-5 gap-x-5">
        <li>
          <button
            onClick={() => dispatch({ type: "MAGIC" })}
            type="button"
            className={clsx(
              `relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group hover:text-white dark:text-white`,

              `bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80`,
              tab.magic && `bg-cyan-400`
            )}
          >
            <span
              className={clsx(
                `relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex align-middle items-center`,
                tab.magic && `dark:bg-opacity-10`
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 26 31"
                fill="none"
                className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
              >
                <path
                  d="M12.8533 0C14.1947 1.64317 15.6741 3.16914 17.274 4.56019C16.2081 8.01821 15.6342 11.6921 15.6342 15.5C15.6342 19.308 16.2081 22.9818 17.274 26.4399C15.6742 27.8309 14.1947 29.3568 12.8533 31C11.5121 29.357 10.0328 27.8312 8.43313 26.4403C9.49916 22.9821 10.0731 19.3081 10.0731 15.5C10.0731 11.6919 9.49916 8.01785 8.43312 4.55968C10.0328 3.16877 11.5121 1.64297 12.8533 0Z"
                  fill="#6851FF"
                />
                <path
                  d="M5.37476 24.049C3.68158 22.8621 1.88466 21.8131 0.000297072 20.9184C0.523041 19.2046 0.804248 17.3854 0.804248 15.5005C0.804248 13.6153 0.522934 11.7958 0 10.0817C1.88446 9.18693 3.68148 8.13791 5.37474 6.95092C6.02224 9.69542 6.36486 12.5577 6.36486 15.5C6.36486 18.4423 6.02225 21.3046 5.37476 24.049Z"
                  fill="#6851FF"
                />
                <path
                  d="M19.3416 15.5C19.3416 18.4423 19.6842 21.3046 20.3317 24.0492C22.0252 22.862 23.8224 21.8129 25.7071 20.9181C25.1845 19.2043 24.9033 17.3853 24.9033 15.5005C24.9033 13.6155 25.1846 11.7961 25.7074 10.0821C23.8226 9.18729 22.0253 8.1381 20.3317 6.95089C19.6842 9.6954 19.3416 12.5577 19.3416 15.5Z"
                  fill="#6851FF"
                />
              </svg>
              Sign In with Magic Link
            </span>
          </button>
        </li>
        <li>
          <button
            onClick={() => dispatch({ type: "WEB3" })}
            type="button"
            className={clsx(
              `relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 hover:text-white dark:text-white`,
              `bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80`,
              tab.web3 && `bg-purple-400`
            )}
          >
            <span
              className={clsx(
                `relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex align-middle items-center`,
                tab.web3 && `dark:bg-opacity-10`
              )}
            >
              <svg
                className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="ethereum"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"
                ></path>
              </svg>
              Sign In with Ethereum
            </span>
          </button>
        </li>
      </ul>

      {tab.magic && (
        <section className="w-full p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleMagicAuth}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Magic Link Auth
            </h3>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={authenticated}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Send me a magic link
            </button>
          </form>
        </section>
      )}

      {tab.web3 && (
        <section className="w-full p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleWeb3Auth}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Web3 Auth
            </h3>
            <button
              type="button"
              disabled={authenticated || connected}
              onClick={onModalToggle}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {connectText}
            </button>
            <button
              type="submit"
              disabled={authenticated || !connected}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Authenticate
            </button>
          </form>
        </section>
      )}
      <Web3AuthModal open={isOpen} onModalClose={onModalToggle} />
    </main>
  );
};

export default Login;
