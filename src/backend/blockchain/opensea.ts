import axios from 'axios';
import {
  Stats,
  OpenseaAddressCollection,
  OpenseaAddressCollectionsRequest,
} from './types/opensea.types';

const URL = 'https://api.opensea.io/api/v1';
//https://api.opensea.io/api/v1/collection/doodles-official/stats

async function openseaRequest<T>(relativePath: string) {
  const url = `${URL}/${relativePath}`;
  try {
    const response = await axios.get<Promise<T>>(url);
    return response.data;
  } catch (error) {
    console.log(`Error while fetching ${url}:`, error instanceof Error ? error.message : error);
  }
  return null;
}

export async function openseaCollectionStats(collection: string): Promise<Stats> {
  const relativePath = `collection/${collection}/stats`;
  const data = await openseaRequest<Stats>(relativePath);
  if (!data) {
    throw new Error('Error while fetching collection stats');
  }
  return data;
}

export async function openseaAddressCollections({
  asset_owner,
  offset = '0',
  limit = '300',
}: OpenseaAddressCollectionsRequest): Promise<Array<OpenseaAddressCollection>> {
  const params = new URLSearchParams({ asset_owner, offset, limit });
  const relativePath = `collections?` + params.toString();
  const data = await openseaRequest<Array<OpenseaAddressCollection>>(relativePath);
  if (!data) {
    throw new Error('Error while fetching address collections');
  }
  return data;
}
