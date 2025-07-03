import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/16/solid";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingState from "./components/LoadingState";
import PokemonSkeleton from "./components/PokemonSkeleton";
import Toast from "./components/Toast";
import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import { useNavigate, useParams } from "react-router-dom";
import useSearchPokemon from "./hook/useSearchPokemon";
import useErrorHandler from "./hooks/useErrorHandler";

const genList = [
  { g: 1, a: "I" },
  { g: 2, a: "II" },
  { g: 3, a: "III" },
  { g: 4, a: "IV" },
  { g: 5, a: "V" },
  { g: 6, a: "V1" },
  { g: 7, a: "VII" },
  { g: 8, a: "VIII" },
  { g: 9, a: "IX" },
];

// Add type list for Pokemon type selection
const typeList = [
  { id: "normal", name: "Normal", color: "bg-gray-400" },
  { id: "fire", name: "Fire", color: "bg-red-500" },
  { id: "water", name: "Water", color: "bg-blue-500" },
  { id: "electric", name: "Electric", color: "bg-yellow-400" },
  { id: "grass", name: "Grass", color: "bg-green-500" },
  { id: "ice", name: "Ice", color: "bg-blue-300" },
  { id: "fighting", name: "Fighting", color: "bg-red-700" },
  { id: "poison", name: "Poison", color: "bg-purple-500" },
  { id: "ground", name: "Ground", color: "bg-yellow-600" },
  { id: "flying", name: "Flying", color: "bg-indigo-400" },
  { id: "psychic", name: "Psychic", color: "bg-pink-500" },
  { id: "bug", name: "Bug", color: "bg-green-400" },
  { id: "rock", name: "Rock", color: "bg-yellow-800" },
  { id: "ghost", name: "Ghost", color: "bg-purple-700" },
  { id: "dragon", name: "Dragon", color: "bg-indigo-700" },
  { id: "dark", name: "Dark", color: "bg-gray-800" },
  { id: "steel", name: "Steel", color: "bg-gray-600" },
  { id: "fairy", name: "Fairy", color: "bg-pink-300" },
];

