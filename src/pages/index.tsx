import * as React from "react";
import type { NextPage } from "next";
import { useUser } from "@/hooks";
import Link from "next/link";

const Home: NextPage = () => {
  const { authenticated, user } = useUser({ redirectTo: "/login" });
  
  if (!user) return <>Loading . . .</>;

  return (
    <main className="max-w-xl">
      <p className="font-bold">Hello</p>
      <p>authenticated: {String(authenticated)}</p>
      <pre className="">{JSON.stringify(user, null, 2)}</pre>
      <button
        type="button"
        className="inline-flex items-center mt-5 px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Link href="/api/auth/logout">Logout</Link>
      </button>
    </main>
  );
};

export default Home;
