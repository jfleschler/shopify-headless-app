import { CACHE_TTL } from './config.js';

// localStorage keys for different cache stores
const CACHE_KEYS = {
  productById: 'shopify-cache-productById',
  productByHandle: 'shopify-cache-productByHandle',
  collections: 'shopify-cache-collections',
  search: 'shopify-cache-search',
  collectionsList: 'shopify-cache-collectionsList'
};

// Helper function to get data from localStorage
const getFromLocalStorage = (key) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn(`Cache: Failed to parse localStorage data for ${key}:`, error);
    return {};
  }
};

// Helper function to save data to localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Cache: Failed to save to localStorage for ${key}:`, error);
  }
};

// Initialize cache stores with localStorage data or empty objects
const initCacheStore = (storeName) => {
  const localStorageKey = CACHE_KEYS[storeName];
  return getFromLocalStorage(localStorageKey);
};

// Cache object that syncs with localStorage
const cache = {
  get productById() {
    return getFromLocalStorage(CACHE_KEYS.productById);
  },
  
  get productByHandle() {
    return getFromLocalStorage(CACHE_KEYS.productByHandle);
  },
  
  get collections() {
    return getFromLocalStorage(CACHE_KEYS.collections);
  },
  
  get search() {
    return getFromLocalStorage(CACHE_KEYS.search);
  },
  
  get collectionsList() {
    try {
      const stored = localStorage.getItem(CACHE_KEYS.collectionsList);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Cache: Failed to parse collectionsList from localStorage:', error);
      return null;
    }
  }
};

export const isCacheValid = (entry) =>
  entry && Date.now() - entry.timestamp < CACHE_TTL;

export const getCache = (store, key) => {
  // Handle special case for collectionsList which is stored directly
  if (key === 'collectionsList') {
    return cache.collectionsList;
  }
  
  // For other stores, get the data object and return the specific key
  const storeData = typeof store === 'object' && store.constructor === Object 
    ? store 
    : getFromLocalStorage(CACHE_KEYS[getStoreKey(store)]);
  
  return storeData[key];
};

export const setCache = (store, key, data) => {
  const entry = { data, timestamp: Date.now() };
  
  // Handle special case for collectionsList
  if (key === 'collectionsList') {
    saveToLocalStorage(CACHE_KEYS.collectionsList, entry);
    return;
  }
  
  // Determine which localStorage key to use
  const storeKey = getStoreKey(store);
  if (!storeKey) {
    console.warn('Cache: Unknown store type, cannot save to localStorage');
    return;
  }
  
  // Get current store data, update it, and save back
  const storeData = getFromLocalStorage(CACHE_KEYS[storeKey]);
  storeData[key] = entry;
  saveToLocalStorage(CACHE_KEYS[storeKey], storeData);
};

// Helper function to determine store key from store reference
const getStoreKey = (store) => {
  // Check if this is a reference to one of our cache stores
  if (store === cache.productById) return 'productById';
  if (store === cache.productByHandle) return 'productByHandle';
  if (store === cache.collections) return 'collections';
  if (store === cache.search) return 'search';
  
  // If it's the main cache object, we need to check the property name
  // This happens when called like setCache(cache, 'collectionsList', data)
  if (store === cache) return null; // Will be handled by special case above
  
  return null;
};

// Clear cache functionality for debugging
export const clearCache = (storeType = null) => {
  if (storeType && CACHE_KEYS[storeType]) {
    localStorage.removeItem(CACHE_KEYS[storeType]);
    console.log(`Cache: Cleared ${storeType} cache`);
  } else if (!storeType) {
    // Clear all cache
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('Cache: Cleared all cache');
  } else {
    console.warn(`Cache: Unknown store type "${storeType}"`);
  }
};

// Debug function to show all cache contents
export const debugCache = () => {
  console.log('🔍 Current Cache State:');
  Object.entries(CACHE_KEYS).forEach(([storeType, key]) => {
    const data = getFromLocalStorage(key);
    const itemCount = Object.keys(data).length;
    console.log(`${storeType}:`, itemCount, 'items', data);
  });
};

// Expose debug functions globally in development
if (typeof window !== 'undefined') {
  window.ShopifyCacheDebug = {
    clearCache,
    debugCache,
    viewCache: () => cache
  };
}

export default cache;
