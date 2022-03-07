import axios from 'axios'

const URL = 'https://api.opensea.io/api/v1'
//https://api.opensea.io/api/v1/collection/doodles-official/stats

async function openSeaRequest<T>(relativePath: string) {
  const url = `${URL}/${relativePath}`
  try {
    const response = await axios.get<Promise<T>>(url)
    return response.data
  } catch (error) {
    console.log(`Error while fetching ${url}:`, error instanceof Error ? error.message : error)
  }
  return null
}

export async function collectionStats(collection: string): Promise<CollectionStatsResponse> {
  const relativePath = `collection/${collection}/stats`
  const data = await openSeaRequest<CollectionStatsResponse>(relativePath)
  if (!data) {
    throw new Error('Error while fetching collection stats')
  }
  return data
}

collectionStats('degentoonz-collection').then(console.log)

interface CollectionStatsResponse {
  stats: Stats
}

type Stats = {
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
