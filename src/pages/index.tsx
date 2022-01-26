import * as React from "react";
import type { NextPage } from "next";
import { UserContext } from "@/lib/userContext";

const Home: NextPage = () => {
  const userContext = React.useContext(UserContext);

  if (userContext?.userState.loading) {
    return <div>Loading...</div>;
  }

  return <div className="font-bold"> HI </div>;
};

export default Home;
