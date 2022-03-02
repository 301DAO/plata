import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

const TOKEN_NAME = process.env.TOKEN_NAME

export default async function signOut(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
<<<<<<< HEAD
    return response.status(405).json({ success: false, message: 'GETa request is required' })
=======
    return response.status(405).json({ success: false, message: 'GET request is required' });
>>>>>>> 2f45864 (wip)
  }
  const parsedCookie = request.cookies[TOKEN_NAME]

  try {
    response.setHeader('Set-Cookie', serialize(TOKEN_NAME, '', { maxAge: -1, path: '/' }))
  } catch (error) {
    console.error(`Encountered an error in logout: `, parsedCookie, error)
  } finally {
    response.writeHead(302, { Location: '/' })
    response.end()
    return
  }
}
