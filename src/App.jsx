import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import Navbar from "./components/Navbar";
import "./App.css";

const genList = [1, 2, 3, 4, 5, 6]

function App() {
  const [count, setCount] = useState(0);
  const [selectedgen, setSelectedgen] = useState([]);

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
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
