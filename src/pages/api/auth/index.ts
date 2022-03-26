import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticate, generateAccessCookie, setTokenCookie } from '@/lib'
import { User } from '@prisma/client'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { authenticated, message, verifiedPayload } = await authenticate(req)

    if (authenticated) {
      const token = generateAccessCookie(verifiedPayload as User)
      setTokenCookie(res, token)

      return res.status(200).json({
        authenticated,
        message: null,
        user: verifiedPayload,
      })
    }

    return res.status(401).json({ authenticated, message, user: null })
  } catch (error) {
    console.error('An unexpected error happened occurred:', error)

    res.status(500).send({
      authenticated: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      user: null,
    })
  }
}
