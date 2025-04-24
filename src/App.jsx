import { Menu, MenuButton, MenuItem, MenuItems, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import Navbar from "./components/Navbar";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useParams } from "react-router-dom";
import useSearchPokemon from "./hook/useSearchPokemon";

const genList = [1, 2, 3, 4, 5, 6]

function App() {
  const { query } = useParams();
  const [count, setCount] = useState(0);
  const [selectedgen, setSelectedgen] = useState([]);
  const scrollContainer = useRef();
  const [toBottom, settoBottom] = useState(false);
  const [scrollTop, setscrollTop] = useState(0);
  const { dataQuery, search, type, attr } = useSearchPokemon(query, toBottom);

  const handleScroll = () => {
    setscrollTop(scrollContainer.current.scrollTop);
    Math.ceil(
      scrollContainer.current.scrollTop + scrollContainer.current.clientHeight
    ) >= scrollContainer.current.scrollHeight
      ? settoBottom(true)
      : settoBottom(false);
  };

  useEffect(() => {
    console.log(scrollContainer.current.scrollHeight, "this scroll height");
    console.log(scrollContainer.current.scrollTop, "this scroll Top");
    console.log(
      scrollContainer.current.clientHeight + scrollContainer.current.scrollTop,
      "this client height"
    );
  }, []);
  return (
    <>
      <Navbar />
      <h1 className="text-2xl pb-3">Pokémon Species</h1>

      <div className="flex flex-wrap gap-x-2 gap-y-2.5 items-center">
        {/* Search Pokémon */}
        <label htmlFor="searchPokemon"></label>
        <input id="searchPokemon" type="search" placeholder="Search pokémon" className="rounded-md border bg-B-dark px-3 py-2" maxLength="15" />
        <div className="relative">
          <div className="fixed top-24 w-52 text-right">
            {JSON.stringify(selectedgen.join("."))}

            <Listbox value={selectedgen} onChange={setSelectedgen} multiple>
              <ListboxButton>
                Choose Gen
              </ListboxButton>
              <ListboxOptions anchor="bottom">
                {genList.map((gen, index) => (
                  <ListboxOption key={index} value={gen} className="data-focus:bg-blue-100">
                    {gen}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>

            <Menu >
              <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700" >
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>
          Edit <code>src/App.jsx</code> and save to test HMR
          <div
            ref={scrollContainer}
            onScroll={handleScroll}
            className="bg-blue-300 overflow-y-scroll h-screen"
          >
            <div class="w-64 rounded-xl bg-gradient-to-br from-green-600 to-green-800 text-white p-4 relative overflow-hidden shadow-lg">
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
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="Bulbasaur"
                class="absolute bottom-2 right-2 h-24 z-0 drop-shadow-xl" />
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
            <div className="pb-[999px]">d</div>




          </div>
        </div>
      </div>
    </>
  );
}

export default App;
