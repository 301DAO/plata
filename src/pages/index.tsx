/* eslint-disable @next/next/no-html-link-for-pages */
import * as React from "react";
import type { NextPage } from "next";
import { useUser } from "@/lib/user";

const Home: NextPage = () => {
  const user = useUser({ redirectTo: "/login" });

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="font-bold"> HI, {JSON.stringify(user)} </div>
      <button
        type="button"
        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <a href="/api/logout">Logout</a>
      </button>
    </>
  );
};

export default Home;
