import { GoToDemoButton } from '@/components';
import { Button } from '@/components/base/Button';
import { NotificationType, notify } from '@/components/base/Notification';
import PlaidLaunchLink from '@/components/PlaidLink';
import { useUser } from '@/hooks';
import { useGetItemsByUserId } from '@/lib/plaid/item';
import { useLinkToken } from '@/lib/plaid/link';
import dayjs from 'dayjs';
import { NextPage } from 'next';
import * as React from 'react';

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: '/login' });
  const [fetchLinkToken, setFetchLinkToken] = React.useState(false);
  const { data: token } = useLinkToken({ enabled: fetchLinkToken });
  const { data: items } = useGetItemsByUserId({ enabled: !!user }, user?.id);

  const initiateLink = async () => {
    setFetchLinkToken(true);
  };

  if (!user) return <>Loading . . .</>;
  return (
    <main className="mt-12 max-w-xl">
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
          <p key={item.id}>{item.plaidInstitutionId}</p>
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
    </main>
  );
};

export default Home;
