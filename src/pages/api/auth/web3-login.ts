import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { utils } from "ethers";
import { generateNonce } from "siwe";

const isExistingUser = async (publicAddress: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { publicAddress: publicAddress },
  });
  return !!user;
};

export default async function web3Login(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { address: parsedAddress } = req.body;
  const address = utils.getAddress(parsedAddress as string);
  if (!address) {
    return res
      .status(400)
      .json({ success: false, message: "address is required" });
  }

  try {
    const userExists = await isExistingUser(address);

    const user = userExists
      ? await prisma.user.findUnique({
          where: { publicAddress: address },
        })
      : await prisma.user.create({
          data: {
            issuer: ``,
            publicAddress: address,
            nonce: generateNonce(),
            lastLogin: new Date().toISOString(),
          },
        });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    error instanceof Error
      ? res
          .status(500)
          .end({ success: false, message: JSON.stringify(error, null, 2) })
      : res.status(500).end({
          success: false,
          message: "Internal Server Error. No error message",
        });
  }
}
