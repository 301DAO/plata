import * as React from 'react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { BaseLayout } from '@/components/layouts';
import { ReactQueryProvider, Web3Provider } from '@/providers';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => <BaseLayout>{page}</BaseLayout>);

  return (
    <ReactQueryProvider dehydrateState={pageProps.dehydrateState}>
      <Web3Provider>
        {Component.name != 'PageNotFound' && getLayout(<Component {...pageProps} />)}
      </Web3Provider>
    </ReactQueryProvider>
  );
}
