import * as React from 'react';
import clsx from 'clsx';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next';

import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';

import { authenticate } from '@/lib';
import { Chart } from '@/components/chart/Chart';
import { getPortfolioValue } from '@/api/blockchain/covalent';
import { shapeData, getBalanceOverTime } from '@/api/blockchain/utils';
import { alchemyTokenBalances } from '@/api/blockchain/alchemy';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const req = context.req as NextApiRequest;
  const { verifiedPayload, authenticated, message } = await authenticate(req);
  if (!authenticated) {
    return {
      props: { data: [], error: message },
    };
  }
  try {
    const response = await getPortfolioValue({
      address: '0x9FB7E6090096C3A0a6b085C8e33d99e5610234fa', // verifiedPayload?.publicAddress as string,
    });
    const shapedData = shapeData(response.data.items);
    let x: any = [];
    console.log(
      shapedData.forEach(d => {
        if (d.balance.usd > 10000000) {
          x.push(d.symbol);
        }
      })
    );
    console.log(JSON.stringify(x, null, 2));
    const data = getBalanceOverTime(shapedData).historical;

    return { props: { data, error: null } };
  } catch (error) {
    return {
      props: {
        data: [],
        error:
          error instanceof Error ? error.message : 'Encountered an error in getServerSideProps',
      },
    };
  }
};

const cardsData = [
  {
    title: 'Crypto',
    balance: 420.69,
    url: '/crypto',
    monthlyChange: 32,
    topPerformer: {
      name: 'BTC',
      change: 12,
    },
    worstPerformer: {
      name: 'ADA',
      change: -99.99,
    },
  },
  {
    title: 'Stocks',
    balance: 1,
    url: '/stocks',
    monthlyChange: -12,
    topPerformer: {
      name: 'AAPL',
      change: 22,
    },
    worstPerformer: {
      name: 'GOOG',
      change: -99.99,
    },
  },
  {
    title: 'NFTs',
    balance: 420.69,
    url: '/crypto',
    monthlyChange: 32,
    topPerformer: {
      name: 'ASM Brain',
      change: 55,
    },
    worstPerformer: {
      name: 'BAYC',
      change: -9.99,
    },
  },
  {
    title: 'Crypto',
    balance: 420.69,
    url: '/crypto',
    monthlyChange: 32,
    topPerformer: {
      name: 'BTC',
      change: 12,
    },
    worstPerformer: {
      name: 'ADA',
      change: -99.99,
    },
  },
  {
    title: 'Stocks',
    balance: 1,
    url: '/stocks',
    monthlyChange: -12,
    topPerformer: {
      name: 'AAPL',
      change: 22,
    },
    worstPerformer: {
      name: 'GOOG',
      change: -99.99,
    },
  },
  {
    title: 'NFTs',
    balance: 420.69,
    url: '/crypto',
    monthlyChange: 32,
    topPerformer: {
      name: 'ASM Brain',
      change: 55,
    },
    worstPerformer: {
      name: 'BAYC',
      change: -9.99,
    },
  },
];

const Dashboard = ({ data, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const label = 'Portfolio Value';

  return (
    <main className="flex flex-col items-center justify-start w-full h-full mt-12">
      <section className="mb-28 h-[400px] w-full max-w-7xl px-5 sm:px-10">
        <ParentSize>
          {({ width, height }) => <Chart w={width} h={height} data={data} label={label} />}
        </ParentSize>
      </section>
      dummy data below
      <section className={clsx(`mt-2 grid w-full max-w-7xl grid-cols-3 justify-start gap-6 px-10`)}>
        {cardsData.map((card, idx) => {
          const negative = card.monthlyChange < 0;
          return (
            <div
              key={idx}
              className={clsx(
                `text-md group relative mb-2 inline-flex w-full transform items-center justify-center overflow-hidden rounded-t-lg border-t-transparent bg-gradient-to-br pb-0.5 text-center font-medium text-gray-900 hover:z-10 hover:rounded-lg hover:bg-gradient-to-tl hover:p-0.5 hover:text-white focus:ring-4`,
                `dark:text-white dark:shadow-lg`,
                negative &&
                  `from-pink-400 via-pink-600 to-pink-600 shadow-pink-500/50 focus:ring-pink-300 dark:shadow-pink-800/50 dark:focus:ring-pink-800`,
                !negative &&
                  `from-emerald-400 via-green-600 to-emerald-600 shadow-pink-600/50 focus:ring-emerald-300 dark:shadow-emerald-800/50 dark:focus:ring-emerald-800`
              )}
            >
              <a
                className={clsx(
                  `group-hover:bg-opacity-1 relative grid h-full w-full cursor-pointer grid-cols-2 place-content-between items-center justify-center gap-y-8 rounded-t-lg bg-white p-4 align-middle transition-all duration-75 ease-in hover:rounded-md dark:bg-gray-900`
                )}
              >
                <p className={clsx(`place-self-start text-2xl font-extrabold tracking-tight`)}>
                  {card.title}
                </p>
                <p
                  className={clsx(
                    `flex justify-start justify-self-end text-right text-2xl font-bold`,
                    card?.monthlyChange > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {negative ? '' : '+'}
                  {card.monthlyChange}%
                </p>
                <p className="mt-auto text-3xl font-extrabold tracking-tight text-left">
                  ${card.balance}
                </p>

                <p
                  className={clsx(
                    `align-items-end ml-auto flex flex-col items-end justify-end place-self-end pb-[2px] text-sm`
                  )}
                >
                  <span className="text-emerald-300">
                    ▲ {card.topPerformer.name}&nbsp;{card.topPerformer.change}%
                  </span>
                  <span className="text-red-400">
                    ▼ {card.worstPerformer.name}&nbsp;{card.worstPerformer.change}%
                  </span>
                </p>
              </a>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Dashboard;
