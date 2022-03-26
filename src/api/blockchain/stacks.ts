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

async function stacksRequest<T>({ relativePath, params = {}, method = 'GET' }: StacksRequest) {
  const path = method === 'GET' ? `extended/v1/${relativePath}` : `${relativePath}`
  const url = `${ENDPOINT}/${path}`
  // JSON.parse(JSON.stringify(params)) to remove undefineds
  const queryParams = JSON.parse(JSON.stringify(params))
  try {
    const response = await axios.request<Promise<T>>({
      method,
      url,
      params: queryParams,
    })
    return response
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      console.trace(`Error in stacksRequest:`, error instanceof Error ? error.message : error)
      return { status: 400, data: { error: 'Error in stacksRequest' } }
    }
    const { response }: AxiosError = error
    if (!response) throw console.error(error)
    const { status, data } = response
    return { status, data }
  }
}

export async function stacksGetAccountBalances({
  address,
  until_block,
  unanchored,
}: StacksGetAccountBalancesRequest): Promise<StacksGetAccountBalancesResponse> {
  const relativePath = `address/${address}/balances`
  const params = { until_block, unanchored }
  const { data } = await stacksRequest<StacksGetAccountBalancesResponse>({
    relativePath,
    params,
  })
  return data
}

export async function stacksGetAccountSTXBalance({
  address,
  until_block,
  unanchored,
}: StacksGetAccountSTXBalanceRequest): Promise<StacksGetAccountSTXBalanceResponse> {
  const relativePath = `address/${address}/stx`
  const params = { until_block, unanchored }
  const { data } = await stacksRequest<StacksGetAccountSTXBalanceResponse>({
    relativePath,
    params,
  })
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
  const { data } = await stacksRequest<StacksGetAccountTxsResponse>({
    relativePath,
    params,
  })
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
  const { data } = await stacksRequest<StacksGetTokenMetadataListResponse>({
    relativePath,
    params: { limit, offset },
  })
  return data
}

export async function stacksGetTokenMetadata(contractId: string): Promise<TokenMetadata> {
  const relativePath = `tokens/${contractId}/ft/metadata`
  const { data } = await stacksRequest<TokenMetadata>({ relativePath })
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
  const params = {
    principal,
    asset_identifier,
    limit,
    offset,
    unanchored,
    tx_metadata,
  }
  const { data } = await stacksRequest<StacksNFTHoldingsResponse>({
    relativePath,
    params,
  })
  return data
}

export async function stacksSearch(id: string): Promise<StacksSearchResponse> {
  const relativePath = `search/${id}`
  try {
    const { data } = await stacksRequest<StacksSearchResponse>({ relativePath })
    return data
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      console.error(`stacksSearch error: `, error instanceof Error ? error.message : error)
      return Promise.reject(error)
    }
    const axiosError: AxiosError = error
    if (axiosError?.response?.status === 404) {
      return axiosError.response.data
    }
    return axiosError as any
  }
}