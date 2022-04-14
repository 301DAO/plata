import { GoToDemoButton } from '@/components';
import { Button } from '@/components/base/Button';
import { NotificationType, notify } from '@/components/base/Notification';
import PlaidLaunchLink from '@/components/PlaidLink';
import { useUser } from '@/hooks';
import { useGetItemsByUserId, useRemoveItemById } from '@/lib/plaid/item';
import { useLinkToken } from '@/lib/plaid/link';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import Link from 'next/link';
import * as React from 'react';

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: '/login' });
  const [fetchLinkToken, setFetchLinkToken] = React.useState(false);
  const { data: token } = useLinkToken({ enabled: fetchLinkToken });
  const { data: items } = useGetItemsByUserId({ enabled: !!user }, user?.id);
  const deleteItem = useRemoveItemById();

  const initiateLink = async () => {
    setFetchLinkToken(true);
  };

  if (!user) return <>Loading . . .</>;
  return (
    <>
      <GoToDemoButton text={'DASHBOARD DEMO ?'} />
      <div className="my-10">
        <p className="font-bold">You 🤌</p>
        <p>id: {user.id}</p>
        <p>email: {user.email}</p>
        <div>
          <p>wallet address:</p>
          <p className="md:text-md truncate text-ellipsis break-words text-sm">
            {user.publicAddress}
          </p>
        </div>
        <p>
          last login: {dayjs(new Date(user.lastLogin).toISOString()).format('YYYY-MM-DD hh:mm:ss')}
        </p>
        <p>{`${items?.length} plaid connections: `}</p>
        {items?.map(item => (
          <div
            key={item.id}
            className="max-w-sm  rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex w-0 flex-1 justify-between">
                  <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                    {item.plaidInstitutionId}
                  </p>

                  <button
                    type="button"
                    className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => deleteItem.mutate({ userId: user.id, itemId: item.id })}
                  >
                    disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/api/auth/logout"
        className="text-md group relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 font-extrabold text-gray-900 hover:cursor-pointer hover:text-white focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
      >
        <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
          LOGOUT
        </span>
      </a>
      <div className="flex flex-col items-center justify-center">
        <Button className="mt-2" size="regular" onClick={initiateLink}>
          CONNECT FINANCIAL INSTITUTION
        </Button>
        {token && token.length > 0 && (
          <PlaidLaunchLink token={token} userId={user.id} setFetchLinkToken={setFetchLinkToken} />
        )}
        <Button
          className="mt-2"
          size="regular"
          onClick={() => notify({ message: 'test', type: NotificationType.Success })}
        >
          TEST SUCCESS NOTIFICATION
        </Button>
        <Button
          className="mt-2"
          size="regular"
          onClick={() =>
            notify({
              message: 'You have already linked an account at this institution.',
              type: NotificationType.Error,
            })
          }
        >
          TEST ERROR NOTIFICATION
        </Button>
        <Button
          className="mt-2"
          size="regular"
          onClick={() => notify({ message: 'test', type: NotificationType.Info })}
        >
          TEST INFO NOTIFICATION
        </Button>
        <Link href="/manage" passHref>
          <Button className="mt-2" size="regular">
            Manage Connections
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Home;
