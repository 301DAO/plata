import axios from 'axios'
import type {
  BitcoinAddressesHistoryRequest,
  BitcoinAddressesHistoryResponse,
} from './types/blockchain.types'

const URL = 'https://blockchain.info'

interface BlockchainRquest {
  relativePath: string
  params?: any
}

async function blockchainRequest({ relativePath, params }: BlockchainRquest) {
  const url = `${URL}/${relativePath}`
  try {
    const response = await axios.get(`${URL}/${relativePath}`, { params })
    return response.data
  } catch (error) {
    console.error(
      `BlockchainRequest failed - url: ${url}\n`,
      error instanceof Error ? error.message : error
    )
  }
  return null
}

export async function bitcoinAddressBalance(address: string): Promise<string> {
  const relativePath = `q/addressbalance/${address}`
  const response = await blockchainRequest({ relativePath })
  return response
}

export async function bitcoinAddressesHistory({
  addresses,
  cors = true,
}: BitcoinAddressesHistoryRequest): Promise<BitcoinAddressesHistoryResponse> {
  const relativePath = `multiaddr`
  const params = { cors, active: addresses.join('&') }
  const data = await blockchainRequest({ relativePath, params })
  return data
}