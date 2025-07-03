import { useRef, useCallback } from "react";

const useApiCache = () => {
  const cache = useRef(new Map());
  const maxCacheSize = 1000;

  const cachedRequest = useCallback(async (url) => {
    // Check if we have cached data
    if (cache.current.has(url)) {
      return cache.current.get(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Cache the result
      if (cache.current.size >= maxCacheSize) {
        // Remove oldest entry if cache is full
        const firstKey = cache.current.keys().next().value;
        cache.current.delete(firstKey);
      }

      cache.current.set(url, data);
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }, []);

  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);

  const getCacheSize = useCallback(() => {
    return cache.current.size;
  }, []);

  return { cachedRequest, clearCache, getCacheSize };
};

export default useApiCache;
