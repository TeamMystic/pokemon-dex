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
  const phase3 = useRef(false);
  const [dataAllSearch, setdataAllSearch] = useState([]);
  const [search, setsearch] = useState([]);
  const [type, settype] = useState([]);
  const [attr, setattr] = useState([]);

  const fetchPokemon = async () => {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset.current}&limit=24`
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
      dataQuery.q == "" &&
      dataQuery.gen.length == 0
    ) {
      console.log("jika ada type tapi TIDAK ada search dan gen");
      searchByType();
    }

    if (
      dataQuery.attr.length > 0 &&
      dataQuery.q == "" &&
      dataQuery.gen.length == 0 &&
      dataQuery.type.length == 0
    ) {
      console.log("jika ada attr tapi TIDAK ada search dan gen");
      searchByAttr();
    }
  };

  // untuk mencari pokemon semua pokemon
  const searchAll = async () => {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
    );
    if (dataQuery.type.length == 0) {
      setdataAllSearch(data.results);
    }
    // new Promise.all(
    if (dataAllSearch.length == 0) {
      offset.current += 24;
      await data.results.map(async (d) => {
        if (d.name.includes(dataQuery.q.toLowerCase())) {
          const { data } = await axios.get(d.url);
          if (data.is_default) {
            if (dataQuery.type.length > 0) {
              setdataAllSearch((prev) => {
                return [...prev, data];
              });
            } else {
              setsearch((prev) => {
                return dataQuery.type.length > 0 || dataQuery.attr.length > 0
                  ? [...prev, data]
                  : prev.length < offset.current
                  ? [...prev, data]
                  : [...prev];
              });
            }
          }
        }
      });
    } else {
      dataAllSearch.map(async (d) => {
        if (d.name.includes(dataQuery.q.toLowerCase())) {
          const { data } = await axios.get(d.url);
          data.is_default &&
            setsearch((prev) => {
              return prev.find((t) => t.name === d.name)
                ? [...prev]
                : prev.length < offset.current
                ? [...prev, data]
                : [...prev];
            });
        }
      });
    }
    // );
  };

  // untuk mencari pokemon berdasarkan gen
  const searchByGen = async () => {
    if (dataAllSearch.length == 0) {
      offset.current += 24;
      dataQuery.gen.map(async (g) => {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/generation/${g}`
        );
        setdataAllSearch((prev) => {
          return prev.concat(data.pokemon_species);
        });
        await data.pokemon_species?.map(async (d) => {
          if (dataQuery.q.length > 0) {
            if (d.name.includes(dataQuery.q)) {
              const { data } = await axios.get(d.url);
              data.varieties.map(async (t) => {
                if (t.is_default) {
                  const { data } = await axios.get(t.pokemon.url);
                  const data3 = await data;
                  if (dataQuery.type.length > 0) {
                    setdataAllSearch((prev) => {
                      return [...prev, data3];
                    });
                  } else {
                    setsearch((prev) => {
                      return prev.length < offset.current
                        ? [...prev, data3]
                        : [...prev];
                    });
                  }
                }
              });
            }
          } else {
            const { data } = await axios.get(d.url);
            data.varieties.map(async (t) => {
              if (t.is_default) {
                const { data } = await axios.get(t.pokemon.url);
                const data3 = await data;
                if (dataQuery.type.length > 0) {
                  setdataAllSearch((prev) => {
                    return [...prev, data3];
                  });
                } else {
                  setsearch((prev) => {
                    return prev.length < offset.current
                      ? [...prev, data3]
                      : [...prev];
                  });
                }
              }
            });
          }
        });
      });
    } else {
      dataAllSearch?.map(async (d) => {
        if (dataQuery.q.length > 0) {
          if (d.name.includes(dataQuery.q)) {
            const { data } = await axios.get(d.url);
            data.varieties.map(async (t) => {
              if (t.is_default) {
                const { data } = await axios.get(t.pokemon.url);
                setsearch((prev) => {
                  return prev.find((t) => t.name === d.name)
                    ? [...prev]
                    : prev.length < offset.current
                    ? [...prev, data]
                    : [...prev];
                });
              }
            });
          }
        } else {
          const { data } = await axios.get(d.url);
          data.varieties.map(async (t) => {
            if (t.is_default) {
              const { data } = await axios.get(t.pokemon.url);
              setsearch((prev) => {
                return prev.find((t) => t.name === d.name)
                  ? [...prev]
                  : prev.length < offset.current
                  ? [...prev, data]
                  : [...prev];
              });
            }
          });
        }
        // const { data } = await axios.get(d.url);
        // data.varieties.map(async (t) => {
        //   if (t.is_default) {
        //     const { data } = await axios.get(t.pokemon.url);
        //     setsearch((prev) => {
        //       return prev.find((t) => t.name === d.name)
        //         ? [...prev]
        //         : prev.length < offset.current
        //         ? [...prev, data]
        //         : [...prev];
        //     });
        //   }
        // });
      });
    }
  };

  const searchByType = async () => {
    if (dataQuery.q || dataQuery.gen.length > 0) {
      dataAllSearch.map((d) => {
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
              return prev.find((e) => e.id === d.id)
                ? [...prev]
                : prev.length < offset.current
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
              return prev.find((e) => e.id === d.id)
                ? [...prev]
                : prev.length < offset.current
                ? [...prev, d]
                : [...prev];
            });
          }
        }
      });
    } else {
      if (dataAllSearch.length == 0) {
        offset.current += 24;
        phase2.current = true;
      }

      if (dataAllSearch.length > 0) {
        dataAllSearch.map((data) => {
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
                return prev.find((t) => t.id === data.id)
                  ? [...prev]
                  : prev.length < offset.current
                  ? [...prev, data]
                  : [...prev];
              });
            }
          } else {
            settype((prev) => {
              return prev.find((t) => t.id === data.id)
                ? [...prev]
                : prev.length < offset.current
                ? [...prev, data]
                : [...prev];
            });
          }
        });
      }

      if (dataAllSearch.length == 0) {
        dataQuery.type.map(async (t) => {
          const { data } = await axios.get(
            `https://pokeapi.co/api/v2/type/${t}`
          );
          await data.pokemon.map(async (d) => {
            const { data } = await axios.get(d.pokemon.url);
            if (data.is_default) {
              if (dataAllSearch.length == 0 && dataQuery.attr.length == 0) {
                setdataAllSearch((prev) => {
                  return [...prev, data];
                });
              }

              if (dataQuery.type.length == 2) {
                if (
                  data.types.find((element) =>
                    element.type.name.includes(dataQuery.type[0])
                  ) &&
                  data.types.find((element) =>
                    element.type.name.includes(dataQuery.type[1])
                  )
                ) {
                  if (dataAllSearch.length == 0 && dataQuery.attr.length > 0) {
                    setdataAllSearch((prev) => {
                      return [...prev, data];
                    });
                  } else {
                    settype((prev) => {
                      return prev.find((t) => t.name === d.name)
                        ? [...prev]
                        : prev.length < offset.current
                        ? [...prev, data]
                        : [...prev];
                    });
                  }
                }
              } else {
                if (dataAllSearch.length == 0 && dataQuery.attr.length > 0) {
                  setdataAllSearch((prev) => {
                    return [...prev, data];
                  });
                } else {
                  settype((prev) => {
                    return prev.find((t) => t.name === d.name)
                      ? [...prev]
                      : prev.length < offset.current
                      ? [...prev, data]
                      : [...prev];
                  });
                }
              }
            }
          });
        });
      }
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
      // else if (
      //   dataQuery.type.length > 0 &&
      //   (dataQuery.q || dataQuery.gen.length > 0)
      // ) {
      //   type.map(async (d) => {
      //     const { data } = await axios.get(
      //       `https://pokeapi.co/api/v2/pokemon-species/${d.id}`
      //     );
      //     dataQuery.attr.map(async (r) => {
      //       if (r === "baby") {
      //         if (data.is_baby) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "legendary") {
      //         if (data.is_legendary) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "mythical") {
      //         if (data.is_mythical) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "has-gmax") {
      //         data.varieties.map(async (Variants) => {
      //           if (Variants.pokemon.name.includes("gmax")) {
      //             setattr((prev) => {
      //               return prev.find((t) => t.id === d.id)
      //                 ? [...prev]
      //                 : [...prev, d];
      //             });
      //           }
      //         });
      //       } else if (r === "has-mega") {
      //         data.varieties.map(async (Variants) => {
      //           if (Variants.pokemon.name.includes("mega")) {
      //             setattr((prev) => {
      //               return prev.find((t) => t.id === d.id)
      //                 ? [...prev]
      //                 : [...prev, d];
      //             });
      //           }
      //         });
      //       }
      //     });
      //   });
      // } else if (dataQuery.q || dataQuery.gen.length > 0) {
      //   search.map(async (d) => {
      //     const { data } = await axios.get(
      //       `https://pokeapi.co/api/v2/pokemon-species/${d.id}`
      //     );
      //     dataQuery.attr.map(async (r) => {
      //       if (r === "baby") {
      //         if (data.is_baby) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "legendary") {
      //         if (data.is_legendary) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "mythical") {
      //         if (data.is_mythical) {
      //           setattr((prev) => {
      //             return prev.find((t) => t.id === d.id)
      //               ? [...prev]
      //               : [...prev, d];
      //           });
      //         }
      //       } else if (r === "has-gmax") {
      //         data.varieties.map(async (Variants) => {
      //           if (Variants.pokemon.name.includes("gmax")) {
      //             setattr((prev) => {
      //               return prev.find((t) => t.id === d.id)
      //                 ? [...prev]
      //                 : [...prev, d];
      //             });
      //           }
      //         });
      //       } else if (r === "has-mega") {
      //         data.varieties.map(async (Variants) => {
      //           if (Variants.pokemon.name.includes("mega")) {
      //             setattr((prev) => {
      //               return prev.find((t) => t.id === d.id)
      //                 ? [...prev]
      //                 : [...prev, d];
      //             });
      //           }
      //         });
      //       }
      //     });
      //   });
      // }
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

    if (query == undefined) {
      fetchPokemon();
    }
  }, [query]);

  useEffect(() => {
    searchPokemon();
    console.log(dataQuery);
  }, [dataQuery]);

  useEffect(() => {
    if (
      query !== undefined &&
      search.length == 0 &&
      dataQuery.q == "" &&
      dataQuery.gen.length == 0 &&
      dataQuery.type.length == 0 &&
      dataQuery.attr.length == 0
    ) {
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
    console.log(search, "this search ing by name and gen", dataAllSearch);
  }, [search, dataAllSearch]);

  useEffect(() => {
    setTimeout(() => {
      if (dataQuery.type.length > 0 && dataQuery.attr.length > 0) {
        searchByAttr();
      }
    }, 1500);
    console.log(type, "this by type pokemon");
  }, [type]);

  useEffect(() => {
    console.log(attr, "this by attr rare");
  }, [attr]);

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
