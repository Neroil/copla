import React from 'react';
import { Typography } from "@material-tailwind/react";
import { User, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface UserTypeToggleProps {
    isArtist: boolean;
    setIsArtist: (isArtist: boolean) => void;
    variant?: 'register' | 'app';
}

export const UserTypeToggle: React.FC<UserTypeToggleProps> = ({ 
    isArtist, 
    setIsArtist, 
    variant = 'register' 
}) => {
    if (variant === 'register') {
        return (
            <div className="w-full">
                <div className="relative mb-4">
                    <div className="flex items-center justify-center mb-3">
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-600 to-transparent flex-1"></div>
                        <div className="px-4">
                            <Typography
                                variant="small"
                                className="text-gray-600 dark:text-gray-400 font-semibold tracking-wide uppercase text-xs flex items-center gap-2"
                            >
                                I'm joining as ...
                            </Typography>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-600 to-transparent flex-1"></div>
                    </div>
                </div>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5">
                    <motion.div
                        className="absolute top-1.5 bottom-1.5 w-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg"
                        animate={{ x: isArtist ? '100%' : '0%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    <div className="flex relative z-10">
                        <button
                            type="button"
                            onClick={() => setIsArtist(false)}
                            className={`flex-1 flex justify-center items-center py-4 px-4 rounded-xl transition-all duration-200 ${!isArtist ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <User className={`h-5 w-5 mr-3 ${!isArtist ? 'text-white' : 'text-purple-600'}`} />
                            <div className="text-left">
                                <div className="font-semibold">A Client</div>
                                <div className={`text-xs ${!isArtist ? 'text-white/80' : 'text-gray-500'}`}>
                                    Find artists
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsArtist(true)}
                            className={`flex-1 flex justify-center items-center py-4 px-4 rounded-xl transition-all duration-200 ${isArtist ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <Palette className={`h-5 w-5 mr-3 ${isArtist ? 'text-white' : 'text-purple-600'}`} />
                            <div className="text-left">
                                <div className="font-semibold">An Artist</div>
                                <div className={`text-xs ${isArtist ? 'text-white/80' : 'text-gray-500'}`}>
                                    Get commissioned
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // App variant - simplified toggle
    return null; // App variant would be different, keeping it in App.tsx for now
};
