import axios from 'axios';

type Chain = 'ethereum' | 'solana' | 'terra' | 'cosmos' | 'thorchain' | 'avalanche' | 'cardano';

const COINGECKO = `https://api.coingecko.com/api/v3`;

type CoingeckoRequest = {
  relativePath: string;
  params: { [key: string]: any };
};

async function coingeckoRequest<T>({ relativePath, params }: CoingeckoRequest) {
  const queryParams = new URLSearchParams(params);
  const url = `${COINGECKO}/${relativePath}?` + queryParams.toString();

  try {
    const response = await axios.get<Promise<T>>(url);
    return response.data;
  } catch (error) {
    console.log(
      `coingeckoRequest failed on Error:`,
      error instanceof Error ? error.message : error
    );
  }
}

type CoingeckoSimpleBase = {
  vs?: string[];
  include_market_cap?: boolean;
  include_24hr_vol?: boolean;
  include_24hr_change?: boolean;
  include_last_updated_at?: boolean;
};

interface CoingeckoPriceByContractRequest extends CoingeckoSimpleBase {
  contractAddresses: string | string[];
  chain?: Chain;
}

interface CoingeckoPriceByContractResponse {
  [contract: string]: {
    usd: number;
    usd_market_cap?: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    last_updated_at?: string;
  };
}

export async function coingeckoPriceByContract({
  chain = 'ethereum',
  contractAddresses,
  vs = ['usd'],
  include_market_cap = true,
  include_24hr_vol = false,
  include_24hr_change = true,
  include_last_updated_at = false,
}: CoingeckoPriceByContractRequest): Promise<CoingeckoPriceByContractResponse> {
  const relativePath = `simple/token_price/${chain}`;
  const params = {
    contract_addresses:
      typeof contractAddresses === 'string' ? contractAddresses : contractAddresses.join(','),
    vs_currencies: vs,
    include_market_cap,
    include_24hr_vol,
    include_24hr_change,
    include_last_updated_at,
  };
  const data = await coingeckoRequest<CoingeckoPriceByContractResponse>({
    relativePath,
    params,
  });
  if (!data) {
    throw new Error('Error while fetching coingecko price');
  }
  return data;
}

interface CoingeckoRatesRequest extends CoingeckoSimpleBase {
  ids?: string[] | string;
}

type CoingeckoRate = {
  usd: number;
  usd_24h_change?: number;
  last_updated_at?: number;
};

type CoingeckoRatesResponse = { [key: string]: CoingeckoRate };

export async function coingeckoRatesByIDs({
  ids,
  vs = ['usd'],
  include_market_cap = true,
  include_24hr_vol = false,
  include_24hr_change = true,
  include_last_updated_at = false,
}: CoingeckoRatesRequest): Promise<CoingeckoRatesResponse> {
  const params = {
    ids: typeof ids === 'string' ? ids : ids?.join(','),
    vs_currencies: typeof vs === 'string' ? vs : vs.join(','),
    include_market_cap: include_market_cap.toString(),
    include_24hr_vol: include_24hr_vol.toString(),
    include_24hr_change: include_24hr_change.toString(),
    include_last_updated_at: include_last_updated_at.toString(),
  };
  const relativePath = `simple/price`;
  const data = await coingeckoRequest<CoingeckoRatesResponse>({
    relativePath,
    params: JSON.parse(JSON.stringify(params)),
  });
  if (!data) {
    throw new Error('Error while fetching covalent token balances');
  }
  return data;
}

const COINBASE = 'https://api.coinbase.com/v2/exchange-rates';

type CoinbaseRatesResponse = {
  data: {
    currency: string;
    rates: { [key: string]: number };
  };
};

/**
 * Docs: https://developers.coinbase.com/api/v2#get-currencies
 * Get the exchange rates for all supported currencies against a given token.`
 */
export async function getCoinbaseRates(token: string): Promise<CoinbaseRatesResponse | null> {
  try {
    const response = await axios.get(`${COINBASE}?currency=${token}`);
    if (!response.data) {
      throw new Error('Error while fetching coinbase rates');
    }
    return response.data;
  } catch (error) {
    console.log(`getCoinbaseRates failed: `, error instanceof Error ? error.message : error);
  }
  return null;
}
