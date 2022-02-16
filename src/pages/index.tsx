import * as React from 'react';
import type { NextPage } from 'next';
import { useUser } from '@/hooks';

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: '/login' });

  if (!user) return <>Loading . . .</>;

  return (
    <main className="max-w-xl">
      <p className="font-bold">Hello</p>
      <pre className="">{JSON.stringify(user, null, 2)}</pre>
      <button className="mt-5 inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <a href="/api/auth/logout">Logout</a>
      </button>
    </main>
  );
};

export default Home;
