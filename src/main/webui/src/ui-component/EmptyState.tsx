import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = ""
}) => {
    return (
        <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-16 text-center border border-purple-200 dark:border-purple-700/50 ${className}`}>
            <div className="flex flex-col items-center justify-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                    {Icon ? (
                        <Icon className="w-24 h-24 text-purple-300 dark:text-purple-600 relative z-10" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-purple-300 dark:text-purple-600 relative z-10">
                            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                        </svg>
                    )}
                </div>

                <Typography variant="h3" className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                    {title}
                </Typography>
                <Typography variant="lead" className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                    {description}
                </Typography>

                {actionLabel && onAction && (
                    <Button
                        variant="gradient"
                        color="primary"
                        size="lg"
                        className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                        onClick={onAction}
                    >
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};
