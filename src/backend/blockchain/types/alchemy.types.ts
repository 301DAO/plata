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

// alchemyTokenMetadata()
export interface TokenMetadataRequest {}

export interface TokenMetadataResponse extends AlchemyBaseResponse {
  result: {
    decimals: number;
    logo: string;
    name: string;
    symbol: string;
  };
}

// alchemyTokenAllowance()
export interface TokenAllowanceRequest {
  contract: string;
  owner: string;
  spender: string;
}

export interface TokenAllowanceResponse extends AlchemyBaseResponse {
  result?: string;
}

export interface GetNFTsRequest {
  owner: string;
  pageKey?: string;
  contractAddresses?: string[];
  withMetadata?: boolean;
}

export interface GetNFTsResponse extends AlchemyBaseResponse {
  ownedNfts: OwnedNft[];
  totalCount: number;
  blockHash: string;
}

type Contract = { address: string };

type TokenMetadata = { tokenType: string };

type Id = { tokenId: string; alchemyTokenMetadata: TokenMetadata };

type TokenUri = { raw: string; gateway: string };

type Medium = { raw: string; gateway: string };

type Attribute = { value: string; trait_type: string };

type Metadata = {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
};

type OwnedNft = {
  contract: Contract;
  id: Id;
  balance: string;
  title: string;
  description: string;
  tokenUri: TokenUri;
  media: Medium[];
  metadata: Metadata;
  timeLastUpdated: Date;
};
