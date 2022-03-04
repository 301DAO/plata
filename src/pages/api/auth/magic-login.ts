import { NextApiRequest, NextApiResponse } from 'next'
import { magic, generateAccessCookie, setTokenCookie } from '@/lib'
import { prisma } from '@/lib/prisma'

export type loginResponse = {
  success: boolean
  message?: string
}

/**
 * Validate the did token and then register the user in our db
 * if not already registered. Update lastLogin if user exists.
 * Set the session cookie.
 * @param req
 * @param res
 * @returns
 */
export default async function magicLogin(req: NextApiRequest, res: NextApiResponse<loginResponse>) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' })
    return
  }

  try {
    if (!req.headers.authorization) throw new Error('No Authorization Header')
    const didToken = magic.utils.parseAuthorizationHeader(req.headers.authorization)
    if (!didToken) throw new Error('No Authorization Token')
    magic.token.validate(didToken)

    const metadata = await magic.users.getMetadataByToken(didToken)
    if (!metadata.issuer) throw new Error('No Issuer')

    const user = await prisma.user.upsert({
      where: { issuer: metadata.issuer },
      update: { lastLogin: new Date().toISOString() },
      create: {
        issuer: metadata.issuer,
        email: metadata.email,
        lastLogin: new Date().toISOString(),
      },
    })

    const accessToken = generateAccessCookie(user)
    await setTokenCookie(res, accessToken)

    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.error(error)

    res.status(500).end({
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    })
  }
}
