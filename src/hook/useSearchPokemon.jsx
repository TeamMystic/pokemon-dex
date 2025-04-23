import axios from "axios";
import { useEffect, useState } from "react";

function useSearchPokemon(query) {
  const [dataQuery, setdataQuery] = useState({
    q: "",
    gen: [],
    type: [],
    attr: [],
  });
  const [search, setsearch] = useState([]);
  const [type, settype] = useState([]);
  const [attr, setattr] = useState([]);

  const setInQuery = () => {
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
    setsearch([]);
    settype([]);
    setattr([]);
    if (dataQuery.q && dataQuery.gen.length > 0) {
      console.log("jika search ada dan gen ada");
      searchByGen();
    } else if (dataQuery.q) {
      console.log("jika search ada, gen tidak ad");
      searchAll();
    } else if (dataQuery.gen.length > 0) {
      console.log("jika gen ada, search tidak ada");
      searchByGen();
    }

    if (
      dataQuery.type.length > 0 &&
      dataQuery.q.length < 1 &&
      dataQuery.gen.length < 1
    ) {
      console.log("jika ada type tapi TIDAK ada search dan gen");
      searchByType();
    }

    if (
      dataQuery.attr.length > 0 &&
      dataQuery.q.length < 1 &&
      dataQuery.gen.length < 1
    ) {
      console.log("jika ada attr tapi TIDAK ada search dan gen");
      searchByAttr();
    }
    // if (dataQuery.attr.length > 0) {
    //   const { data } = await axios.get("");
    //   setsearch((prev) => {
    //     return {
    //       ...prev,
    //       attr: data.results,
    //     };
    //   });
    // }
  };

  // untuk mencari pokemon semua pokemon
  const searchAll = async () => {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
    );
    // new Promise.all(
    await data.results?.map(async (d) => {
      if (d.name.includes(dataQuery.q)) {
        const { data } = await axios.get(d.url);
        data.is_default &&
          setsearch((prev) => {
            return dataQuery.type.length > 0 || dataQuery.attr.length > 0
              ? [...prev, data]
              : prev.length < 24
              ? [...prev, data]
              : [...prev];
          });
      }
    });
    // );
  };

  // untuk mencari pokemon berdasarkan gen
  const searchByGen = async () => {
    dataQuery.gen.map(async (g) => {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/generation/${g}`
      );
      if (dataQuery.q) {
        await data.pokemon_species?.map(async (d) => {
          if (d.name.includes(dataQuery.q)) {
            const { data } = await axios.get(d.url);
            data.varieties.map(async (t) => {
              if (t.is_default) {
                const { data } = await axios.get(t.pokemon.url);
                setsearch((prev) => {
                  return [...prev, data];
                });
              }
            });
          }
        });
      } else {
        await data.pokemon_species?.map(async (d) => {
          const { data } = await axios.get(d.url);
          data.varieties.map(async (t) => {
            if (t.is_default) {
              const { data } = await axios.get(t.pokemon.url);
              setsearch((prev) => {
                return [...prev, data];
              });
            }
          });
        });
      }
    });
  };

  const searchByType = async () => {
    if (dataQuery.q || dataQuery.gen.length > 0) {
      search.search.map((d) => {
        if (dataQuery.type.length == 2) {
          if (
            d.types.find((element) =>
              element.type.name.includes(dataQuery.type[0])
            ) &&
            d.types.find((element) =>
              element.type.name.includes(dataQuery.type[1])
            )
          ) {
            settype((prev) => {
              return type.find((e) => e.id === d.id)
                ? [...prev]
                : prev.length < 24
                ? [...prev, d]
                : [...prev];
            });
          }
        } else {
          if (
            d.types.find((element) =>
              element.type.name.includes(dataQuery.type[0])
            )
          ) {
            settype((prev) => {
              return type.find((e) => e.id === d.id)
                ? [...prev]
                : prev.length < 24
                ? [...prev, d]
                : [...prev];
            });
          }
        }
      });
    } else {
      dataQuery.type.map(async (t) => {
        const { data } = await axios.get(`https://pokeapi.co/api/v2/type/${t}`);
        await data.pokemon.map(async (d) => {
          const { data } = await axios.get(d.pokemon.url);
          if (data.is_default) {
            if (dataQuery.type.length == 2) {
              if (
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[0])
                ) &&
                data.types.find((element) =>
                  element.type.name.includes(dataQuery.type[1])
                )
              ) {
                settype((prev) => {
                  return [...prev, data];
                });
              }
            } else {
              settype((prev) => {
                return [...prev, data];
              });
            }
          }
        });
      });
    }
  };

  const searchByAttr = async () => {
    if (dataQuery.q === "" && dataQuery.gen.length === 0) {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon-species/?limit=100000&offset=0"
      );
      const data1 = await data;
      await data1.results.map(async (d) => {
        const { data } = await axios.get(d.url);
        const data2 = await data;
        dataQuery.attr.map(async (r) => {
          if (r === "baby") {
            if (data2.is_baby) {
              const { data } = await axios.get(data2.varieties[0].pokemon.url);
              const data3 = await data;
              setattr((prev) => {
                return prev.find((t) => t.id === data3.id)
                  ? [...prev]
                  : [...prev, data3];
              });
            }
          } else if (r === "legendary") {
            if (data2.is_legendary) {
              const { data } = await axios.get(data2.varieties[0].pokemon.url);
              const data3 = await data;
              setattr((prev) => {
                return prev.find((t) => t.id === data.id)
                  ? [...prev]
                  : [...prev, data3];
              });
            }
          } else if (r === "mythical") {
            if (data2.is_mythical) {
              const { data } = await axios.get(data2.varieties[0].pokemon.url);
              const data3 = await data;
              setattr((prev) => {
                return prev.find((t) => t.id === data.id)
                  ? [...prev]
                  : [...prev, data3];
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
                    : [...prev, data3];
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
                    : [...prev, data3];
                });
              }
            });
          }
        });
      });
    } else if (dataQuery.type.length > 0) {
    } else if (dataQuery.q || dataQuery.gen.length > 0) {
      search.map(async (d) => {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${d.id}`
        );
        dataQuery.attr.map(async (r) => {
          if (r === "baby") {
            if (data.is_baby) {
              setattr((prev) => {
                return prev.find((t) => t.id === d.id)
                  ? [...prev]
                  : [...prev, d];
              });
            }
          } else if (r === "legendary") {
            if (data.is_legendary) {
              setattr((prev) => {
                return prev.find((t) => t.id === d.id)
                  ? [...prev]
                  : [...prev, d];
              });
            }
          } else if (r === "mythical") {
            if (data.is_mythical) {
              setattr((prev) => {
                return prev.find((t) => t.id === d.id)
                  ? [...prev]
                  : [...prev, d];
              });
            }
          } else if (r === "has-gmax") {
            data.varieties.map(async (Variants) => {
              if (Variants.pokemon.name.includes("gmax")) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : [...prev, d];
                });
              }
            });
          } else if (r === "has-mega") {
            data.varieties.map(async (Variants) => {
              if (Variants.pokemon.name.includes("mega")) {
                setattr((prev) => {
                  return prev.find((t) => t.id === d.id)
                    ? [...prev]
                    : [...prev, d];
                });
              }
            });
          }
        });
      });
    }
  };

  useEffect(() => {
    if (query !== undefined) {
      setInQuery();
    }

    const fetchPokemon = async () => {
      setsearch([]);
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=24&offset=0`
      );
      await data.results.map(async (d) => {
        const { data } = await axios.get(d.url);
        if (data.is_default) {
          setsearch((prev) => {
            return prev.find((t) => t.name === d.name)
              ? [...prev]
              : [...prev, data];
          });
        }
      });
    };

    if (query == undefined) {
      fetchPokemon();
    }
  }, []);

  useEffect(() => {
    searchPokemon();
    console.log(dataQuery);
  }, [dataQuery]);

  useEffect(() => {
    setTimeout(() => {
      if (dataQuery.type.length > 0) {
        searchByType();
      } else if (dataQuery.attr.length > 0) {
        searchByAttr();
      }
    }, 1500);
    console.log(search, "this search ing by name");
  }, [search]);

  useEffect(() => {
    if (search.length > 0) {
      setTimeout(() => {
        if (dataQuery.type.length > 0 && dataQuery.attr.length > 0) {
          searchByAttr();
        }
      }, 1500);
    }
    console.log(type, "this by type pokemon");
  }, [type]);

  useEffect(() => {
    console.log(attr, "this by attr rare");
  }, [attr]);

  return { dataQuery, search };
}

export default useSearchPokemon;
