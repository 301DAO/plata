export interface AlchemyRequest {
  id?: number;
  method: 'alchemy_getTokenBalances' | string;
  params: string | string[] | any[];
}

type AlchemyError = {
  code: number;
  message: string;
};

interface AlchemyBaseResponse {
  jsonrpc: '2.0';
  id: number;
  error?: AlchemyError;
}

// alchemyTokenBalances()
export interface TokenBalancesRequest {
  address: string;
  tokens?: 'DEFAULT_TOKENS' | string[];
}

export interface TokenBalancesResponse extends AlchemyBaseResponse {
  result?: {
    address: string;
    tokenBalances: TokenBalance[];
  };
}

type TokenBalance = {
  contractAddress: string;
  tokenBalance: string;
  error: string | null;
};

// tokenMetadata()
export interface TokenMetadataRequest {}

export interface TokenMetadataResponse extends AlchemyBaseResponse {
  result: {
    decimals: number;
    logo: string;
    name: string;
    symbol: string;
  };
}

// tokenAllowance()
export interface TokenAllowanceRequest {
  contract: string;
  owner: string;
  spender: string;
}

export interface TokenAllowanceResponse extends AlchemyBaseResponse {
  result?: string;
}
