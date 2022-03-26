export type Record = {
  collection: string;
  floor: number;
  monthlyChange: number;
};

export interface NftData {
  balance: number;
  totalChange: number | string;
  best: Record;
  worst: Record;
}
