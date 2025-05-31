import React from 'react';
import { Spinner, Typography } from "@material-tailwind/react";

interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = "Loading...",
    size = "lg",
    className = ""
}) => {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-12 w-12", 
        lg: "h-16 w-16"
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-xl"
    };

    return (
        <div className={`flex flex-col items-center justify-center min-h-[500px] w-full ${className}`}>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <Spinner className={`${sizeClasses[size]} text-purple-600 relative z-10`} />
            </div>
            <Typography className={`mt-6 ${textSizes[size]} font-medium text-gray-700 dark:text-gray-200 animate-pulse`}>
                {message}
            </Typography>
            <div className="flex space-x-1 mt-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    );
};
