import { openseaAddressCollections, openseaCollectionStats } from '@/backend/blockchain/opensea';
import { Stats } from '@/backend/blockchain/types/opensea.types';
import { nftportAddressNFTs } from '../nftport';
import { NftData } from './nft-helpers.types';

const collectionFloorPrice = async (collection: string) => {
  const stats = await openseaCollectionStats(collection);
  return stats.floor_price;
};

const collectionsSlugs = async (address: string) => {
  const collections = await openseaAddressCollections({ asset_owner: address });
  return collections.map(collection => collection.slug);
};

export const getAddressNFTData = async (address: string): Promise<NftData | null> => {
  try {
    const collections = await collectionsSlugs(address);
    const stats = collections.map(openseaCollectionStats);
    const promise = await Promise.allSettled(stats);
    const filtered = promise.filter(_ => _.status === 'fulfilled') as PromiseFulfilledResult<any>[];
    const formatted = filtered.map((item, index) => {
      const stats = item.value.stats as Stats;
      const { floor_price: floor, thirty_day_change } = stats;
      const floor_thirty_days_ago = floor - thirty_day_change;
      const monthlyChange = thirty_day_change;
      const change = `${((monthlyChange / floor_thirty_days_ago) * 100).toFixed(2)}%`;
      return {
        collection: collections[index],
        floor,
        monthlyChange,
        floor_thirty_days_ago,
        change,
      };
    });
    if (!formatted.length) {
      return null;
    }
    const best = formatted.reduce((a, b) => (a.monthlyChange > b.monthlyChange ? a : b)) || {};
    const worst = formatted.reduce((a, b) => (a.monthlyChange < b.monthlyChange ? a : b)) || {};
    const change = formatted.reduce((acc, curr) => acc + curr.monthlyChange, 0);
    const totalThirtyDays =
      formatted.reduce((acc, curr) => acc + curr.floor_thirty_days_ago, 0) || 0;
    const balance = formatted.reduce((acc, curr) => acc + curr.floor, 0) || 0;
    const totalChange = ((change / totalThirtyDays) * 100).toFixed(2);
    return { balance, best, worst, totalChange };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const floorPrices = async (
  collections: string[]
): Promise<{ collection: string; price: number }[]> => {
  const collectionFloor = async (collection: string) => {
    return {
      collection,
      price: (await openseaCollectionStats(collection)).floor_price,
    };
  };
  const floors = collections.map(collectionFloor);
  const promise = await Promise.allSettled(floors);
  return promise.map(result => (result as any).value);
};

const AddressNftCollections = async (address: string) => {
  const nfts = await nftportAddressNFTs({ address });
  return nfts.nfts.map(nft => nft.name.split('#')[0]);
};
