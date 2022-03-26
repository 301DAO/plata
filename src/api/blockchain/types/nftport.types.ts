export interface NftportAddressNFTsRequest {
  chain?: string
  address: string
  continuation?: string
  page_size?: number
  include?: string
}

export interface NftportAddressNFTsResponse {
  continuation: string
  nfts: NFT[]
  response: string
  total: number | null
}

export interface NftportNFTDetailsRequest {
  contract: string
  tokenId: string
  chain?: string
}

export interface NftportNFTDetailsResponse {
  response: string
  nft: NFT
  contract: Contract
}

export interface NftportCollectionStatsRequest {
  contract: string
  chain?: string
}

export interface NftportCollectionStatsResponse {
  response: string
  statistics: Statistics
}

type Statistics = {
  one_day_volume: number
  one_day_change: number
  one_day_sales: number
  one_day_average_price: number
  seven_day_volume: number
  seven_day_change: number
  seven_day_sales: number
  seven_day_average_price: number
  thirty_day_volume: number
  thirty_day_change: number
  thirty_day_sales: number
  thirty_day_average_price: number
  total_volume: number
  total_sales: number
  total_supply: number
  total_minted: number
  num_owners: number
  average_price: number
  market_cap: number
  floor_price: number
}

export interface NFT {
  chain: string
  contract_address: string
  token_id: string
  name: string
  description: string
  creator_address: string
  metadata_url: string
  metadata: Metadata
  file_information: FileInformation
  file_url: string
  cached_file_url: string
  mint_date: string
  updated_date: string
}
interface Metadata {
  attributes?: AttributesEntity[] | null
  image: string
}
interface AttributesEntity {
  trait_type: string
  value: string
}
interface FileInformation {
  height: number
  width: number
  file_size: number
}
interface Contract {
  name: string
  symbol: string
  type: string
}
