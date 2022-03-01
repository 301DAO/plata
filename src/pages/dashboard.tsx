import * as React from 'react';
import clsx from 'clsx';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next';

import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';
import { getPortfolioValue } from '@/api/blockchain/covalent';
import { shapeData, getBalanceOverTime } from '@/api/blockchain/utils';

import { authenticate } from '@/lib';
import { Chart } from '@/components/Chart';

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
      address: '0xcE96670971ec2E1E79D0d96688adbA2FfD6F6C7f', // verifiedPayload?.publicAddress as string,
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

export type AreaProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Dashboard = ({ data, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const label = 'Portfolio Value';

  return (
    <main className="flex flex-col items-center justify-start w-full h-full mt-12">
      <section className="mb-32 h-[400px] w-full max-w-7xl px-5 sm:px-10">
        <ParentSize>
          {({ width, height }) => <Chart w={width} h={height} data={data} label={label} />}
        </ParentSize>
      </section>
      <section>
        <div></div>
      </section>
    </main>
  );
};

export default Dashboard;
