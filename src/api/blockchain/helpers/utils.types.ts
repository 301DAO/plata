export type TokenBalance = {
  contractAddress: string
  name: string
  symbol: string
  nativeBalance: string | number
  usdBalance: number
}


export type Datum = {
  date: string
  close: number
}

export type Coin = {
  name: string
  symbol: string
  address: string
  url: string
  balance: CoinBalance
}

export type CoinBalance = {
  current: number
  usd: number
  historical: Datum[]
}

export type Historical = { date: string; close: number }

export type Balance = {
  balance: number
  historical: Historical[]
}
