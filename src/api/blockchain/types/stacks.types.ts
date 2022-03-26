export interface StacksGetAccountBalancesRequest {
  address: string
  until_block?: number
  unanchored?: boolean
}

export interface StacksGetAccountBalancesResponse {
  stx: Stx
  fungible_tokens: FungibleTokens
  non_fungible_tokens: NonFungibleTokens
}

interface FungibleTokens {}
interface NonFungibleTokens {}

interface Stx {
  balance: string
  total_sent: string
  total_received: string
  lock_tx_id: string
  locked: string
  lock_height: number
  burnchain_lock_height: number
  burnchain_unlock_height: number
}

export type StacksGetAccountSTXBalanceRequest = StacksGetAccountBalancesRequest

export interface StacksGetAccountSTXBalanceResponse {
  balance: string
  total_sent: string
  total_received: string
  lock_tx_id: string
  locked: string
  lock_height: number
  burnchain_lock_height: number
  burnchain_unlock_height: number
}

export interface StacksGetAccountTxsRequest {
  address: string
  limit?: number
  offset?: number
  height?: number
  unanchored?: boolean
  until_block?: number
}

export interface StacksGetAccountTxsResponse {
  limit: number
  offset: number
  total: number
  results: Result[]
}

interface Result {
  tx_id: string
  tx_status: string
  tx_type: string
  fee_rate: string
  sender_address: string
  sponsored: boolean
  post_condition_mode: string
  block_hash: string
  block_height: number
  burn_block_time: number
  canonical: boolean
  is_unanchored: boolean
  microblock_hash: string
  microblock_sequence: number
  microblock_canonical: boolean
  tx_index: number
  coinbase_payload: CoinbasePayload
}

interface CoinbasePayload {
  data: string
}

export interface StacksGetTokenMetadataListRequest {
  limit?: number
  offset?: number
}

export interface StacksGetTokenMetadataListResponse {
  limit: number
  offset: number
  total: number
  results: TokenMetadata[]
}

export interface TokenMetadata {
  token_uri: string
  name: string
  description: string
  image_uri: string
  image_canonical_uri: string
  tx_id: string
  sender_address: string
  symbol: string
  decimals: number
}

export type StacksSearchResponse = SearchResponse | SearchErrorResponse

interface SearchResponse {
  found: boolean
  result: Result
}

interface SearchErrorResponse {
  found: boolean
  result: Result
  error: string
}

interface Result {
  entity_id?: string
  entity_type: string
  tx_data?: TxData
}

interface TxData {
  canonical: boolean
  block_hash: string
  burn_block_time: number
  block_height: number
  tx_type: string
}

export interface StacksNFTHoldingsRequest {
  address: string
  asset_identifier?: string
  limit?: number
  offset?: number
  unanchored?: boolean
  tx_metadata?: boolean
}

export interface StacksNFTHoldingsResponse {
  limit: number
  offset: number
  total: number
  results: Result[]
}

interface Result {
  asset_identifier: string
  value: Value
  tx_id: string
}

interface Value {
  hex: string
  repr: string
}