function App() {
  const { query } = useParams();
  const queryNavigate = useRef("");
  const [searchPokemon, setsearchPokemon] = useState("");
  const [selectedgen, setSelectedgen] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const scrollContainer = useRef();
  const [toBottom, settoBottom] = useState(false);
  const { dataQuery, search, type, attr } = useSearchPokemon(query, toBottom);
  const [loopUse, setloopUse] = useState({
    search: false,
    type: false,
    attr: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { error, handleError, clearError } = useErrorHandler();

  // Show toast notification
  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  // Handle search errors
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  // Sync selectedTypes with URL parameters
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams(query);
      const typeParam = params.get("type");
      if (typeParam) {
        const types = typeParam.split(".");
        setSelectedTypes(types);
      } else {
        setSelectedTypes([]);
      }

      const genParam = params.get("gen");
      if (genParam) {
        const gens = genParam.split(".").map(Number);
        setSelectedgen(gens);
      } else {
        setSelectedgen([]);
      }

      const searchParam = params.get("q");
      if (searchParam && searchParam !== searchPokemon) {
        setsearchPokemon(searchParam);
      }
    } else {
      setSelectedTypes([]);
      setSelectedgen([]);
      if (searchPokemon !== "") {
        setsearchPokemon("");
      }
    }
  }, [query]);

  // Initialize queryNavigate.current on component mount
  useEffect(() => {
    const currentParams = new URLSearchParams(
      window.location.search.substring(1)
    );
    queryNavigate.current = currentParams.toString();
  }, []);

  useEffect(() => {
    if (searchPokemon == "") {
      setsearchPokemon(dataQuery.q);
    }
  }, [dataQuery]);

  useEffect(() => {
    setloopUse({
      search: false,
      type: false,
      attr: false,
    });

    if (dataQuery.attr.length > 0) {
      setloopUse((prev) => {
        return {
          ...prev,
          attr: true,
        };
      });
    } else if (dataQuery.type.length > 0) {
      setloopUse((prev) => {
        return {
          ...prev,
          type: true,
        };
      });
    } else if (
      dataQuery.q.length > 0 ||
      dataQuery.gen.length > 0 ||
      (dataQuery.q == "" &&
        dataQuery.gen.length == 0 &&
        dataQuery.type.length == 0 &&
        dataQuery.attr.length == 0)
    ) {
      setloopUse((prev) => {
        return {
          ...prev,
          search: true,
        };
      });
    }
  }, [dataQuery]);

  const navigate = useNavigate();

  const handleScroll = () => {
    Math.ceil(
      scrollContainer.current.scrollTop + scrollContainer.current.clientHeight
    ) >= scrollContainer.current.scrollHeight
      ? settoBottom(true)
      : settoBottom(false);
  };

  // Unified query update function to handle all parameters
  const updateQuery = useCallback(
    (updates) => {
      const currentParams = new URLSearchParams(queryNavigate.current);

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          currentParams.delete(key);
        } else {
          if (Array.isArray(value)) {
            if (key === "gen") {
              currentParams.set(key, convertGenToRefString(value));
            } else if (key === "type") {
              currentParams.set(key, convertTypeToRefString(value));
            } else {
              currentParams.set(key, value.join("."));
            }
          } else {
            currentParams.set(key, value);
          }
        }
      });

      queryNavigate.current = currentParams.toString();
      const url = queryNavigate.current ? `/${queryNavigate.current}` : "/";
      navigate(url);
    },
    [navigate]
  );

  useEffect(() => {
    const navigasiQuery = () => {
      setTimeout(() => {
        updateQuery({ q: searchPokemon });
      }, 2000);
    };
    navigasiQuery();
  }, [searchPokemon, updateQuery]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeDropdownRef = useRef(null);

  function convertGenToRefString(gens) {
    return gens.sort((a, b) => a - b).join(".");
  }

  // Add type conversion function (similar to convertGenToRefString)
  function convertTypeToRefString(types) {
    return types.sort().join(".");
  }

  // Add type query navigation function (similar to updateGenQuery)
  const updateTypeQuery = useCallback(
    (selectedTypes) => {
      updateQuery({ type: selectedTypes });
    },
    [updateQuery]
  );

  useEffect(() => {
    const updateGenQuery = (selectedGen) => {
      updateQuery({ gen: selectedGen });
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // Update queryNavigate.current with current URL params first
        const currentParams = new URLSearchParams(
          window.location.search.substring(1)
        );
        queryNavigate.current = currentParams.toString();

        updateGenQuery(selectedgen);
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, selectedgen, updateQuery]);

  // Add type selection handler useEffect
  useEffect(() => {
    const handleTypeClickOutside = (e) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target)
      ) {
        // Update queryNavigate.current with current URL params first
        const currentParams = new URLSearchParams(
          window.location.search.substring(1)
        );
        queryNavigate.current = currentParams.toString();

        updateTypeQuery(selectedTypes);
        setIsTypeOpen(false);
      }
    };
    if (isTypeOpen) {
      document.addEventListener("mousedown", handleTypeClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleTypeClickOutside);
    };
  }, [isTypeOpen, selectedTypes, updateTypeQuery]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ErrorBoundary>
      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="overflow-y-scroll h-screen bg-gray-900"
      >
        <Navbar />
        <div className="container mx-auto h-fit bg-gray-900 px-12 pt-6">
          <h1 className="text-2xl pb-3 font-bold text-white">
            Pokémon Species
          </h1>

          <div className="flex flex-wrap gap-x-2 gap-y-2.5 items-center">
            {/* Search Pokémon */}
            <input
              id="searchPokemon"
              type="search"
              placeholder="Search pokémon"
              className="rounded-md border bg-B-dark px-3 py-2 bg-gray-800 text-white placeholder:text-white"
              maxLength="15"
              value={searchPokemon}
              onChange={(e) => setsearchPokemon(e.target.value)}
            />

            {/* Generation Selector */}
            <Listbox value={selectedgen} onChange={setSelectedgen} multiple>
              <ListboxButton
                onClick={toggleDropdown}
                className="text-white bg-gray-800 px-4 py-2 rounded-md text-base flex justify-between items-center w-48 shadow-md hover:bg-gray-700 transition"
              >
                Any generations
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              </ListboxButton>
              <ListboxOptions
                ref={dropdownRef}
                anchor="bottom"
                className="fixed mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 focus:outline-none"
              >
                {genList.map((gen, index) => (
                  <ListboxOption
                    key={index}
                    value={gen.g}
                    className="flex items-center px-3 py-2 text-white text-base cursor-pointer hover:bg-gray-700 data-[focus]:bg-gray-700"
                  >
                    {selectedgen.includes(gen.g) && (
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    )}
                    <span
                      className={` ${
                        selectedgen.includes(gen.g) ? "" : "ml-5"
                      }`}
                    >
                      Gen {gen.a}
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>

            {/* Type Selector */}
            <div className="relative">
              <Listbox
                value={selectedTypes}
                onChange={(newTypes) => {
                  // Limit to maximum 2 types
                  if (newTypes.length <= 2) {
                    setSelectedTypes(newTypes);
                  } else {
                    // Show toast notification when trying to select more than 2 types
                    showToast(
                      "You can only select up to 2 types at once",
                      "warning"
                    );
                  }
                }}
                multiple
              >
                <ListboxButton
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="text-white bg-gray-800 px-4 py-2 rounded-md text-base flex justify-between items-center w-48 shadow-md hover:bg-gray-700 transition"
                >
                  <span>
                    {selectedTypes.length > 0
                      ? `${selectedTypes.length}/2 type${
                          selectedTypes.length > 1 ? "s" : ""
                        }`
                      : "Any types"}
                  </span>
                  <ChevronDownIcon className="w-5 h-5 ml-2" />
                </ListboxButton>
                <ListboxOptions
                  ref={typeDropdownRef}
                  anchor="bottom"
                  className="fixed mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-10 focus:outline-none max-h-60 overflow-y-auto"
                >
                  {typeList.map((type) => (
                    <ListboxOption
                      key={type.id}
                      value={type.id}
                      className={`flex items-center px-3 py-2 text-white text-base cursor-pointer hover:bg-gray-700 data-[focus]:bg-gray-700 ${
                        selectedTypes.length >= 2 &&
                        !selectedTypes.includes(type.id)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={
                        selectedTypes.length >= 2 &&
                        !selectedTypes.includes(type.id)
                      }
                    >
                      {selectedTypes.includes(type.id) && (
                        <CheckIcon className="w-5 h-5 text-green-600" />
                      )}
                      <span
                        className={`flex items-center ${
                          selectedTypes.includes(type.id) ? "" : "ml-5"
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full mr-2 ${type.color}`}
                        ></span>
                        {type.name}
                      </span>
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>
              {/* Hint text */}
              <div className="absolute top-full mt-1 text-xs text-gray-400 whitespace-nowrap">
                Max 2 types can be selected
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <LoadingState
              isLoading={isLoading}
              message="Searching for Pokemon..."
            />
          )}

          {/* Results Grid */}
          <div className="pt-12 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {/* Loading Skeleton */}
            {isLoading && <PokemonSkeleton />}

            {/* Attribute Results */}
            {loopUse.attr && (
              <>
                {attr.map((data, i) => {
                  // Get type colors dynamically
                  const getTypeColor = (typeName) => {
                    const typeObj = typeList.find((t) => t.id === typeName);
                    return typeObj ? typeObj.color : "bg-gray-500";
                  };

                  // Create gradient based on Pokemon types
                  const primaryType = data.types[0]?.type.name;
                  const secondaryType = data.types[1]?.type.name;
                  const primaryColor = getTypeColor(primaryType);
                  const secondaryColor = secondaryType
                    ? getTypeColor(secondaryType)
                    : primaryColor;

                  return (
                    <div
                      key={i}
                      className={`w-full rounded-xl bg-gradient-to-br from-${primaryColor.replace(
                        "bg-",
                        ""
                      )} to-${secondaryColor.replace(
                        "bg-",
                        ""
                      )} text-white p-4 relative overflow-hidden shadow-lg`}
                    >
                      {/* Background Pokéball watermark */}
                      <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                        ⬤
                      </div>
                      {/* Pokémon Name and Number */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold capitalize">
                          {data.name}
                        </h2>
                        <p className="text-sm text-gray-200">
                          #{String(data.id).padStart(4, "0")}
                        </p>
                        <p className="italic text-sm text-gray-300 mt-1">
                          {data.types.map((ty, index) => (
                            <span key={index} className="capitalize">
                              {ty.type.name}
                              {index < data.types.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>

                        {/* Type icons */}
                        <div className="flex space-x-2 mt-2">
                          {data.types.map((ty, index) => (
                            <span
                              key={index}
                              className={`w-4 h-4 rounded-full ${getTypeColor(
                                ty.type.name
                              )}`}
                            ></span>
                          ))}
                        </div>
                      </div>
                      {/* Pokémon Image */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                        alt={data.name}
                        className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </>
            )}

            {/* Type Results */}
            {loopUse.type && (
              <>
                {type.map((data, i) => {
                  // Get type colors dynamically
                  const getTypeColor = (typeName) => {
                    const typeObj = typeList.find((t) => t.id === typeName);
                    return typeObj ? typeObj.color : "bg-gray-500";
                  };

                  // Create gradient based on Pokemon types
                  const primaryType = data.types[0]?.type.name;
                  const secondaryType = data.types[1]?.type.name;
                  const primaryColor = getTypeColor(primaryType);
                  const secondaryColor = secondaryType
                    ? getTypeColor(secondaryType)
                    : primaryColor;

                  return (
                    <div
                      key={i}
                      className={`w-full rounded-xl bg-gradient-to-br from-${primaryColor.replace(
                        "bg-",
                        ""
                      )} to-${secondaryColor.replace(
                        "bg-",
                        ""
                      )} text-white p-4 relative overflow-hidden shadow-lg`}
                    >
                      {/* Background Pokéball watermark */}
                      <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                        ⬤
                      </div>
                      {/* Pokémon Name and Number */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold capitalize">
                          {data.name}
                        </h2>
                        <p className="text-sm text-gray-200">
                          #{String(data.id).padStart(4, "0")}
                        </p>
                        <p className="italic text-sm text-gray-300 mt-1">
                          {data.types.map((ty, index) => (
                            <span key={index} className="capitalize">
                              {ty.type.name}
                              {index < data.types.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>

                        {/* Type icons */}
                        <div className="flex space-x-2 mt-2">
                          {data.types.map((ty, index) => (
                            <span
                              key={index}
                              className={`w-4 h-4 rounded-full ${getTypeColor(
                                ty.type.name
                              )}`}
                            ></span>
                          ))}
                        </div>
                      </div>
                      {/* Pokémon Image */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                        alt={data.name}
                        className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </>
            )}

            {/* Search Results */}
            {loopUse.search ? (
              <>
                {search.map((data) => {
                  // Get type colors dynamically
                  const getTypeColor = (typeName) => {
                    const typeObj = typeList.find((t) => t.id === typeName);
                    return typeObj ? typeObj.color : "bg-gray-500";
                  };

                  // Create gradient based on Pokemon types
                  const primaryType = data.types[0]?.type.name;
                  const secondaryType = data.types[1]?.type.name;
                  const primaryColor = getTypeColor(primaryType);
                  const secondaryColor = secondaryType
                    ? getTypeColor(secondaryType)
                    : primaryColor;

                  return (
                    <div
                      key={data.id}
                      className={`w-full rounded-xl bg-gradient-to-br from-${primaryColor.replace(
                        "bg-",
                        ""
                      )} to-${secondaryColor.replace(
                        "bg-",
                        ""
                      )} text-white p-4 relative overflow-hidden shadow-lg`}
                    >
                      {/* Background Pokéball watermark */}
                      <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                        ⬤
                      </div>
                      {/* Pokémon Name and Number */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold capitalize">
                          {data.name}
                        </h2>
                        <p className="text-sm text-gray-200">
                          #{String(data.id).padStart(4, "0")}
                        </p>
                        <p className="flex italic text-sm text-gray-300 mt-1">
                          {data.types.map((ty, i) => (
                            <span key={i} className="capitalize">
                              {ty.type.name}
                              {i < data.types.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>

                        {/* Type icons */}
                        <div className="flex space-x-2 mt-2">
                          {data.types.map((ty, index) => (
                            <span
                              key={index}
                              className={`w-4 h-4 rounded-full ${getTypeColor(
                                ty.type.name
                              )}`}
                            ></span>
                          ))}
                        </div>
                      </div>
                      {/* Pokémon Image */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                        alt={data.name}
                        className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
