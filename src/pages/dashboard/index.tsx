import { getAddressBalanceOvertime_1, getAddressNFTData } from '@/backend/blockchain';
import type { Historical } from '@/backend/blockchain/helpers/utils.types';
import { GoToDemoButton } from '@/components';
import type { NetworthCardProps } from '@/components/chart';
import { Chart, NetworthCard } from '@/components/chart';
import { authenticate } from '@/lib';
import { passEthAddressRegex } from '@/utils';
import clsx from 'clsx';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextApiRequest,
} from 'next';
import * as React from 'react';

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Dashboard = ({ data, error }: DashboardProps) => {
  const label = 'Networth';

  if (!data || error) {
    return <ErrorResult error={error} />;
  }

  return (
    <main className="mt-4 flex h-full w-full flex-col items-center justify-start space-y-8 subpixel-antialiased sm:mt-10">
      <section className={clsx('min-h-full w-full max-w-7xl px-5 sm:px-10 sm:pt-2')}>
        <Chart data={data.crypto} label={label} totalBalance={data.totalBalance} />
      </section>
      <section className="box-border grid w-full max-w-7xl grid-cols-1 justify-start gap-4 px-5 sm:mt-2 sm:grid-cols-2 sm:gap-6 sm:px-10 lg:grid-cols-3">
        {data.nft && [data.nft].map((card, idx) => <NetworthCard key={idx} item={card} />)}
      </section>
    </main>
  );
};

type GetServerSidePropsResponse = GetServerSidePropsResult<{
  data: {
    totalBalance: number;
    crypto: Historical[] | null;
    nft: NetworthCardProps | null;
  } | null;
  error: string | null;
}>;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResponse> => {
  const { req, query } = context;
  const { address } = query;

  const { user, authenticated } = await authenticate(req as NextApiRequest);

  if (!authenticated) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  try {
    const providedAddress = (address || user?.publicAddress) as string;
    if (!passEthAddressRegex(providedAddress)) {
      return { props: { data: null, error: `${providedAddress} is not a valid address` } };
    }
    const crypto = (await getAddressBalanceOvertime_1(providedAddress)).historical;
    const nft = await getAddressNFTData((providedAddress as string).toLowerCase());
    if (!nft) {
      return {
        props: {
          data: { totalBalance: crypto[crypto.length - 1].close, crypto, nft: null },
          error: null,
        },
      };
    }
    const item: NetworthCardProps = {
      title: 'NFTs',
      balance: (nft.balance * 3500).toFixed(2),
      monthlyChange: nft.totalChange,
      url: '/nft',
      topPerformer: {
        name: nft.best.collection,
        change: nft.best.monthlyChange.toFixed(2),
      },
      worstPerformer: {
        name: nft.worst.collection,
        change: nft.worst.monthlyChange.toFixed(2),
      },
    };
    // from crypto and nft
    const totalBalance = crypto[crypto.length - 1].close + nft.balance * 3500;
    const data = { totalBalance, crypto, nft: item };

    return { props: { data, error: null } };
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : `$Encountered an error in getServerSideProps: ${error}`
    );
    return { props: { data: null, error: 'Encountered an opsy' } };
  }
};

const ErrorResult = ({ error }: { error: string | null }) => (
  <main className="mt-16 flex h-full min-h-[440px] flex-col items-center space-y-8 overflow-scroll">
    <video autoPlay muted loop playsInline className="px-4">
      <source src={`/assets/videos/no-data.mp4`} type="video/mp4" />
    </video>
    <section className="max-w-[85%] text-3xl">
      <p className="font-bold tracking-tight">{'>__<'}</p>
      <p>{error}</p>
    </section>
    <GoToDemoButton text="TRY DEMO ?" />
  </main>
);

export default Dashboard;
