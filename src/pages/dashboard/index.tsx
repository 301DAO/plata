import * as React from 'react';
import clsx from 'clsx';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';

import { authenticate } from '@/lib';
import { Chart } from '@/components/chart';
import { getAddressBalanceOvertime_1 } from '@/api/blockchain';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, query } = context;
  const { address } = query;

  const { verifiedPayload, authenticated, message } = await authenticate(req as NextApiRequest);
  if (!authenticated) {
    return {
      props: { data: [], error: message },
    };
  }
  try {
    const providedAddress = address || verifiedPayload?.publicAddress;
    const data = await getAddressBalanceOvertime_1(providedAddress as string);
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

const Dashboard = ({ data, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const label = 'Networth';
  const cardsData = [
    {
      title: 'Crypto',
      balance: (data[data.length - 1].close * (30 / 100)).toFixed(2),
      url: '/crypto',
      monthlyChange: 32,
      topPerformer: {
        name: 'BTC',
        change: 8,
      },
      worstPerformer: {
        name: 'CVX',
        change: -28.31,
      },
    },
    {
      title: 'Stocks',
      balance: (data[data.length - 1].close * (15 / 100)).toFixed(2),
      url: '/stocks',
      monthlyChange: -12,
      topPerformer: {
        name: 'DIS',
        change: 2.21,
      },
      worstPerformer: {
        name: 'FB',
        change: -36.62,
      },
    },
    {
      title: 'NFTs',
      balance: (data[data.length - 1].close * (10 / 100)).toFixed(2),
      url: '/crypto',
      monthlyChange: 25,
      topPerformer: {
        name: 'Degen Toonz',
        change: 75,
      },
      worstPerformer: {
        name: 'BAYC',
        change: -0.5,
      },
    },
    {
      title: 'Checking / Savings',
      balance: (data[data.length - 1].close * (5 / 100)).toFixed(2),

      url: '/bank',
      monthlyChange: -1.3,
    },
    {
      title: 'Real Estate',
      balance: (data[data.length - 1].close * (40 / 100)).toFixed(2),
      url: '/real-estate',
      monthlyChange: -476.3,
      topPerformer: { name: 'Beach House', change: 6.3 },
      worstPerformer: { name: 'Main House', change: -0.3 },
    },
  ];
  return (
    <main className="mt-12 flex h-full w-full flex-col items-center justify-start">
      <section className="mb-28 h-[400px] w-full max-w-7xl px-5 sm:px-10">
        <ParentSize>
          {({ width, height }) => <Chart w={width} h={height} data={data} label={label} />}
        </ParentSize>
      </section>
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
                  `relative grid h-full w-full cursor-pointer grid-flow-row-dense grid-cols-2 place-content-between items-center gap-y-8 align-middle`,
                  `group-hover:bg-opacity-1 rounded-t-lg bg-white p-4 transition-all duration-75 ease-in hover:rounded-md dark:bg-gray-900`
                )}
              >
                <div className="col-span-2 flex h-full w-full justify-between">
                  <p
                    className={clsx(
                      `place-self-start text-left text-2xl font-extrabold tracking-tight`
                    )}
                  >
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
                </div>

                <p className="mt-auto text-left text-3xl font-extrabold tracking-tight">
                  ${card.balance}
                </p>

                {card.topPerformer && (
                  <p
                    className={clsx(
                      `align-items-end ml-auto flex flex-col items-end justify-end place-self-end pb-[2px] text-sm`
                    )}
                  >
                    <span className="text-emerald-300">
                      ▲ {card.topPerformer?.name}&nbsp;{card.topPerformer?.change}%
                    </span>
                    <span className="text-red-400">
                      ▼ {card.worstPerformer?.name}&nbsp;{card.worstPerformer?.change}%
                    </span>
                  </p>
                )}
              </a>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Dashboard;
