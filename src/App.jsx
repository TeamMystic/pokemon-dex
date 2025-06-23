import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/16/solid";
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useNavigate, useParams } from "react-router-dom";
import useSearchPokemon from "./hook/useSearchPokemon";

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

function App() {
  const { query } = useParams();
  const queryNavigate = useRef("");
  const [searchPokemon, setsearchPokemon] = useState("");
  const [selectedgen, setSelectedgen] = useState([]);
  const scrollContainer = useRef();
  const [toBottom, settoBottom] = useState(false);
  const { dataQuery, search, type, attr } = useSearchPokemon(query, toBottom);
  const [loopUse, setloopUse] = useState({
    search: false,
    type: false,
    attr: false,
  });

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

  useEffect(() => {
    const navigasiQuery = () => {
      setTimeout(() => {
        const params = new URLSearchParams(queryNavigate.current);

        if (searchPokemon !== "") {
          params.set("q", searchPokemon);
        } else {
          params.delete("q");
        }

        queryNavigate.current = params.toString();
        const url = queryNavigate.current ? `/${queryNavigate.current}` : "/";
        navigate(url);
      }, 2000);
    };
    navigasiQuery();
  }, [searchPokemon]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function convertGenToRefString(gens) {
    return gens.sort((a, b) => a - b).join(".");
  }

  useEffect(() => {
    const updateGenQuery = (selectedGen) => {
      const params = new URLSearchParams(queryNavigate.current);

      if (selectedGen.length > 0) {
        params.set("gen", convertGenToRefString(selectedGen));
      } else {
        params.delete("gen");
      }

      queryNavigate.current = params.toString();
      const url = queryNavigate.current ? `/${queryNavigate.current}` : "/";
      navigate(url);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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
  }, [isOpen, selectedgen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="overflow-y-scroll h-screen bg-gray-900"
      >
        <Navbar />
        <div className="h-fit bg-gray-900 px-12 pt-6">
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
          </div>

          <div className="pt-12 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {loopUse.attr && (
              <>
                {attr.map((data, i) => {
                  return (
                    <div
                      key={i}
                      className="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg"
                    >
                      {/* <!-- Background Pokéball watermark --> */}
                      <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                        ⬤
                      </div>
                      {/* <!-- Pokémon Name and Number --> */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold">{data.name}</h2>
                        <p className="text-sm text-gray-200">#{data.id}</p>
                        <p className="italic text-sm text-gray-300 mt-1">
                          {data.types.map((ty) => {
                            let types = "";
                            types += ` ${ty.type.name}`;
                            return <>{types}</>;
                          })}
                          {/* Grass, Poison */}
                        </p>

                        {/* <!-- Type icons --> */}
                        <div className="flex space-x-2 mt-2">
                          <span className="w-4 h-4 rounded-full bg-green-400"></span>
                          <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                        </div>
                      </div>
                      {/* <!-- Pokémon Image --> */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                        alt="Bulbasaur"
                        className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </>
            )}
            {loopUse.type && (
              <div className="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg">
                {/* <!-- Background Pokéball watermark --> */}
                <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                  ⬤
                </div>
                {/* <!-- Pokémon Name and Number --> */}
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold">Bulbasaur</h2>
                  <p className="text-sm text-gray-200">#0001</p>
                  <p className="italic text-sm text-gray-300 mt-1">
                    Grass, Poison
                  </p>

                  {/* <!-- Type icons --> */}
                  <div className="flex space-x-2 mt-2">
                    <span className="w-4 h-4 rounded-full bg-green-400"></span>
                    <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                  </div>
                </div>
                {/* <!-- Pokémon Image --> */}
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                  alt="Bulbasaur"
                  className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                />
              </div>
            )}
            {loopUse.search ? (
              <>
                {search.map((data) => {
                  return (
                    <div
                      key={data.id}
                      className="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg"
                    >
                      {/* <!-- Background Pokéball watermark --> */}
                      <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                        ⬤
                      </div>
                      {/* <!-- Pokémon Name and Number --> */}
                      <div className="relative z-10">
                        <h2 className="text-2xl font-bold">{data.name}</h2>
                        <p className="text-sm text-gray-200">#{data.id}</p>
                        <p className="flex italic text-sm text-gray-300 mt-1">
                          {data.types.map((ty, i) => {
                            let types = "";
                            types += ` ${ty.type.name}`;
                            return <span key={i}>{types}</span>;
                          })}
                        </p>

                        {/* <!-- Type icons --> */}
                        <div className="flex space-x-2 mt-2">
                          <span className="w-4 h-4 rounded-full bg-green-400"></span>
                          <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                        </div>
                      </div>
                      {/* <!-- Pokémon Image --> */}
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                        alt="Bulbasaur"
                        className="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
