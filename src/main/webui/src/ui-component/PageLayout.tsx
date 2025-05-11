import React from "react";
import { Header } from "./Header"; // Adjust path if Header is elsewhere
import { Spinner } from "@material-tailwind/react"; // For a potential global loading state if needed

interface PageLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
    contentMaxWidth?: string; // e.g., "max-w-md", "max-w-lg", "max-w-2xl"
    isLoading?: boolean; // Optional global loading state for the page content
    loadingText?: string;
}

// Placeholder Icons (replace with your icon library)
const CoPlaIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path d="M6.75 2.5C7.44 2.5 8 3.06 8 3.75C8 4.44 7.44 5 6.75 5S5.5 4.44 5.5 3.75C5.5 3.06 6.06 2.5 6.75 2.5ZM4.25 5.5C4.94 5.5 5.5 6.06 5.5 6.75C5.5 7.44 4.94 8 4.25 8S3 7.44 3 6.75C3 6.06 3.56 5.5 4.25 5.5ZM9.25 5.5C9.94 5.5 10.5 6.06 10.5 6.75C10.5 7.44 9.94 8 9.25 8S8 7.44 8 6.75C8 6.06 8.56 5.5 9.25 5.5ZM12.5 10.5C11.12 10.5 10 11.62 10 13C10 14.38 11.12 15.5 12.5 15.5C13.88 15.5 15 14.38 15 13C15 11.62 13.88 10.5 12.5 10.5ZM16.08 5.68C16.08 5.68 14.63 7.12 14.63 9.23C14.63 11.04 16.09 12.5 17.91 12.5C18.74 12.5 20.64 11.54 20.19 7.95C20.19 7.95 20.19 7.94 20.19 7.93C20.12 7.54 19.73 7.3 19.34 7.37C19.34 7.37 17.42 7.8 16.91 7.23C16.4 6.67 16.08 5.68 16.08 5.68ZM16.95 15.41C16.66 14.94 16.11 14.77 15.64 15.06C15.17 15.34 15 15.9 15.29 16.37C16.69 18.61 17.87 19.16 18.65 19.37C19.07 19.47 19.5 19.19 19.6 18.78C19.7 18.37 19.42 17.95 19.01 17.84C18.43 17.68 17.51 17.23 16.95 15.41Z" />
    </svg>
);


const PageLayout: React.FC<PageLayoutProps> = ({
                                                   children,
                                                   pageTitle,
                                                   contentMaxWidth = "max-w-xl", // Default to a slightly wider card
                                                   isLoading = false,
                                                   loadingText = "Loading, please wait..."
                                               }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col transition-colors duration-300 text-gray-800 dark:text-gray-200">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 pt-10 sm:pt-12 lg:pt-16">
                {pageTitle && (
                    <div className="flex items-center gap-3 mb-8">
                        <CoPlaIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center">
                            {pageTitle}
                        </h1>
                    </div>
                )}
                <div className={`w-full ${contentMaxWidth}`}>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                            <Spinner className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{loadingText}</p>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </main>
            <footer className="py-8 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
                © {new Date().getFullYear()} CoPla - Art Commission Platform. All rights reserved.
            </footer>
        </div>
    );
};

export { PageLayout };