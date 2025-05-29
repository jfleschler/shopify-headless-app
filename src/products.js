import { request } from './api.js';
import cache, { isCacheValid, setCache } from './cache.js';
import {
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_HANDLE,
} from './queries/products.js';

export const fetchProductById = async (id) => {
  const entry = cache.productById[id];
  if (isCacheValid(entry)) return entry.data;
  const { product } = await request(GET_PRODUCT_BY_ID, { id });
  setCache(cache.productById, id, product);
  return product;
};

export const fetchProductByHandle = async (handle) => {
  const entry = cache.productByHandle[handle];
  if (isCacheValid(entry)) return entry.data;
  const { productByHandle } = await request(GET_PRODUCT_BY_HANDLE, { handle });
  setCache(cache.productByHandle, handle, productByHandle);
  return productByHandle;
};
