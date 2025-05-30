import React from 'react';
import { Typography, Input } from "@material-tailwind/react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    icon: Icon,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    children
}) => {
    return (
        <div className="mb-12 w-full">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    {Icon && <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
                    <Typography variant="h2" className="font-bold text-gray-900 dark:text-white">
                        {title}
                    </Typography>
                </div>
                {subtitle && (
                    <Typography variant="lead" className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {subtitle}
                    </Typography>
                )}
            </div>

            {/* Search Bar */}
            {searchPlaceholder && (
                <div className="relative w-full max-w-4xl mx-auto mb-8">
                    <div className="relative group">
                        <Input
                            placeholder={searchPlaceholder}
                            size="lg"
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="!border-2 !border-purple-200 dark:!border-purple-700/50 focus:!border-purple-500 dark:focus:!border-purple-400 shadow-xl pl-12 pr-4 py-4 text-lg rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl dark:text-gray-100"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-purple-400 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors">
                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                </div>
            )}

            {children}
        </div>
    );
};
