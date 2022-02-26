export interface CovalentRequest {
  relativePath: string;
  chain?: Chain;
  format?: 'JSON' | 'CSV';
  params?: any;
  quoteCurrency?: QuoteCurrency;
}

interface CovalentBaseResponse {
  error: boolean;
  error_message: string | null;
  error_code: number | null;
}

// covalentTokenBalances()
export interface AddressTokenBalancesRequest {
  address: string;
  includeNft: boolean;
  includeNftMetadata: boolean;
  quoteCurrency?: QuoteCurrency;
  chain?: Chain;
}

export interface AddressTokenBalancesResponse extends CovalentBaseResponse {
  data?: {
    address: string;
    updated_at: Date;
    next_update_at: Date;
    quote_currency: QuoteCurrency;
    chain_id: number;
    items: Item[];
    pagination: null;
  };
}

type Type = 'cryptocurrency' | 'dust';

// NftMarketGlobalView()
export interface NftMarketGlobalViewRequest {
  dateRange?: DateRange;
  pageNumber?: number;
  pageSize?: number;
}

type DateRange = {
  from: string;
  to: string;
};

export interface NftMarketGlobalViewResponse extends CovalentBaseResponse {
  data: {
    address: string;
    updated_at: Date;
    next_update_at: Date;
    quote_currency: QuoteCurrency;
    chain_id: number;
    items: Item[];
    pagination: null;
  };
}

// getPortfolioValue()
export interface PortfolioValueRequest {
  address: string;
  quoteCurrency?: QuoteCurrency;
  chain?: Chain;
}

export interface PortfolioValueResponse extends CovalentBaseResponse {
  data: {
    address: string;
    updated_at: Date;
    next_update_at: Date;
    quote_currency: QuoteCurrency;
    chain_id: number;
    items: PortfolioItem[];
    pagination: null;
  };
}

export interface PortfolioItem {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: null;
  logo_url: string;
  holdings: Holding[];
}

interface Holding {
  timestamp: string;
  quote_rate: number;
  open: Close;
  high: Close;
  low: Close;
  close: Close;
}

interface Close {
  balance: string;
  quote: number;
}

// SHARED
type Item = {
  contract_decimals: number;
  contract_name: null | string;
  contract_ticker_symbol: null | string;
  contract_address: string;
  supports_erc: string[];
  logo_url: string;
  last_transferred_at: Date | null;
  type: Type;
  balance: string;
  balance_24h: null;
  quote_rate: number | null;
  quote_rate_24h: number | null;
  quote: number;
  quote_24h: null;
  nft_data: null;
};

type Chain = 'ETHEREUM' | 'SOLANA';

type QuoteCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CNY'
  | 'JPY'
  | 'KRW'
  | 'BTC'
  | 'ETH'
  | 'LTC'
  | 'SOL'
  | 'LUNA'
  | 'USDC'
  | 'UST'
  | 'USDT'
  | 'DAI';
