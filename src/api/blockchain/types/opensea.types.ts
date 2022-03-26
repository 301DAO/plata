export interface OpenseaAddressCollectionsRequest {
  asset_owner: string
  offset?: string
  limit?: string
}

export type OpenseaAddressCollection = {
  primary_asset_contracts: PrimaryAssetContract[]
  traits: Traits
  stats: Stats
  banner_image_url: string
  chat_url: any
  created_date: string
  default_to_fiat: boolean
  description: string
  dev_buyer_fee_basis_points: string
  dev_seller_fee_basis_points: string
  discord_url: string
  display_data: DisplayData
  external_url: string
  featured: boolean
  featured_image_url: string
  hidden: boolean
  safelist_request_status: string
  image_url: string
  is_subject_to_whitelist: boolean
  large_image_url: string
  medium_username: any
  name: string
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: string
  opensea_seller_fee_basis_points: string
  payout_address: string
  require_email: boolean
  short_description: any
  slug: string
  telegram_url: any
  twitter_username: any
  instagram_username: string
  wiki_url: any
  is_nsfw: boolean
  owned_asset_count: number
}

interface PrimaryAssetContract {
  address: string
  asset_contract_type: string
  created_date: string
  name: string
  nft_version: string
  opensea_version: any
  owner: number
  schema_name: string
  symbol: string
  total_supply: string
  description: string
  external_link: string
  image_url: string
  default_to_fiat: boolean
  dev_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  only_proxied_transfers: boolean
  opensea_buyer_fee_basis_points: number
  opensea_seller_fee_basis_points: number
  buyer_fee_basis_points: number
  seller_fee_basis_points: number
  payout_address: string
}

interface Traits {}

interface DisplayData {
  card_display_style: string
}

export type Stats = {
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
  count: number
  num_owners: number
  average_price: number
  num_reports: number
  market_cap: number
  floor_price: number
}
