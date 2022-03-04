import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

import { useUser } from '@/hooks'

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: '/login' })
  const router = useRouter()

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

  if (!user) return <>Loading . . .</>
  return (
    <main className="mt-28 max-w-xl">
      <button
        onClick={goToDemo}
        className="group relative mb-2 inline-flex w-full max-w-fit items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-lg font-extrabold tracking-tighter text-gray-900 hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-gray-700"
      >
        <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
          DASHBOARD DEMO
        </span>
      </button>

      <div className="my-10">
        <p className="font-bold">You 🤌</p>
        <p>id: {user.id}</p>
        <p>email: {user.email}</p>
        <div>
          <p>wallet address:</p>
          <p className="md:text-md truncate text-ellipsis break-words text-sm">
            {user.publicAddress}
          </p>
        </div>
        <p>
          last login: {dayjs(new Date(user.lastLogin).toISOString()).format('YYYY-MM-DD hh:mm:ss')}
        </p>
      </div>

      <a
        href="/api/auth/logout"
        className="text-md group relative mt-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 font-extrabold text-gray-900 hover:cursor-pointer hover:text-white focus:ring-4 focus:ring-cyan-200 group-hover:from-cyan-500 group-hover:to-blue-500 dark:text-white dark:focus:ring-cyan-800"
      >
        <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
          LOGOUT
        </span>
      </a>
    </main>
  )
}

export default Home
