import * as React from 'react'
import axios, { AxiosError } from 'axios'
import { User } from '@prisma/client'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

type AuthResponse = {
  authenticated: boolean
  message: string
  user: User | null
}

const fetchUser = async (): Promise<AuthResponse> => {
  let initResponse = { authenticated: false, message: '', user: null }
  try {
    const { data, status } = await axios.post<Promise<AuthResponse>>('/api/auth')
    if (status !== 200) return Promise.reject(data)
    return data
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      console.trace(`Error in fetchUser:`, error instanceof Error ? error.message : error)
      return initResponse
    }
    const axiosError: AxiosError = error
    if (axiosError.response?.status === 404) {
      return axiosError.response.data
    }
  }
  return initResponse
}

interface userHookRedirects {
  redirectTo?: string
  redirectIfFound?: boolean
}

export function useUser({ redirectTo, redirectIfFound }: userHookRedirects = {}) {
  const router = useRouter()
  const { data, error, refetch } = useQuery(['user'], fetchUser, { retry: 0 })

  const authenticated = data?.authenticated ?? false
  const user = data?.user
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  React.useEffect(() => {
    if (!redirectTo || !finished) return
    if ((redirectTo && !redirectIfFound && !hasUser) || (redirectIfFound && hasUser))
      router.push(redirectTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectTo, redirectIfFound, hasUser, finished])

  return { authenticated, user, error, refetch }
}
