import axios, { AxiosError } from 'axios'
import {
  TokenMetadata,
  StacksSearchResponse,
  StacksNFTHoldingsRequest,
  StacksNFTHoldingsResponse,
  StacksGetAccountTxsRequest,
  StacksGetAccountTxsResponse,
  StacksGetAccountBalancesRequest,
  StacksGetAccountBalancesResponse,
  StacksGetAccountSTXBalanceRequest,
  StacksGetAccountSTXBalanceResponse,
  StacksGetTokenMetadataListRequest,
  StacksGetTokenMetadataListResponse,
} from './types/stacks.types'

/**
 * * Docs: https://docs.hiro.so/api
 */

const URL = {
  MAINNET: 'https://stacks-node-api.mainnet.stacks.co',
  TESTNET: 'https://stacks-node-api.testnet.stacks.co',
  LOCAL: `http://localhost:${process.env.LOCALHOST_PORT}`,
}
const ENDPOINT = URL.MAINNET

interface StacksRequest {
  method?: 'GET' | 'POST'
  relativePath: string
  params?: any
}

async function stacksRequest<T>({ relativePath, params, method = 'GET' }: StacksRequest) {
  const path = method === 'GET' ? `extended/v1/${relativePath}` : `${relativePath}`
  const url = `${ENDPOINT}/${path}`
  // JSON.parse(JSON.stringify(params)) to remove undefineds
  const queryParams = JSON.parse(JSON.stringify(params))
  const response = await axios.request<Promise<T>>({ method, url, params: queryParams })
  return response
}

export async function stacksGetAccountBalances({
  address,
  until_block,
  unanchored,
}: StacksGetAccountBalancesRequest): Promise<StacksGetAccountBalancesResponse> {
  const relativePath = `address/${address}/balances`
  const params = { until_block, unanchored }
  const { data, status } = await stacksRequest<StacksGetAccountBalancesResponse>({
    relativePath,
    params,
  })
  if (status !== 200) {
  }
  return data
}

stacksGetAccountBalances({ address: 'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S' }).then(console.log)

export async function stacksGetAccountSTXBalance({
  address,
  until_block,
  unanchored,
}: StacksGetAccountSTXBalanceRequest): Promise<StacksGetAccountSTXBalanceResponse> {
  const relativePath = `address/${address}/stx`
  const params = { until_block, unanchored }
  const { data, status } = await stacksRequest<StacksGetAccountSTXBalanceResponse>({
    relativePath,
    params,
  })
  if (status !== 200) {
  }
  return data
}

export async function stacksGetAccountTxs({
  address,
  limit,
  offset,
  height,
  unanchored,
  until_block,
}: StacksGetAccountTxsRequest): Promise<StacksGetAccountTxsResponse> {
  const relativePath = `address/${address}/transactions`
  const params = { limit, offset, height, unanchored, until_block }
  const { data, status } = await stacksRequest<StacksGetAccountTxsResponse>({
    relativePath,
    params,
  })
  if (status !== 200) return Promise.reject('stacksGetAccountTxs failed')
  return data
}

/**
 * Will give you metadata of all nfts on stacks
 */
export async function stacksGetTokenMetadataList({
  limit,
  offset,
}: StacksGetTokenMetadataListRequest): Promise<StacksGetTokenMetadataListResponse> {
  const relativePath = `tokens/ft/metadata`
  const { data, status } = await stacksRequest<StacksGetTokenMetadataListResponse>({
    relativePath,
    params: { limit, offset },
  })
  if (status !== 200) return Promise.reject('stacksGetTokenMetadataList failed')
  return data
}

export async function stacksGetTokenMetadata(contractId: string): Promise<TokenMetadata> {
  const relativePath = `tokens/${contractId}/ft/metadata`
  const { data, status } = await stacksRequest<TokenMetadata>({ relativePath })
  if (status !== 200) return Promise.reject('stacksGetTokenMetadata failed')
  return data
}

// https://stacks-node-api.mainnet.stacks.co/extended/v1/tokens/nft/holdings
export async function stacksNFTHoldings({
  address: principal,
  asset_identifier,
  limit,
  offset,
  unanchored,
  tx_metadata,
}: StacksNFTHoldingsRequest): Promise<StacksNFTHoldingsResponse> {
  const relativePath = `tokens/nft/holdings`
  const params = { principal, asset_identifier, limit, offset, unanchored, tx_metadata }
  const { data, status } = await stacksRequest<StacksNFTHoldingsResponse>({
    relativePath,
    params,
  })
  if (status !== 200) return Promise.reject('stacksNFTHoldings failed')
  return data
}

export async function stacksSearch(id: string): Promise<StacksSearchResponse> {
  const relativePath = `search/${id}`
  try {
    const response = await stacksRequest<StacksSearchResponse>({ relativePath })
    return response.data
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw console.error(`stacksSearch error: `, error instanceof Error ? error.message : error)
    }
    const axiosError: AxiosError = error
    if (axiosError?.response?.status === 404) {
      return axiosError.response.data
    }
    return Promise.reject(axiosError.toJSON())
  }
}
