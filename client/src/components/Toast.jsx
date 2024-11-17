import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const toastIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
};

const toastStyles = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const Toast = ({ message, type = "info", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`flex items-center p-4 rounded-lg border shadow-lg ${toastStyles[type]}`}
        >
            <div className="flex items-center">
                <span className="mr-2">{toastIcons[type]}</span>
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={onClose}
                className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
