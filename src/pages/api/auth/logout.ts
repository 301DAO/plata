import { TOKEN_NAME } from '@/constants/cookie';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function signOut(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ success: false, message: 'GET request is required' });
  }
  const parsedCookie = request.cookies[TOKEN_NAME];

  try {
    response.setHeader('Set-Cookie', serialize(TOKEN_NAME, '', { maxAge: -1, path: '/' }));
  } catch (error) {
    console.error(`Encountered an error in logout: `, parsedCookie, error);
  } finally {
    response.writeHead(302, { Location: '/' });
    response.end();
  }
}
