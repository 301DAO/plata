export interface BitcoinAddressesHistoryRequest {
  addresses: string[];
  cors?: boolean;
}

export interface BitcoinAddressesHistoryResponse {
  addresses: Address[];
  wallet: Wallet;
  txs: Tx[];
  info: Info;
  recommend_include_fee: boolean;
}

interface Info {
  nconnected: number;
  conversion: number;
  symbol_local: Symbollocal;
  symbol_btc: Symbollocal;
  latest_block: Latestblock;
}

interface Latestblock {
  hash: string;
  height: number;
  time: number;
  block_index: number;
}

interface Symbollocal {
  code: string;
  symbol: string;
  name: string;
  conversion: number;
  symbolAppearsAfter: boolean;
  local: boolean;
}

interface Tx {
  hash: string;
  ver: number;
  vin_sz: number;
  vout_sz: number;
  size: number;
  weight: number;
  fee: number;
  relayed_by: string;
  lock_time: number;
  tx_index: number;
  double_spend: boolean;
  time: number;
  block_index: number;
  block_height: number;
  inputs: Input[];
  out: Out[];
  result: number;
  balance: number;
}

interface Out {
  type: number;
  spent: boolean;
  value: number;
  spending_outpoints: any[];
  n: number;
  tx_index: number;
  script: string;
  addr: string;
}

interface Input {
  sequence: number;
  witness: string;
  script: string;
  index: number;
  prev_out: Prevout;
}

interface Prevout {
  spent: boolean;
  script: string;
  spending_outpoints: Spendingoutpoint[];
  tx_index: number;
  value: number;
  addr: string;
  n: number;
  type: number;
}

interface Spendingoutpoint {
  tx_index: number;
  n: number;
}

interface Wallet {
  final_balance: number;
  n_tx: number;
  n_tx_filtered: number;
  total_received: number;
  total_sent: number;
}

interface Address {
  address: string;
  final_balance: number;
  n_tx: number;
  total_received: number;
  total_sent: number;
}
