import React from "react";

const PokemonSkeleton = ({ count = 24 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full rounded-xl bg-gray-800 p-4 relative overflow-hidden shadow-lg animate-pulse"
        >
          {/* Background placeholder */}
          <div className="absolute right-2 bottom-2 opacity-10 text-[9rem] select-none pointer-events-none text-gray-600">
            ⬤
          </div>

          {/* Content skeleton */}
          <div className="relative z-10">
            {/* Name skeleton */}
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>

            {/* ID skeleton */}
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>

            {/* Type skeleton */}
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>

            {/* Type icons skeleton */}
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </div>
          </div>

          {/* Image skeleton */}
          <div className="absolute bottom-2 right-2 h-[100px] w-[100px] bg-gray-700 rounded-full"></div>
        </div>
      ))}
    </>
  );
};

export default PokemonSkeleton;
