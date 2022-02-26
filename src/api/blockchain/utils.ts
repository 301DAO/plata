import { utils } from 'ethers';

import tokenlist from '@/data/blockchains/ethereum/tokenlist.json';

import type { CoinBalance, Coin, Balance } from './utils.types';
import type { PortfolioItem } from './covalent.types';
import type { Token } from '@/data/blockchains/ethereum/tokenlist.types';
import { ethereumSpamList } from '@/data/blockchains/ethereum';

const getAllCoinsSymbols = (coins: Token[]) => {
  return tokenlist.tokens.map(token => token.symbol);
};

export const getTokenDetailsByContract = (contract: string) => {
  return tokenlist.tokens.find(t => t.address.toLowerCase() === contract.toLowerCase());
};

const shapeDatum = (datum: PortfolioItem): Coin => {
  let parsed = [];
  for (let item of datum.holdings) {
    parsed.push({ date: item.timestamp, close: item.high.quote });
  }
  let [token, usd] = [datum.holdings[0].close.balance, datum.holdings[0].close.quote];

  let formattedTokenBalance = utils.formatUnits(token, datum.contract_decimals);
  let formattedUsdBalance = usd > 0 ? parseFloat(usd.toFixed(2)) : 0;
  const balance: CoinBalance = {
    usd: formattedUsdBalance,
    current: parseFloat(parseFloat(formattedTokenBalance).toFixed(2)),
    historical: parsed,
  };
  return {
    name: datum.contract_name,
    symbol: datum.contract_ticker_symbol,
    address: datum.contract_address,
    url: datum.logo_url,
    balance,
  };
};

export const shapeData = (data: PortfolioItem[]): Coin[] => {
  const scamToken = (datum: PortfolioItem) =>
    ethereumSpamList.indexOf(datum.contract_ticker_symbol) == -1;

  const badItem = (datum: PortfolioItem) => datum.holdings[0].open.balance !== '0';

  return data.filter(scamToken).map(shapeDatum).filter(Boolean);
};

export const getBalanceOverTime = (data: Coin[]): Balance => {
  const getAllDates = (datum: Coin) => datum.balance.historical.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).
    map(item => item.date);
  let dates = getAllDates(data[0]);
  let historical = [];
  for (let date of dates) {
    let balance = 0;
    for (let datum of data) {
      let close = datum.balance.historical.find(item => item.date === date);
      if (close) {
        balance += close.close;
      }
    }
    historical.push({ date, close: parseFloat(balance.toFixed(2)) });
  }
  let balance = historical[0].close; // balance of the most recent day = balance
  return { historical, balance };
};