import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { utils } from "ethers";
import { generateNonce } from "siwe";

// return the user if exists to prevent extra queries
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

  try {
    const { address: parsedAddress } = req.body;
    const address = utils.getAddress(parsedAddress as string);

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "address is required" });
    }

    const exists = await isExistingUser(address);

    const user = exists
      ? await prisma.user.update({
          where: { publicAddress: address },
          data: { lastLogin: new Date().toISOString() },
        })
      : await prisma.user.create({
          data: {
            publicAddress: address,
            nonce: generateNonce(),
            lastLogin: new Date().toISOString(),
          },
        });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(`Encountered an error in web3-login: `, error);
    res.status(500).end({
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
}
