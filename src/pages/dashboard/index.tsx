import * as React from 'react'
import clsx from 'clsx'
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest } from 'next'

import { authenticate } from '@/lib'
import { Chart } from '@/components/chart'
import { NetworthCard } from '@/components'
import { getAddressBalanceOvertime_1 } from '@/api/blockchain'
import { useRouter } from 'next/router'

const isServerRequest = (req: NextApiRequest) => !req.url?.startsWith('/_next')

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, query } = context
  const { address } = query
  console.log(address)

  const { verifiedPayload, authenticated, message } = await authenticate(req as NextApiRequest)

  if (!authenticated) {
    return { redirect: { destination: '/login', permanent: false } }
  }
  try {
    const providedAddress = address || verifiedPayload?.publicAddress

    const data = await getAddressBalanceOvertime_1(providedAddress as string)
    return { props: { data, error: null } }
  } catch (error) {
    return {
      props: {
        data: [],
        error:
          error instanceof Error ? error.message : 'Encountered an error in getServerSideProps',
      },
    }
  }
}

const Dashboard = ({ data, error }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const label = 'Networth'

  const networthCardsData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    return getNetworthCardData(data[data.length - 1]?.close)
  }, [data])

  const goToDemo = React.useCallback(() => {
    router.push(
      {
        pathname: '/dashboard',
        query: { address: '0x741B875253299A60942E1e7512a79BBbf9A747D7' },
      },
      '/dashboard'
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!data || data.length === 0) {
    return (
      <main className="mt-16 flex h-full min-h-[440px] flex-col items-center space-y-8 overflow-scroll">
        <video autoPlay muted loop playsInline className="px-4">
          <source src={`/assets/videos/no-data.mp4`} type="video/mp4" />
        </video>
        <p className="max-w-[85%] text-3xl font-bold tracking-tight">{'>__<'}</p>
        <button
          onClick={goToDemo}
          className="group relative mb-2 inline-flex w-full max-w-fit items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-lg font-extrabold tracking-widest text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-gray-700"
        >
          <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
            TRY DEMO ?
          </span>
        </button>
      </main>
    )
  }

  return (
    <main className="mt-4 flex h-full w-full flex-col items-center justify-start space-y-12 subpixel-antialiased sm:mt-10">
      <section className={clsx('min-h-full w-full max-w-7xl px-5 sm:px-10 sm:pt-2')}>
        <Chart data={data} label={label} />
      </section>
      <section
        className={clsx(
          `grid w-full max-w-7xl grid-cols-1 justify-start gap-4 px-5 sm:mt-2 sm:grid-cols-2 sm:gap-6 sm:px-10 lg:grid-cols-3`
        )}
      >
        {networthCardsData.map((card, idx) => (
          <NetworthCard key={idx} item={card} />
        ))}
      </section>
    </main>
  )
}

const getNetworthCardData = (close: number) => {
  return [
    {
      title: 'Crypto',
      balance: (close * (30 / 100)).toFixed(2),
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
      balance: (close * (15 / 100)).toFixed(2),
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
      balance: (close * (10 / 100)).toFixed(2),
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
      balance: (close * (5 / 100)).toFixed(2),

      url: '/bank',
      monthlyChange: -1.3,
    },
    {
      title: 'Real Estate',
      balance: (close * (40 / 100)).toFixed(2),
      url: '/real-estate',
      monthlyChange: -476.3,
      topPerformer: { name: 'Beach House', change: 6.3 },
      worstPerformer: { name: 'Main House', change: -0.3 },
    },
  ]
}

export default Dashboard
