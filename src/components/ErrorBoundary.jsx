import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Pokemon Dex Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We encountered an error while loading your Pokemon data. Please
                try refreshing the page.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Refresh Page
              </button>

              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-red-400 hover:text-red-300">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded text-sm text-red-300 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
