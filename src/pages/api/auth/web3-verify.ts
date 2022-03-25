import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { utils } from 'ethers';
import { generateAccessCookie, setTokenCookie } from '@/lib';
import { SiweMessage, generateNonce } from 'siwe';

export default async function web3Verify(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(401).json({ success: false, message: 'Not allowed' });
  }

  try {
    const { address, signature, message } = req.body;
    if (!address || !signature || !message) {
      return res.status(401).json({
        success: false,
        message: 'address, signature, and message are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { publicAddress: utils.getAddress(address) },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `user with address: ${address} doesn't exist`,
      });
    }
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.validate(signature);
    const verified = !!fields;

    if (!verified) {
      return res.status(401).json({ success: false, message: 'signature is not valid' });
    }

    // if verified, update nonce, create tokens, and send tokens
    const updateNonce = await prisma.user.update({
      where: { id: user.id },
      data: { nonce: generateNonce(), lastLogin: new Date().toISOString() },
    });

    const accessToken = generateAccessCookie(updateNonce);
    await setTokenCookie(res, accessToken);

    return res.status(200).json({
      success: true,
      message: 'successfully verified',
      user: updateNonce,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    });
  }
}
