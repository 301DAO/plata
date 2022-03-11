import axios from 'axios'

import {
  NftportNFTDetailsRequest,
  NftportNFTDetailsResponse,
  NftportAddressNFTsRequest,
  NftportAddressNFTsResponse,
  NftportCollectionStatsRequest,
  NftportCollectionStatsResponse,
} from './types/nftport.types'

// Docs: https://docs.nftport.xyz/docs
const API_KEY = process.env.NEXT_PUBLIC_NFT_PORT_KEY
const NFT_PORT_ENDPOINT = 'https://api.nftport.xyz/v0'

interface NftportRequest {
  relativePath: string
  params?: any
}

async function NftPortRequest<T>({ relativePath, params }: NftportRequest) {
  try {
    const queryParams = new URLSearchParams({ ...params })
    const url = `${NFT_PORT_ENDPOINT}/${relativePath}/?` + queryParams.toString()
    const response = await axios.get<Promise<T>>(url, { headers: { Authorization: `${API_KEY}` } })
    return response.data
  } catch (error) {
    console.error(`Error in NftPortRequest: `, error instanceof Error ? error.message : error)
  }
  return null
}

/**
 * Returns details for a given NFT. These include metadata_url, metadata such as name, description, attributes, etc., image_url, cached_image_url and mint_date.
 */
export async function nftportNFTDetails({
  tokenId,
  contract,
  chain,
}: NftportNFTDetailsRequest): Promise<NftportNFTDetailsResponse> {
  const relativePath = `nfts/${contract}/${tokenId}`
  const data = await NftPortRequest<NftportNFTDetailsResponse>({
    relativePath,
    params: { chain },
  })

  if (!data) {
    //TODO: logging
    console.error(`retrNftportAddressNFTsResponseieveNftDetails failed: `, data)
    throw new Error('retrieveNftDetails failed')
  }
  return data
}

/**
 * Returns NFTs owned by a given account (i.e. wallet) address. Can also return each NFT metadata with 'include' parameter.
 */
export async function nftportAddressNFTs({
  address,
  continuation,
  page_size = 12,
  chain = 'ethereum',
  include = 'metadata',
}: NftportAddressNFTsRequest): Promise<NftportAddressNFTsResponse> {
  const queryParams = { chain, include, page_size, continuation }
  const relativePath = `accounts/${address}`

  const data = await NftPortRequest<NftportAddressNFTsResponse>({
    relativePath,
    params: JSON.parse(JSON.stringify(queryParams)), // to remove undefined fields
  })

  if (!data) {
    console.error(`retrieveNftDetails failed: `, data)
    throw new Error('retrieveNftDetails failed')
  }
  return data
}

export async function nftportCollectionStats({
  contract,
  chain = 'ethereum',
}: NftportCollectionStatsRequest): Promise<NftportCollectionStatsResponse> {
  const relativePath = `transactions/stats/${contract}`
  const data = await NftPortRequest<NftportCollectionStatsResponse>({
    relativePath,
    params: { chain },
  })
  if (!data) {
    console.error(`nftportCollectionStats failed: `, data)
    throw new Error('nftportCollectionStats failed')
  }
  return data
}
