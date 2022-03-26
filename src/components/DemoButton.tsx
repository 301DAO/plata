import * as React from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { LoadingSpinner } from './icons';
import { randomArrayElement } from '@/utils';
import { demoAddresses } from '@/data/blockchains/ethereum';

export const GoToDemoButton = ({ text }: { text: string }) => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const goToDemo = React.useCallback(() => {
    setLoading(true);
    const query = { address: randomArrayElement(demoAddresses) };
    router.push({ pathname: '/dashboard', query }, '/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const LoadingEffect = (
    <p className="flex space-x-2">
      <span>TELEPORTING</span>
      <LoadingSpinner />
    </p>
  );
  return (
    <button
      onClick={goToDemo}
      disabled={loading}
      className={clsx(
        `group relative mb-2 inline-flex w-full max-w-fit items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-lg font-extrabold tracking-widest text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-gray-700`,
        loading && 'cursor-wait'
      )}
    >
      <div
        className={clsx(
          `relative flex w-full rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900`,
          loading && `pointer-events-none text-gray-200`
        )}
      >
        {loading ? LoadingEffect : text}
      </div>
    </button>
  );
};
