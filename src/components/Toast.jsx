import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "error":
        return "bg-red-600 border-red-500";
      case "warning":
        return "bg-yellow-600 border-yellow-500";
      default:
        return "bg-blue-600 border-blue-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${getToastStyles()} border-l-4 text-white p-4 rounded-r-md shadow-lg max-w-sm`}
      >
        <div className="flex items-center">
          <span className="text-xl mr-3">{getIcon()}</span>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-4 text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
