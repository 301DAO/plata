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

export type Balance = {
  balance: number
  historical: {
    date: string
    close: number
  }[]
}
