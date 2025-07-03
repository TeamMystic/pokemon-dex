import axios from "axios";
import { useEffect, useRef, useState } from "react";

function useSearchPokemon(query, toBottom) {
  const [dataQuery, setdataQuery] = useState({
    q: "",
    gen: [],
    type: [],
    attr: [],
  });
  const offset = useRef(0);
  const phase2 = useRef(false);
  const [dataAllSearch, setdataAllSearch] = useState([]);
  const [search, setsearch] = useState([]);
  const [type, settype] = useState([]);
  const [attr, setattr] = useState([]);

  const fetchPokemon = async () => {
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset.current}&limit=24`
      );

      // Use Promise.all to avoid race conditions
      const pokemonPromises = data.results.map(async (d) => {
        try {
          const { data: pokemonData } = await axios.get(d.url);
          return pokemonData.is_default ? pokemonData : null;
        } catch (error) {
          console.error(`Error fetching ${d.name}:`, error);
          return null;
        }
      });

      const pokemonResults = await Promise.all(pokemonPromises);
      const validPokemon = pokemonResults.filter(Boolean);

      // Update state with batch update to avoid duplicates
      setsearch((prev) => {
        const existingNames = new Set(prev.map((p) => p.name));
        const newPokemon = validPokemon.filter(
          (p) => !existingNames.has(p.name)
        );
        return [...prev, ...newPokemon];
      });
    } catch (error) {
      console.error("Error fetching pokemon list:", error);
    }
  };

  const setInQuery = () => {
    // Reset dataQuery first
    setdataQuery({
      q: "",
      gen: [],
      type: [],
      attr: [],
    });

    if (!query) return;

    const arrayQuery = query.split("&");
    arrayQuery.map((data) => {
      data.includes("q=") &&
        setdataQuery((prev) => {
          return { ...prev, q: data.slice(2) };
        });

      data.includes("gen=") &&
        setdataQuery((prev) => {
          return { ...prev, gen: data.slice(4).split(".") };
        });

      data.includes("type=") &&
        setdataQuery((prev) => {
          return { ...prev, type: data.slice(5).split(".") };
        });

      data.includes("attr=") &&
        data
          .slice(5)
          .split(".")
          .map((a) => {
            if (
              a.includes("baby") ||
              a.includes("legendary") ||
              a.includes("mythical") ||
              a.includes("has-gmax") ||
              a.includes("has-mega")
            ) {
              setdataQuery((prev) => {
                return {
                  ...prev,
                  attr: prev.attr.find((t) => t === a)
                    ? [...prev.attr]
                    : [...prev.attr, a],
                };
              });
            }
          });
    });
  };

  const searchPokemon = async () => {
    if (dataQuery.q && dataQuery.gen.length > 0) {
      searchByGen();
    } else if (dataQuery.q) {
      searchAll();
    } else if (dataQuery.gen.length > 0) {
      searchByGen();
    }

    if (
      dataQuery.type.length > 0 &&
      dataQuery.q == "" &&
      dataQuery.gen.length == 0
    ) {
      searchByType();
    }

    if (
      dataQuery.attr.length > 0 &&
      dataQuery.q == "" &&
      dataQuery.gen.length == 0 &&
      dataQuery.type.length == 0
    ) {
      searchByAttr();
    }
  };

  // untuk mencari pokemon semua pokemon
  const searchAll = async () => {
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
      );

      if (dataQuery.type.length == 0) {
        setdataAllSearch(data.results);
      }

      if (dataAllSearch.length == 0) {
        offset.current += 24;

        // Filter Pokemon that match the query
        const filteredPokemon = data.results.filter((d) =>
          d.name.includes(dataQuery.q.toLowerCase())
        );

        // Use Promise.all to avoid race conditions
        const pokemonPromises = filteredPokemon.map(async (d) => {
          try {
            const { data: pokemonData } = await axios.get(d.url);
            return pokemonData.is_default ? pokemonData : null;
          } catch (error) {
            console.error(`Error fetching ${d.name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(Boolean);

        if (dataQuery.type.length > 0) {
          setdataAllSearch((prev) => {
            const existingNames = new Set(prev.map((p) => p.name));
            const newPokemon = validPokemon.filter(
              (p) => !existingNames.has(p.name)
            );
            return [...prev, ...newPokemon];
          });
        } else {
          setsearch((prev) => {
            const existingNames = new Set(prev.map((p) => p.name));
            const newPokemon = validPokemon
              .filter((p) => !existingNames.has(p.name))
              .slice(0, Math.max(0, offset.current - prev.length));
            return [...prev, ...newPokemon];
          });
        }
      } else {
        // Handle case when dataAllSearch already has data
        const filteredPokemon = dataAllSearch.filter((d) =>
          d.name.includes(dataQuery.q.toLowerCase())
        );

        const pokemonPromises = filteredPokemon.map(async (d) => {
          try {
            const { data: pokemonData } = await axios.get(d.url);
            return pokemonData.is_default ? pokemonData : null;
          } catch (error) {
            console.error(`Error fetching ${d.name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(Boolean);

        setsearch((prev) => {
          const existingNames = new Set(prev.map((p) => p.name));
          const newPokemon = validPokemon
            .filter((p) => !existingNames.has(p.name))
            .slice(0, Math.max(0, offset.current - prev.length));
          return [...prev, ...newPokemon];
        });
      }
    } catch (error) {
      console.error("Error in searchAll:", error);
    }
  };

  // untuk mencari pokemon berdasarkan gen
  const searchByGen = async () => {
    try {
      if (dataAllSearch.length == 0) {
        offset.current += 24;

        const genPromises = dataQuery.gen.map(async (g) => {
          try {
            const { data } = await axios.get(
              `https://pokeapi.co/api/v2/generation/${g}`
            );
            return data.pokemon_species;
          } catch (error) {
            console.error(`Error fetching generation ${g}:`, error);
            return [];
          }
        });

        const genResults = await Promise.all(genPromises);
        const allSpecies = genResults.flat();

        // Update dataAllSearch with unique species
        setdataAllSearch((prev) => {
          const existingNames = new Set(prev.map((p) => p.name));
          const newSpecies = allSpecies.filter(
            (s) => !existingNames.has(s.name)
          );
          return [...prev, ...newSpecies];
        });

        // Filter species based on query
        const filteredSpecies =
          dataQuery.q.length > 0
            ? allSpecies.filter((d) => d.name.includes(dataQuery.q))
            : allSpecies;

        const pokemonPromises = filteredSpecies.map(async (d) => {
          try {
            const { data: speciesData } = await axios.get(d.url);
            const defaultVariety = speciesData.varieties.find(
              (v) => v.is_default
            );
            if (defaultVariety) {
              const { data: pokemonData } = await axios.get(
                defaultVariety.pokemon.url
              );
              return pokemonData;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${d.name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(Boolean);

        if (dataQuery.type.length > 0) {
          setdataAllSearch((prev) => {
            const existingNames = new Set(prev.map((p) => p.name));
            const newPokemon = validPokemon.filter(
              (p) => !existingNames.has(p.name)
            );
            return [...prev, ...newPokemon];
          });
        } else {
          setsearch((prev) => {
            const existingNames = new Set(prev.map((p) => p.name));
            const newPokemon = validPokemon
              .filter((p) => !existingNames.has(p.name))
              .slice(0, Math.max(0, offset.current - prev.length));
            return [...prev, ...newPokemon];
          });
        }
      } else {
        // Filter from existing dataAllSearch
        const filteredSpecies =
          dataQuery.q.length > 0
            ? dataAllSearch.filter((d) => d.name.includes(dataQuery.q))
            : dataAllSearch;

        const pokemonPromises = filteredSpecies.map(async (d) => {
          try {
            const { data: speciesData } = await axios.get(d.url);
            const defaultVariety = speciesData.varieties.find(
              (v) => v.is_default
            );
            if (defaultVariety) {
              const { data: pokemonData } = await axios.get(
                defaultVariety.pokemon.url
              );
              return pokemonData;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching ${d.name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const validPokemon = pokemonResults.filter(Boolean);

        setsearch((prev) => {
          const existingNames = new Set(prev.map((p) => p.name));
          const newPokemon = validPokemon
            .filter((p) => !existingNames.has(p.name))
            .slice(0, Math.max(0, offset.current - prev.length));
          return [...prev, ...newPokemon];
        });
      }
    } catch (error) {
      console.error("Error in searchByGen:", error);
    }
  };

  const searchByType = async () => {
    try {
      if (dataQuery.q || dataQuery.gen.length > 0) {
        // Filter from existing dataAllSearch
        const filteredPokemon = dataAllSearch.filter((d) => {
          if (dataQuery.type.length == 2) {
            return (
              d.types.find((element) =>
                element.type.name.includes(dataQuery.type[0])
              ) &&
              d.types.find((element) =>
                element.type.name.includes(dataQuery.type[1])
              )
            );
          } else {
            return d.types.find((element) =>
              element.type.name.includes(dataQuery.type[0])
            );
          }
        });

        settype((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPokemon = filteredPokemon
            .filter((p) => !existingIds.has(p.id))
            .slice(0, Math.max(0, offset.current - prev.length));
          return [...prev, ...newPokemon];
        });
      } else {
        if (dataAllSearch.length == 0) {
          offset.current += 24;
          phase2.current = true;
        }

        if (dataAllSearch.length > 0) {
          // Filter from existing dataAllSearch
          const filteredPokemon = dataAllSearch.filter((data) => {
            if (dataQuery.type.length == 2) {
              return (
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[0])
                ) &&
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[1])
                )
              );
            } else {
              return data.types.find((element) =>
                element.type.name.includes(dataQuery.type[0])
              );
            }
          });

          settype((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPokemon = filteredPokemon
              .filter((p) => !existingIds.has(p.id))
              .slice(0, Math.max(0, offset.current - prev.length));
            return [...prev, ...newPokemon];
          });
        }

        if (dataAllSearch.length == 0) {
          // Fetch from API
          const typePromises = dataQuery.type.map(async (t) => {
            try {
              const { data } = await axios.get(
                `https://pokeapi.co/api/v2/type/${t}`
              );
              return data.pokemon;
            } catch (error) {
              console.error(`Error fetching type ${t}:`, error);
              return [];
            }
          });

          const typeResults = await Promise.all(typePromises);
          const allPokemon = typeResults.flat();

          // Get unique Pokemon
          const uniquePokemon = new Map();
          allPokemon.forEach((p) => {
            if (!uniquePokemon.has(p.pokemon.name)) {
              uniquePokemon.set(p.pokemon.name, p);
            }
          });

          const pokemonPromises = Array.from(uniquePokemon.values()).map(
            async (d) => {
              try {
                const { data: pokemonData } = await axios.get(d.pokemon.url);
                return pokemonData.is_default ? pokemonData : null;
              } catch (error) {
                console.error(`Error fetching ${d.pokemon.name}:`, error);
                return null;
              }
            }
          );

          const pokemonResults = await Promise.all(pokemonPromises);
          const validPokemon = pokemonResults.filter(Boolean);

          // Filter by type requirements
          const filteredPokemon = validPokemon.filter((data) => {
            if (dataQuery.type.length == 2) {
              return (
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[0])
                ) &&
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[1])
                )
              );
            } else {
              return data.types.find((element) =>
                element.type.name.includes(dataQuery.type[0])
              );
            }
          });

          if (dataQuery.attr.length == 0) {
            setdataAllSearch((prev) => {
              const existingNames = new Set(prev.map((p) => p.name));
              const newPokemon = filteredPokemon.filter(
                (p) => !existingNames.has(p.name)
              );
              return [...prev, ...newPokemon];
            });
          }

          settype((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newPokemon = filteredPokemon
              .filter((p) => !existingIds.has(p.id))
              .slice(0, Math.max(0, offset.current - prev.length));
            return [...prev, ...newPokemon];
          });
        }
      }
    } catch (error) {
      console.error("Error in searchByType:", error);
    }
  };

  const searchByAttr = async () => {
    if (dataAllSearch.length > 0) {
      if (
        dataQuery.q === "" &&
        dataQuery.gen.length === 0 &&
        dataQuery.type.length === 0
      ) {
        dataAllSearch.map((d) => {
          dataQuery.attr.map(async (r) => {
            if (r === "baby") {
              if (d.is_baby) {
                const { data } = await axios.get(d.varieties[0].pokemon.url);
                setattr((prev) => {
                  return prev.find((t) => t.id === data.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data]
                    : [...prev];
                });
              }
            } else if (r === "legendary") {
              if (d.is_legendary) {
                const { data } = await axios.get(d.varieties[0].pokemon.url);
                setattr((prev) => {
                  return prev.find((t) => t.id === data.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data]
                    : [...prev];
                });
              }
            } else if (r === "mythical") {
              if (d.is_mythical) {
                const { data } = await axios.get(d.varieties[0].pokemon.url);
                setattr((prev) => {
                  return prev.find((t) => t.id === data.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data]
                    : [...prev];
                });
              }
            } else if (r === "has-gmax") {
              d.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("gmax")) {
                  const { data } = await axios.get(d.varieties[0].pokemon.url);
                  setattr((prev) => {
                    return prev.find((t) => t.id === data.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, data]
                      : [...prev];
                  });
                }
              });
            } else if (r === "has-mega") {
              d.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("mega")) {
                  const { data } = await axios.get(d.varieties[0].pokemon.url);
                  setattr((prev) => {
                    return prev.find((t) => t.id === data.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, data]
                      : [...prev];
                  });
                }
              });
            }
          });
        });
      } else if (dataQuery.type.length > 0 && type.length == 0) {
        dataAllSearch.map(async (d) => {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${d.id}`
          );
          dataQuery.attr.map(async (r) => {
            if (r === "baby") {
              if (data.is_baby) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "legendary") {
              if (data.is_legendary) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "mythical") {
              if (data.is_mythical) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "has-gmax") {
              data.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("gmax")) {
                  setattr((prev) => {
                    return prev.find((t) => t.id === d.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, d]
                      : [...prev];
                  });
                }
              });
            } else if (r === "has-mega") {
              data.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("mega")) {
                  setattr((prev) => {
                    return prev.find((t) => t.id === d.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, d]
                      : [...prev];
                  });
                }
              });
            }
          });
        });
      } else {
        type.map(async (d) => {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${d.id}`
          );
          dataQuery.attr.map(async (r) => {
            if (r === "baby") {
              if (data.is_baby) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "legendary") {
              if (data.is_legendary) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "mythical") {
              if (data.is_mythical) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, d]
                    : [...prev];
                });
              }
            } else if (r === "has-gmax") {
              data.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("gmax")) {
                  setattr((prev) => {
                    return prev.find((t) => t.id === d.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, d]
                      : [...prev];
                  });
                }
              });
            } else if (r === "has-mega") {
              data.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("mega")) {
                  setattr((prev) => {
                    return prev.find((t) => t.id === d.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, d]
                      : [...prev];
                  });
                }
              });
            }
          });
        });
      }
    } else {
      if (
        dataQuery.q === "" &&
        dataQuery.gen.length === 0 &&
        dataQuery.type.length === 0
      ) {
        const { data } = await axios.get(
          "https://pokeapi.co/api/v2/pokemon-species/?limit=100000&offset=0"
        );
        if (dataAllSearch.length == 0) {
          offset.current += 24;
        }
        await data.results.map(async (d) => {
          const { data } = await axios.get(d.url);
          const data2 = await data;
          setdataAllSearch((prev) => {
            return [...prev, data2];
          });
          dataQuery.attr.map(async (r) => {
            if (r === "baby") {
              if (data2.is_baby) {
                const { data } = await axios.get(
                  data2.varieties[0].pokemon.url
                );
                const data3 = await data;
                setattr((prev) => {
                  return prev.find((t) => t.id === data3.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data3]
                    : [...prev];
                });
              }
            } else if (r === "legendary") {
              if (data2.is_legendary) {
                const { data } = await axios.get(
                  data2.varieties[0].pokemon.url
                );
                const data3 = await data;
                setattr((prev) => {
                  return prev.find((t) => t.id === data.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data3]
                    : [...prev];
                });
              }
            } else if (r === "mythical") {
              if (data2.is_mythical) {
                const { data } = await axios.get(
                  data2.varieties[0].pokemon.url
                );
                const data3 = await data;
                setattr((prev) => {
                  return prev.find((t) => t.id === data.id)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data3]
                    : [...prev];
                });
              }
            } else if (r === "has-gmax") {
              data2.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("gmax")) {
                  const { data } = await axios.get(
                    data2.varieties[0].pokemon.url
                  );
                  const data3 = await data;
                  setattr((prev) => {
                    return prev.find((t) => t.id === data.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, data3]
                      : [...prev];
                  });
                }
              });
            } else if (r === "has-mega") {
              data2.varieties.map(async (Variants) => {
                if (Variants.pokemon.name.includes("mega")) {
                  const { data } = await axios.get(
                    data2.varieties[0].pokemon.url
                  );
                  const data3 = await data;
                  setattr((prev) => {
                    return prev.find((t) => t.id === data.id)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, data3]
                      : [...prev];
                  });
                }
              });
            }
          });
        });
      }
    }
  };

  useEffect(() => {
    setdataQuery({
      q: "",
      gen: [],
      type: [],
      attr: [],
    });
    offset.current = 0;
    phase2.current = false;
    setdataAllSearch([]);
    setsearch([]);
    settype([]);
    setattr([]);

    if (query == undefined) {
      fetchPokemon();
    }
  }, [query]);

  useEffect(() => {
    searchPokemon();
  }, [dataQuery]);

  useEffect(() => {
    if (query !== undefined) {
      setInQuery();
    }

    if (dataAllSearch.length > 0) {
      setTimeout(() => {
        if (dataQuery.type.length > 0 && phase2.current == false) {
          searchByType();
        } else if (dataQuery.type.length > 0 && dataQuery.attr.length > 0) {
          searchByAttr();
        }
      }, 1500);
    }
  }, [search, dataAllSearch, query]);

  useEffect(() => {
    setTimeout(() => {
      if (dataQuery.type.length > 0 && dataQuery.attr.length > 0) {
        searchByAttr();
      }
    }, 1500);
  }, [type]);

  useEffect(() => {
    toBottom && (offset.current += 24);

    if (toBottom) {
      if (query == undefined) {
        fetchPokemon();
      }

      if (
        dataQuery.q.length > 0 &&
        dataQuery.gen.length == 0 &&
        dataQuery.type.length == 0
      ) {
        searchAll();
      }

      if (dataQuery.gen.length > 0 && dataQuery.type.length == 0) {
        searchByGen();
      }

      if (dataQuery.type.length > 0) {
        searchByType();
      }

      if (dataQuery.attr.length > 0) {
        searchByAttr();
      }
    }
  }, [toBottom]);

  return { dataQuery, search, type, attr };
}

export default useSearchPokemon;
