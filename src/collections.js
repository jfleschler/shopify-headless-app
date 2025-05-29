import { request } from './api.js';
import cache, { isCacheValid, setCache } from './cache.js';
import {
  GET_COLLECTIONS,
  GET_PRODUCTS_BY_COLLECTION,
} from './queries/collections.js';

export const fetchCollections = async () => {
  const entry = cache.collectionsList;
  if (isCacheValid(entry)) return entry.data;
  const { collections } = await request(GET_COLLECTIONS);
  const data = collections.edges.map((e) => e.node);
  setCache(cache, 'collectionsList', data);
  return data;
};

export const fetchProductsByCollection = async (name) => {
  const entry = cache.collections[name];
  if (isCacheValid(entry)) return entry.data;
  const { collections } = await request(GET_PRODUCTS_BY_COLLECTION, {
    collectionTitle: `title:${name}`,
  });
  const edges = collections.edges[0]?.node.products.edges || [];
  const data = edges.map((e) => e.node);
  setCache(cache.collections, name, data);
  return data;
};
