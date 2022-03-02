<<<<<<< HEAD
import * as React from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useUser } from '@/hooks'
import { randomArrayElement } from '@/utils'
import { GoToDemoButton } from '@/components'
import { LoadingSpinner } from '@/components/icons'
import { demoAddresses } from '@/data/blockchains/ethereum'

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: '/login' })
  const router = useRouter()

  const [loading, setLoading] = React.useState(false)
=======
import * as React from "react";
import type { NextPage } from "next";
import { useUser } from "@/hooks";
import PlaidLink from "@/components/PlaidLink";

const Home: NextPage = () => {
  const { user } = useUser({ redirectTo: "/login" });
>>>>>>> 2f45864 (wip)

  const goToDemo = React.useCallback(() => {
    setLoading(true)
    router
      .push(
        {
          pathname: '/dashboard',
          query: { address: randomArrayElement(demoAddresses) },
        },
        '/dashboard'
      )
      .then(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) return <>Loading . . .</>
  return (
<<<<<<< HEAD
    <main className="mt-12 max-w-xl">
      <GoToDemoButton text={'DASHBOARD DEMO ?'} />

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
=======
    <main className="max-w-xl">
      <p className="font-bold">Hello</p>
      <pre className="">{JSON.stringify(user, null, 2)}</pre>
      <PlaidLink />
      <button className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <a href="/api/auth/logout">Logout</a>
      </button>
>>>>>>> 2f45864 (wip)
    </main>
  )
}

export default Home
