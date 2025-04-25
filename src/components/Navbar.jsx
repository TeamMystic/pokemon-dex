import React from "react";
import TeamMystic from "../assets/TeamMystic.png";

function Navbar() {
  return (
    <header className="sticky top-0 z-[100] bg-[#1d2932] border-b border-[#262f3b]">
      <div className="mx-auto max-w-[80rem] flex items-center px-3.5 md:px-6 lg:px-8 h-16">
        <a href="/" className="flex items-center">
          <img
            src={TeamMystic}
            className="w-12 drop-shadow drop-shadow-blue-700"
          />
          <div className="-skew-x-12 *:text-white *:leading-4">
            <p>POKÉMON</p>
            <p className="font-bold">DEX</p>
          </div>
        </a>
      </div>
    </header>
  );
}

export default Navbar;
