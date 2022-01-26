import * as React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { magic } from "@/lib/magic";
import { UserState, UserStateObject } from "@/lib/userContext";
import { UserContext } from "@/lib/userContext";
import { NextPage } from "next";
import BaseLayout from "@/components/layouts/BaseLayout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [userStateObject, setUserState] = React.useState<UserStateObject>();

  const updateUserState = (userState: UserState) => {
    setUserState({ userState });
  };

  React.useEffect(() => {
    updateUserState({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata().then((userData) => {
          updateUserState({ user: userData, loading: false });
          console.log(userData);
        });
      } else {
        updateUserState({ loading: false });
        console.log("Not logged in");
      }
    });
  }, []);

  const getLayout =
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <UserContext.Provider value={userStateObject}>
      {getLayout(<Component {...pageProps} />)}
    </UserContext.Provider>
  );
}
