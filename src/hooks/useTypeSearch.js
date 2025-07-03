import { useState, useCallback, useRef } from "react";
import useApiCache from "./useApiCache";

const useTypeSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cachedRequest } = useApiCache();
  const abortController = useRef(null);

  const searchByTypes = useCallback(
    async (types, options = {}) => {
      if (!types || types.length === 0) {
        setResults([]);
        return;
      }

      // Cancel previous request if it exists
      if (abortController.current) {
        abortController.current.abort();
      }

      abortController.current = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const { limit = 24, offset = 0 } = options;

        if (types.length === 1) {
          // Single type search
          const data = await cachedRequest(
            `https://pokeapi.co/api/v2/type/${types[0]}`
          );
          const pokemonList = await Promise.all(
            data.pokemon.slice(offset, offset + limit).map(async (p) => {
              const pokemonData = await cachedRequest(p.pokemon.url);
              return pokemonData.is_default ? pokemonData : null;
            })
          );
          setResults(pokemonList.filter(Boolean));
        } else {
          // Multiple types search - find Pokemon with all specified types
          const typePromises = types.map((type) =>
            cachedRequest(`https://pokeapi.co/api/v2/type/${type}`)
          );
          const typeData = await Promise.all(typePromises);

          // Find Pokemon that have all specified types
          const firstTypePokemons = typeData[0].pokemon.map(
            (p) => p.pokemon.name
          );
          const commonPokemons = firstTypePokemons.filter((pokemonName) =>
            typeData.every((data) =>
              data.pokemon.some((p) => p.pokemon.name === pokemonName)
            )
          );

          const pokemonList = await Promise.all(
            commonPokemons.slice(offset, offset + limit).map(async (name) => {
              const pokemonData = await cachedRequest(
                `https://pokeapi.co/api/v2/pokemon/${name}`
              );
              return pokemonData.is_default ? pokemonData : null;
            })
          );

          setResults(pokemonList.filter(Boolean));
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          console.error("Type search error:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [cachedRequest]
  );

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchByTypes,
    clearResults,
  };
};

export default useTypeSearch;
