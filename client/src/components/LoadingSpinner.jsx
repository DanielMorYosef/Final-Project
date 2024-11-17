import React from "react";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
    const sizeClasses = {
        small: "h-4 w-4",
        medium: "h-8 w-8",
        large: "h-12 w-12",
    };

    return (
        <div className={`flex justify-center items-center py-8 ${className}`}>
            <div
                className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;