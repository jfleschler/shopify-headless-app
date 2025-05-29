import { CACHE_TTL } from './config.js';

const cache = {
  productById: {},
  productByHandle: {},
  collections: {},
  search: {},
  collectionsList: null,
};

export const isCacheValid = (entry) =>
  entry && Date.now() - entry.timestamp < CACHE_TTL;

export const getCache = (store, key) => store[key];

export const setCache = (store, key, data) => {
  store[key] = { data, timestamp: Date.now() };
};

export default cache;
