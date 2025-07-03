import React from "react";

const LoadingState = ({ isLoading, message = "Searching Pokemon..." }) => {
  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Spinning Pokeball */}
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
      </div>
      <p className="mt-4 text-white text-lg font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
