export interface Tokenlist {
  name: string;
  logoURI: string;
  timestamp: Date;
  tokens: Token[];
  version: Version;
}

export interface Token {
  chainId?: number;
  asset: string;
  type: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  pairs: Pair[];
}

export interface Pair {
  base: string;
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}
