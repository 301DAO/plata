import axios from 'axios';
import {
  AlchemyRequest,
  TokenBalancesRequest,
  TokenBalancesResponse,
  TokenMetadataResponse,
  TokenAllowanceRequest,
  TokenAllowanceResponse,
  GetNFTsRequest,
  GetNFTsResponse,
} from './types/alchemy.types';

const KEY = process.env.ALCHEMY_KEY;
const URL = `https://eth-mainnet.alchemyapi.io/v2/${KEY}`;

/**
 * Docs: https://docs.alchemy.com
 */
async function alchemyRequest<T>({ id = 0, method, params }: AlchemyRequest) {
  try {
    const response = await axios.post<Promise<T>>(URL, {
      jsonrpc: '2.0',
      id,
      method,
      params,
    });
    return response.data;
  } catch (error) {
    // TODO: logging
    console.log(
      `Alchemy request failed:`,
      `Request payload: `,
      JSON.stringify(
        {
          jsonrpc: '2.0',
          id,
          method,
          params,
        },
        null,
        2
      ),
      error instanceof Error ? error.message : error
    );
  }
  return null;
}

/**
 * Docs: https://docs.alchemy.com/alchemy/enhanced-apis/token-api#alchemy_gettokenbalances
 * @param tokens takes 'DEFAULT_TOKENS' by default, or an array of token contract addresses.
 *
 * We have a JSON file containing Ethereum token addresses/details in src/data/blockchains/...
 * Example:
 * ```ts
 * alchemyTokenBalances({
 * address: '0x0F4ee9631f4be0a63756515141281A3E2B293Bbe',
 * }).then(_ => console.log(JSON.stringify(_, null, 2)));
 * ```
 */
export async function alchemyTokenBalances({
  address,
  tokens = 'DEFAULT_TOKENS',
}: TokenBalancesRequest): Promise<TokenBalancesResponse> {
  const data = await alchemyRequest<TokenBalancesResponse>({
    method: 'alchemy_getTokenBalances',
    params: [address, tokens],
  });

  if (!data) {
    throw new Error('Error while fetching alchemy token balances');
  }
  return data;
}

/**
 * Docs: https://docs.alchemy.com/alchemy/enhanced-apis/token-api#alchemy_gettokenmetadata
 * @param address is the token contract address.
 * Example:
 * ```ts
 * alchemyTokenMetadata('0xa47c8bf37f92aBed4A126BDA807A7b7498661acD').then(console.log);
 * ```
 */
export async function alchemyTokenMetadata(address: string): Promise<TokenMetadataResponse> {
  const data = await alchemyRequest<TokenMetadataResponse>({
    method: 'alchemy_getTokenMetadata',
    params: [address],
  });
  if (!data) {
    throw new Error('Error while fetching alchemy token metadata');
  }
  return data;
}

/**
 * Docs: https://docs.alchemy.com/alchemy/enhanced-apis/token-api#alchemy_gettokenallowance
 *
 * Example:
 * ```ts
 * alchemyTokenAllowance({
 *  contract: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
 *  owner: '0xe8095A54C83b069316521835408736269bfb389C',
 *  spender: '0x3Bcc5bD4abBc853395eBE5103b7DbA20411E38db',
 * }).then(console.log);
 * ```
 */
export async function alchemyTokenAllowance({
  contract,
  owner,
  spender,
}: TokenAllowanceRequest): Promise<TokenAllowanceResponse> {
  const params = [{ contract, owner, spender }];
  const data = await alchemyRequest<TokenAllowanceResponse>({
    method: 'alchemy_getTokenAllowance',
    params,
  });
  if (!data) {
    throw new Error('Error while fetching alchemy token allowance');
  }
  return data;
}

export async function alchemyGetNFTs({
  owner,
  withMetadata = false,
}: GetNFTsRequest): Promise<GetNFTsResponse | null> {
  const params = new URLSearchParams({
    owner,
    withMetadata: `${withMetadata}`,
  });
  const url = `${URL}/alchemyGetNFTs?` + params.toString();
  try {
    const response = await axios.get<GetNFTsResponse>(url);
    if (!response.data) {
      throw new Error('failed to fetch /getNfts');
    }
    return response.data;
  } catch (error) {
    console.log(
      `Error from covalent.ts, alchemyGetNFTs():`,
      error instanceof Error ? error.message : error
    );
  }
  return null;
}
