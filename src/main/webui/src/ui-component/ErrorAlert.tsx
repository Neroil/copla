import React from 'react';
import { Alert, Typography } from "@material-tailwind/react";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
    title?: string;
    message: string;
    className?: string;
    children?: React.ReactNode;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
    title = "Oops! Something went wrong",
    message,
    className = "",
    children
}) => {
    return (
        <div className={`bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 mb-8 shadow-lg ${className}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
                    </div>
                </div>
                <div className="ml-4 flex-1">
                    <Typography variant="h6" className="text-red-800 dark:text-red-200 font-semibold">
                        {title}
                    </Typography>
                    <Typography className="text-red-700 dark:text-red-300 mt-1">
                        {message}
                    </Typography>
                    {children}
                </div>
            </div>
        </div>
    );
};
