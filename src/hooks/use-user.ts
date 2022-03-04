import * as React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { User } from '@prisma/client'
import { useIsMounted } from './use-is-mounted'
import axios from 'axios'

type AuthResponse = {
  authenticated: boolean
  message: string
  user: User | null
}

const fetchUser = async (): Promise<AuthResponse> => {
  try {
    const { data, status, statusText } = await axios.post('/api/auth')
    return data
  } catch (error) {
    console.log(`fetchUser: `, error instanceof Error ? error.message : error)

    if (axios.isAxiosError(error)) {
      // TODO: add custom logging
      return (
        error.response?.data ?? {
          authenticated: false,
          message: '',
          user: null,
        }
      )
    }
  }
  return { authenticated: false, message: '', user: null }
}

interface userHookRedirects {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useUser({ redirectTo, redirectIfFound }: userHookRedirects = {}) {
  const isMounted = useIsMounted()
  const router = useRouter()
  const {
    data,
    error,
    isFetched,
    refetch,
    status,
    isLoading,
    isFetching,
    isRefetching,
    isIdle,
    isError,
  } = useQuery(['user'], fetchUser, {
    retry: 0,
    enabled: isMounted,
  })

  const authenticated = data?.authenticated ?? false
  const user = data?.user ?? null
  const hasUser = Boolean(user)

  React.useEffect(() => {
    if (!redirectTo || !isFetched) return
    if (redirectIfFound && hasUser) router.push(redirectTo)
    if (redirectTo && !redirectIfFound && !hasUser) router.push(redirectTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectTo, redirectIfFound, hasUser, isFetched])

  return { authenticated, user, error, refetch }
}
