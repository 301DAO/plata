import * as React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";

import BaseLayout from "@/components/layouts/BaseLayout";
import { ReactQueryProvider, Web3Provider } from "@/providers";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout || ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <ReactQueryProvider>
      <Web3Provider>{getLayout(<Component {...pageProps} />)}</Web3Provider>
    </ReactQueryProvider>
  );
}
