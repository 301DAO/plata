import * as React from "react";
import type { NextPage } from "next";
import { useUser } from "@/lib/user";

const Home: NextPage = () => {
  const user = useUser({ redirectTo: "/login" });

  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(user);

  return <div className="font-bold"> HI </div>;
};

export default Home;
