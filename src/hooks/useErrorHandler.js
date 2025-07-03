import { useState, useCallback } from "react";

const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, customMessage) => {
    console.error("Error occurred:", error);

    let errorMessage = customMessage || "An unexpected error occurred";

    if (error.name === "AbortError") {
      return; // Don't show error for cancelled requests
    }

    if (error.message) {
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("404")) {
        errorMessage = "Pokemon not found. Please try a different search.";
      } else if (error.message.includes("500")) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }

    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryWithError = useCallback(
    async (asyncFunction, customMessage) => {
      try {
        clearError();
        return await asyncFunction();
      } catch (error) {
        handleError(error, customMessage);
        throw error;
      }
    },
    [handleError, clearError]
  );

  return {
    error,
    handleError,
    clearError,
    retryWithError,
  };
};

export default useErrorHandler;
