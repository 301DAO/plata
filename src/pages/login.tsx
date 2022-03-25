import * as React from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { Magic } from 'magic-sdk';
import { useConnect } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useRouter } from 'next/router';

import { useUser } from '@/hooks';
import { timeFromNow } from '@/utils';
import { Web3AuthModal } from '@/components';
import { LoadingSpinner, EthereumIcon, MagicIcon, WalletIcon } from '@/components/icons';

import type { NextPage } from 'next';
import type { User } from '@prisma/client';

type AuthFetcher = { success: boolean; message: string; user?: User };

type AuthState = {
  status: string;
  errorMessage: string;
};

type AuthAction =
  | { type: 'DISCONNECTED' }
  | { type: 'CONNECTING' }
  | { type: 'CONNECTED' }
  | { type: 'ERROR'; payload: string };

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'CONNECTING':
      return {
        ...state,
        status: action.type,
        errorMessage: '',
      };
    case 'CONNECTED':
      return {
        ...state,
        status: action.type,
        errorMessage: '',
      };
    case 'ERROR':
      return {
        ...state,
        status: action.type,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  status: 'DISCONNECTED',
  errorMessage: '',
};

const Login: NextPage = () => {
  const router = useRouter();

  const { authenticated, refetch } = useUser({ redirectTo: '/', redirectIfFound: true });

  const [web3AuthState, web3Dispatch] = React.useReducer(authReducer, initialAuthState);
  const [magicAuthState, magicDispatch] = React.useReducer(authReducer, initialAuthState);

  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => setModalOpen(_ => !_);

  const [{ data }, connect] = useConnect();
  const { connectors } = data;

  async function handleMagicAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    magicDispatch({ type: 'CONNECTING' });
    const body = { email: event.currentTarget.email.value };

    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });
      const { data: auth } = await axios.post<AuthFetcher>('/api/auth/magic-login', body, {
        headers: { Authorization: `Bearer ${didToken}` },
      });

      if (auth.success) {
        magicDispatch({ type: 'CONNECTED' });
        refetch();
        return router.push('/');
      } else {
        throw new Error(auth.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      magicDispatch({
        type: 'ERROR',
        payload: error instanceof Error ? error.message : 'An unexpected error happened',
      });
    }
  }

  async function handleWeb3Auth(connector: typeof connectors[0]) {
    toggleModal();
    web3Dispatch({ type: 'CONNECTING' });

    try {
      const connection = await connect(connector);
      if (connection.error) throw new Error(connection.error.message);

      const address = await connector.getAccount();
      const chainId = await connector.getChainId();
      const signer = await connector.getSigner();

      if (!address || !chainId || !signer) {
        throw new Error('Please connect to a wallet and make sure you are on Ethereum mainnet.');
      }

      const { data: signIn } = await axios.post(`/api/auth/web3-login`, {
        address,
      });

      if (!signIn.success) throw new Error(signIn.message);
      const { user } = signIn;

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: user?.nonce as string,
        issuedAt: new Date().toISOString(),
        expirationTime: timeFromNow({ unit: 'MINUTES', value: 5 }),
      });
      const signature = await signer.signMessage(message.prepareMessage());

      const { data: auth } = await axios.post<AuthFetcher>(`/api/auth/web3-verify`, {
        address,
        signature,
        message,
      });

      if (auth.success) {
        web3Dispatch({ type: 'CONNECTED' });
        refetch();
        return router.push('/');
      } else {
        throw new Error(auth.message);
      }
    } catch (error: any) {
      console.error('Could not connect:', error);
      web3Dispatch({
        type: 'ERROR',
        payload:
          error instanceof Error || error['code'] // error["code"] is for metamask
            ? error.message
            : 'Encountered an error while signing in with Ethereum. Refresh the page to try again. Make sure you are on the Ethereum mainnet.',
      });
    }
  }

  return (
    <main className="mx-auto mt-28 flex w-full max-w-lg flex-col items-center justify-center gap-x-8 space-y-1">
      <p className="my-2 text-lg font-bold">{web3AuthState.errorMessage}</p>
      <p className="my-2 text-lg font-bold">{magicAuthState.errorMessage}</p>
      <section className="w-full max-w-sm rounded-lg bg-white p-4 shadow-md dark:bg-transparent sm:p-6 lg:p-4">
        <form className="space-y-6" onSubmit={handleMagicAuth}>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-400 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Your email address"
            required
          />
          <button
            type="submit"
            disabled={authenticated}
            className={clsx(
              `text-md group relative mb-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg p-0.5 text-center font-medium text-gray-900 hover:text-white dark:text-white`,

              `bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-cyan-300 dark:shadow-lg dark:shadow-cyan-800/80 dark:focus:ring-cyan-800`,
              magicAuthState.status === 'CONNECTED' && `bg-cyan-400`
            )}
          >
            <span
              className={clsx(
                `relative flex w-full items-center justify-center rounded-md bg-white px-5 py-2.5 align-middle transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900`,
                magicAuthState.status === 'CONNECTING' && `bg-cyan-500 text-gray-50 opacity-70`,
                magicAuthState.status === 'ERROR' && `dark:bg-gray-70 text-white opacity-90`,
                magicAuthState.status === 'CONNECTED' && `dark:bg-opacity-10`
              )}
            >
              {magicAuthState.status === 'CONNECTING' ? (
                <>
                  Check your email &nbsp;&nbsp;&nbsp;
                  <LoadingSpinner />
                </>
              ) : magicAuthState.status === 'ERROR' ? (
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
      <div className="relative flex h-[1.5em] w-8/12 items-center border-0 py-3 text-center leading-[1em] opacity-50 outline-0">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-3 flex-shrink text-gray-200">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>

      <section className="w-full max-w-sm rounded-lg bg-white p-4 shadow-md dark:bg-transparent sm:p-6 lg:p-4">
        <button
          disabled={authenticated}
          onClick={toggleModal}
          type="button"
          className={clsx(
            `text-md group relative mb-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 p-0.5 font-medium text-gray-900 hover:text-white dark:text-white`,
            `bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-lg shadow-purple-500/50 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:shadow-lg dark:shadow-purple-800/80 dark:focus:ring-purple-800`,
            web3AuthState.status === 'CONNECTED' && `bg-purple-400`
          )}
        >
          <span
            className={clsx(
              `relative flex w-full items-center justify-center rounded-md bg-white px-5 py-2.5 align-middle transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900`,
              web3AuthState.status === 'CONNECTING' && `bg-purple-500 text-gray-50 opacity-70`,
              web3AuthState.status === 'ERROR' && `dark:bg-gray-70 text-white opacity-90`,
              web3AuthState.status === 'CONNECTED' && `dark:bg-opacity-10`
            )}
          >
            {web3AuthState.status === 'CONNECTING' ? (
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
          {connectors.map(connector => (
            <button
              type="submit"
              disabled={!connector.ready}
              key={connector.name}
              className="flex w-full flex-col items-center justify-end gap-y-2 pt-3 pb-4 text-xl font-normal tracking-wide antialiased hover:cursor-pointer hover:bg-[rgb(31,32,53)] hover:text-white focus:outline-none"
              onClick={async () => await handleWeb3Auth(connector)}
            >
              <WalletIcon name={connector.name} />
              {connector.name.toLowerCase() === 'injected' ? 'MetaMask' : connector.name}
            </button>
          ))}
        </Web3AuthModal>
      </section>
    </main>
  );
};

export default Login;
