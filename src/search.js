import { request } from './api.js';
import cache, { isCacheValid, setCache } from './cache.js';
import { SEARCH_PRODUCTS } from './queries/search.js';

export const searchProducts = async (term) => {
  const entry = cache.search[term];
  if (isCacheValid(entry)) return entry.data;

  const { products } = await request(SEARCH_PRODUCTS, { q: term });
  const data = products.edges.map((e) => e.node);

  setCache(cache.search, term, data);
  return data;
};
