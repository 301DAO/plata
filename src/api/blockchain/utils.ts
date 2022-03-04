import axios from 'axios'
import { utils } from 'ethers'

import { coingeckoPriceByContract } from './rates'
import { ethereumSpamList, ERC20TokenContracts } from '@/data/blockchains/ethereum'
import { alchemyTokenBalances, tokenMetadata } from './alchemy'
import tokenlist from '@/data/blockchains/ethereum/tokenlist.json'

import type { PortfolioItem } from './covalent.types'
import type { CoinBalance, Coin, Balance } from './utils.types'
import type { Token } from '@/data/blockchains/ethereum'
import { getPortfolioValue } from './covalent'

type TokenBalance = {
  contractAddress: string
  name: string
  symbol: string
  nativeBalance: string | number
  usdBalance: number
}

export const getTokensBalances_1 = async (address: string) => {
  const { result } = await alchemyTokenBalances({ address, tokens: ERC20TokenContracts })
  if (!result) return []

  let balances: TokenBalance[] = []
  const info = ({
    tokenBalance,
    contractAddress,
  }: {
    tokenBalance: string
    contractAddress: string
  }) => {
    if (Number(tokenBalance) === 0) return
    const metadata = getTokenDetailsByContract(contractAddress)
    if (!metadata) return
    const { decimals, name, symbol } = metadata
    const nativeBalance = !!decimals ? utils.formatUnits(tokenBalance, decimals) : 0
    const item = { contractAddress, name, symbol, nativeBalance, usdBalance: 0 }
    return balances.push(item)
  }

  result.tokenBalances.map(info)

  const contractAddresses: string[] = balances.map(({ contractAddress }) => contractAddress)
  const prices = await coingeckoPriceByContract({ contractAddresses })

  balances = balances.map(({ contractAddress, name, symbol, nativeBalance }) => {
    const { usd: rate } = prices[contractAddress.toLowerCase()]

    const usdBalance = rate ? Number(nativeBalance) * rate : 0
    return { contractAddress, name, symbol, nativeBalance, usdBalance }
  })

  return balances
}

export const getAddressBalanceOvertime_1 = async (address: string) => {
  const response = await getPortfolioValue({ address })
  const shapedData = shapeData(response.data.items)

  return getBalanceOverTime(shapedData).historical
}

export const getTokensBalances_2 = async (address: string) => {
  const response = await getPortfolioValue({ address })
  return shapeData(response.data.items)
}

const getAllCoinsSymbols = (coins: Token[]) => {
  return tokenlist.tokens.map(token => token.symbol)
}

const getTokenDetailsByContract = (contract: string): Token | undefined => {
  return tokenlist.tokens.find(t => t.address.toLowerCase() === contract.toLowerCase())
}

const shapeDatum = (datum: PortfolioItem): Coin | null => {
  let [token, usd] = [datum.holdings[0].close.balance, datum.holdings[0].close.quote]
  if (usd === 0) return null
  //console.log({ token: datum.contract_ticker_symbol, usd });
  let parsed = []
  for (let item of datum.holdings) {
    parsed.push({ date: item.timestamp, close: item.high.quote })
  }

  let formattedTokenBalance = utils.formatUnits(token, datum.contract_decimals)
  let formattedUsdBalance = usd > 0 ? parseFloat(usd.toFixed(2)) : 0
  const balance: CoinBalance = {
    usd: formattedUsdBalance,
    current: parseFloat(parseFloat(formattedTokenBalance).toFixed(2)),
    historical: parsed,
  }
  return {
    name: datum.contract_name,
    symbol: datum.contract_ticker_symbol,
    address: datum.contract_address,
    url: datum.logo_url,
    balance,
  }
}

const shapeData = (data: PortfolioItem[]): Coin[] => {
  const scamToken = (datum: PortfolioItem) =>
    ethereumSpamList.indexOf(datum.contract_ticker_symbol) == -1

  const badItem = (datum: PortfolioItem) => datum.holdings[0].open.balance !== '0'
  const filtered = data.filter(scamToken).filter(badItem)
  if (filtered.length === 0) return []
  const shaped = filtered.map(shapeDatum)
  if (shaped.length === 0) return []
  return shaped.filter(Boolean) as Coin[]
}

const getBalanceOverTime = (data: Coin[]): Balance => {
  const getAllDates = (datum: Coin) =>
    datum.balance.historical
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      .map(item => item.date)
  let dates = getAllDates(data[0])
  let historical = []
  for (let date of dates) {
    let balance = 0
    for (let datum of data) {
      let close = datum.balance.historical.find(item => item.date === date)
      if (close) {
        balance += close.close
      }
    }
    historical.push({ date, close: parseFloat(balance.toFixed(2)) })
  }
  let balance = historical[0].close // balance of the most recent day = balance
  return { historical, balance }
}
