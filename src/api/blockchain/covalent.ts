import axios from 'axios'
import { base64Encode } from '@/utils'
import type {
  CovalentRequest,
  AddressTokenBalancesRequest,
  AddressTokenBalancesResponse,
  NftMarketGlobalViewRequest,
  NftMarketGlobalViewResponse,
  PortfolioValueRequest,
  PortfolioValueResponse,
} from './covalent.types'

const KEY = process.env.COVALENT_KEY
const URL = 'https://api.covalenthq.com/v1'

// This is straight from covalent's docs
const CHAINS = { ETHEREUM: 1, SOLANA: 1399811149 }

/**
 * * Docs: https://www.covalenthq.com/docs/api/#/0/0/USD/1
 */
async function covalentRequest<T>({
  relativePath,
  params,
  chain = 'ETHEREUM',
  format = 'JSON',
  quoteCurrency = 'USD',
}: CovalentRequest) {
  const queryParams = new URLSearchParams({ 'quote-currency': quoteCurrency, format, ...params })

  const url = `${URL}/${CHAINS[chain]}/${relativePath}/?` + queryParams.toString()

  try {
    const response = await axios.get<Promise<T>>(url, {
      headers: { Authorization: `Basic ${base64Encode(KEY)}` },
    })
    return response.data
  } catch (error) {
    //TODO: logging
    console.log(`covalentRequest failed: `, error instanceof Error ? error.message : error)
  }
  return null
}

/**
 * * Docs: https://www.covalenthq.com/docs/api/#/0/Get%20token%20balances%20for%20address/USD/1
 * @param address ethereum, ENS name, or solana address.
 *
 * - NOTE: using ENS name slows down the request by a lot
 * @param chain 'ETHEREUM' or 'SOLANA, default is 'ETHEREUM'
 *
 * ```ts
 * covalentTokenBalances({
 *    address: 'brantly.eth',
 *    includeNft: true,
 *    includeNftMetadata: true,
 * }).then(_ => console.log(JSON.stringify(_, null, 2)));
 * ```
 */
export async function covalentTokenBalances({
  address,
  includeNft,
  includeNftMetadata,
  chain = 'ETHEREUM',
}: AddressTokenBalancesRequest): Promise<AddressTokenBalancesResponse> {
  const queryParams = {
    nft: includeNft.toString(),
    'no-nft-fetch': (!includeNftMetadata).toString(), // inverted
  }

  const relativePath = `address/${address}/balances_v2`
  const data = await covalentRequest<AddressTokenBalancesResponse>({
    relativePath,
    params: queryParams,
    chain,
  })

  if (!data) {
    throw new Error('Error while fetching covalent token balances')
  }
  return data
}

/**
 ** Docs: https://www.covalenthq.com/docs/api/#/0/Get%20token%20balances%20for%20address/USD/1
 *
 * * All params are optional
 * if @params from and to must both be included or both be omitted
 * @param dateRange
 *      - from The start day of the historical market data. (YYYY-MM-DD)
 *
 *      - to The start day of the historical market data. (YYYY-MM-DD)
 * @param pageNumber The specific page to be returned.
 * @param pageSize The number of items to be returned per page.
 *
 * * Example:
 * ```ts
 • nftMarketGlobalView({
 *   pageNumber: 0,
 *   pageSize: 2,
 * }).then(console.log);
 * ```
 */
export async function covalentNftMarketGlobalView({
  dateRange,
  pageNumber,
  pageSize,
}: NftMarketGlobalViewRequest = {}): Promise<NftMarketGlobalViewResponse> {
  const queryParams = {
    from: dateRange?.from,
    to: dateRange?.to,
    'page-number': pageNumber,
    'page-size': pageSize,
  }

  const relativePath = `nft_market`
  const data = await covalentRequest<NftMarketGlobalViewResponse>({
    relativePath,
    // parse then stringify to remove undefined values
    params: JSON.parse(JSON.stringify(queryParams)),
  })
  if (!data) {
    throw new Error('Error while fetching covalent nft market global view')
  }
  return data
}

/**
 **https://www.covalenthq.com/docs/api/#/0/Get%20historical%20portfolio%20value%20over%20time/USD/1
 * * Example:
 * ```ts
 * getPortfolioValue({ address: '0x0F4ee9631f4be0a63756515141281A3E2B293Bbe' }).then(console.log);
 * ```
 */

export async function getPortfolioValue({
  address,
  chain = 'ETHEREUM',
}: PortfolioValueRequest): Promise<PortfolioValueResponse> {
  const relativePath = `address/${address}/portfolio_v2`
  const data = await covalentRequest<PortfolioValueResponse>({ relativePath, chain })
  if (!data) {
    throw new Error('Error while fetching covalent portfolio value')
  }
  return data
}
