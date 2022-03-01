import * as React from 'react';
import clsx from 'clsx';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next';

import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';

import { authenticate } from '@/lib';
import { Chart } from '@/components/Chart';
import { getPortfolioValue } from '@/api/blockchain/covalent';
import { shapeData, getBalanceOverTime } from '@/api/blockchain/utils';
import Link from 'next/link';

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
      address: verifiedPayload?.publicAddress as string,
    });
    const shapedData = shapeData(response.data.items);

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
                `transform rounded-t-lg bg-gradient-to-br pb-[0.1em] shadow-sm hover:z-10 hover:scale-[1.25] hover:rounded-lg hover:bg-gradient-to-tr hover:p-[0.1em]`,
                negative && `from-pink-400 to-pink-600`,
                !negative && `from-emerald-200 to-emerald-500`
              )}
            >
              <a
                className={clsx(
                  `min-w-[150px] justify-between bg-[#14141b] p-4 text-gray-200 hover:cursor-pointer`,
                  `rounded-t-md`,
                  `box-shadow-md border-2 border-slate-900 hover:rounded-md`,
                  `grid grid-cols-2 place-content-between gap-y-8`
                )}
              >
                <p className={clsx('text-2xl font-extrabold tracking-tight', `place-self-start`)}>
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
