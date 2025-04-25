import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useNavigate, useParams } from "react-router-dom";
import useSearchPokemon from "./hook/useSearchPokemon";

const genList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
        if (searchPokemon == "") {
          queryNavigate.current = "";
          navigate("/");
        } else {
          queryNavigate.current += `q=${searchPokemon}`;
          navigate(`/${queryNavigate.current}`);
        }
      }, 2000);
    };

    if (searchPokemon.length > 0) {
      navigasiQuery();
    }
  }, [searchPokemon]);

  return (
    <>
      <Navbar />
      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="overflow-y-scroll h-screen bg-gray-900 px-12 pt-6"
      >
        <h1 className="text-2xl pb-3 font-bold text-white">Pokémon Species</h1>

        <div className="flex flex-wrap gap-x-2 gap-y-2.5 items-center">
          {/* Search Pokémon */}
          <label htmlFor="searchPokemon"></label>
          <input
            id="searchPokemon"
            type="search"
            placeholder="Search pokémon"
            className="rounded-md border bg-B-dark px-3 py-2 bg-gray-800 text-white placeholder:text-white"
            maxLength="15"
            value={searchPokemon}
            onChange={(e) => setsearchPokemon(e.target.value)}
          />
          <div className="relative">
            <div className="top-24 w-52 text-right">
              {JSON.stringify(selectedgen.join("."))}

              <Listbox value={selectedgen} onChange={setSelectedgen} multiple>
                <ListboxButton className="text-white px-3 py-1 bg-gray-700 rounded-sm text-xl">
                  Choose Gen
                </ListboxButton>
                <ListboxOptions
                  anchor="bottom"
                  className="w-32 px-2 py-2 bg-gray-800"
                >
                  {genList.map((gen, index) => (
                    <ListboxOption
                      key={index}
                      value={gen}
                      className="px-1 py-1 rounded data-focus:bg-gray-900 text-white cursor-pointer"
                    >
                      Gen {gen}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Listbox>

              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
                  Any Generations
                  <ChevronDownIcon className="size-4 fill-white/60" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                      Gen I
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                      Gen II
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                      Gen III
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                      Gen IV
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <div className="pt-12 mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {loopUse.attr && (
            <div class="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg">
              {/* <!-- Background Pokéball watermark --> */}
              <div class="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                ⬤
              </div>
              {/* <!-- Pokémon Name and Number --> */}
              <div class="relative z-10">
                <h2 class="text-2xl font-bold">Bulbasaur</h2>
                <p class="text-sm text-gray-200">#0001</p>
                <p class="italic text-sm text-gray-300 mt-1">Grass, Poison</p>

                {/* <!-- Type icons --> */}
                <div class="flex space-x-2 mt-2">
                  <span class="w-4 h-4 rounded-full bg-green-400"></span>
                  <span class="w-4 h-4 rounded-full bg-purple-500"></span>
                </div>
              </div>
              {/* <!-- Pokémon Image --> */}
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                alt="Bulbasaur"
                class="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
              />
            </div>
          )}
          {loopUse.type && (
            <div class="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg">
              {/* <!-- Background Pokéball watermark --> */}
              <div class="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                ⬤
              </div>
              {/* <!-- Pokémon Name and Number --> */}
              <div class="relative z-10">
                <h2 class="text-2xl font-bold">Bulbasaur</h2>
                <p class="text-sm text-gray-200">#0001</p>
                <p class="italic text-sm text-gray-300 mt-1">Grass, Poison</p>

                {/* <!-- Type icons --> */}
                <div class="flex space-x-2 mt-2">
                  <span class="w-4 h-4 rounded-full bg-green-400"></span>
                  <span class="w-4 h-4 rounded-full bg-purple-500"></span>
                </div>
              </div>
              {/* <!-- Pokémon Image --> */}
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
                alt="Bulbasaur"
                class="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
              />
            </div>
          )}
          {loopUse.search ? (
            <>
              {search.map((data) => {
                return (
                  <div class="w-full rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg">
                    {/* <!-- Background Pokéball watermark --> */}
                    <div class="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none">
                      ⬤
                    </div>
                    {/* <!-- Pokémon Name and Number --> */}
                    <div class="relative z-10">
                      <h2 class="text-2xl font-bold">{data.name}</h2>
                      <p class="text-sm text-gray-200">#0001</p>
                      <p class="italic text-sm text-gray-300 mt-1">
                        {data.types.map((ty) => {
                          let types = "";
                          types += ` ${ty.type.name}`;
                          return <>{types}</>;
                        })}
                        {/* Grass, Poison */}
                      </p>

                      {/* <!-- Type icons --> */}
                      <div class="flex space-x-2 mt-2">
                        <span class="w-4 h-4 rounded-full bg-green-400"></span>
                        <span class="w-4 h-4 rounded-full bg-purple-500"></span>
                      </div>
                    </div>
                    {/* <!-- Pokémon Image --> */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                      alt="Bulbasaur"
                      class="absolute bottom-2 right-2 h-[100px] z-0 drop-shadow-xl"
                    />
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
