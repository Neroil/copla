import React, { useState, useEffect } from "react";
import { useAuthStatus } from "../resources/AuthStatus.tsx";
import { CoPlaIcon } from "./PageLayout.tsx";

// Helper: Logout function
function logout() {
    document.cookie = `quarkus-credential=; Max-Age=0;path=/`;
    document.cookie = `username=; Max-Age=0;path=/`;
    window.location.href = '/';
}

// --- Reusable Icon Components ---
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
);

// --- Reusable Theme Toggle Button Component ---
interface ThemeToggleButtonProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    className?: string;
}

const ThemeToggleButtonComponent: React.FC<ThemeToggleButtonProps> = ({ darkMode, toggleDarkMode, className = "" }) => {
    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
            aria-label="Toggle dark mode"
        >
            {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

// --- Navigation Item Configuration ---
interface NavItemConfig {
    id: string;
    text: string;
    href?: string | ((username?: string) => string);
    onClick?: () => void;
    condition: 'always' | 'loggedIn' | 'loggedOut';
    desktopClassName: string;
    mobileClassName: string;
    isButton?: boolean;
    isGradient?: boolean;
}

const COMMON_GRADIENT_CLASSES = "bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 hover:from-purple-600 hover:via-indigo-600 hover:to-teal-600 dark:hover:from-purple-500 dark:hover:via-indigo-500 dark:hover:to-teal-500 text-white transition-all duration-300";

const navItemConfigsList: NavItemConfig[] = [
    {
        id: 'all-artists',
        text: 'Browse Artists',
        href: '/commissions',
        condition: 'always',
        desktopClassName: "px-5 py-2.5 rounded-full border border-indigo-500/30 dark:border-indigo-400/30 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 inline-block text-gray-800 dark:text-white font-medium",
        mobileClassName: "block px-4 py-3 rounded-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 transition-colors duration-300 font-medium",
    },
    {
        id: 'all-users',
        text: 'Users',
        href: '/users',
        condition: 'always',
        desktopClassName: "px-5 py-2.5 rounded-full border border-purple-500/30 dark:border-purple-400/30 hover:bg-purple-500/10 dark:hover:bg-purple-400/10 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 inline-block text-gray-800 dark:text-white font-medium",
        mobileClassName: "block px-4 py-3 rounded-lg hover:bg-purple-500/10 dark:hover:bg-purple-400/10 transition-colors duration-300 font-medium",
    },
    {
        id: 'my-profile',
        text: 'My Profile',
        href: (username?: string) => `/users/${username || ''}`,
        condition: 'loggedIn',
        desktopClassName: "px-5 py-2.5 rounded-full border border-teal-500/30 dark:border-teal-400/30 hover:bg-teal-500/10 dark:hover:bg-teal-400/10 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 inline-block text-gray-800 dark:text-white font-medium",
        mobileClassName: "block px-4 py-3 rounded-lg hover:bg-teal-500/10 dark:hover:bg-teal-400/10 transition-colors duration-300 font-medium",
    },
    {
        id: 'sign-out',
        text: 'Sign Out',
        onClick: logout,
        condition: 'loggedIn',
        isButton: true,
        desktopClassName: "px-5 py-2.5 rounded-full border border-red-500/30 dark:border-red-400/30 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:border-red-500 dark:hover:border-red-400 transition-all duration-300 text-red-600 dark:text-red-400 font-medium",
        mobileClassName: "w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 font-medium",
    },
    {
        id: 'sign-in',
        text: 'Sign In',
        href: '/login',
        condition: 'loggedOut',
        isGradient: true,
        desktopClassName: "px-6 py-2.5 rounded-full inline-block font-semibold shadow-md hover:shadow-lg transform hover:scale-105",
        mobileClassName: "block px-4 py-3 rounded-lg font-semibold",
    },
    {
        id: 'get-started',
        text: 'Get Started',
        href: '/register',
        condition: 'loggedOut',
        desktopClassName: "px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 inline-block text-gray-800 dark:text-white font-medium",
        mobileClassName: "block px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 font-medium border border-gray-300 dark:border-gray-600",
    }
];

// --- Reusable Navigation Link Renderer Component ---
interface NavLinkProps {
    item: NavItemConfig;
    isMobile: boolean;
    username?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isMobile, username }) => {
    const className = `${isMobile ? item.mobileClassName : item.desktopClassName} ${item.isGradient ? COMMON_GRADIENT_CLASSES : ''}`;

    const hrefValue = typeof item.href === 'function' ? item.href(username) : item.href;

    if (item.isButton) {
        return (
            <button onClick={item.onClick} className={className}>
                {item.text}
            </button>
        );
    }
    return (
        <a href={hrefValue} className={className}>
            {item.text}
        </a>
    );
};


function Header() {
    const { username, isLoggedIn } = useAuthStatus();
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', newMode ? 'true' : 'false');
    };

    useEffect(() => {
        const storedPreference = localStorage.getItem('darkMode');
        if (storedPreference !== null) {
            const storedDarkMode = storedPreference === 'true';
            setDarkMode(storedDarkMode);
            if (storedDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } else {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDarkMode);
            if (prefersDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('darkMode', prefersDarkMode ? 'true' : 'false');
        }
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => { // More specific type for event
            if (menuOpen && !(e.target as HTMLElement).closest(".mobile-menu-container")) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    const currentNavItems = navItemConfigsList
        .filter(item => {
            if (item.condition === 'always') return true;
            if (item.condition === 'loggedIn' && isLoggedIn) return true;
            if (item.condition === 'loggedOut' && !isLoggedIn) return true;
            return false;
        });

    return (
        <header className="sticky top-0 z-50">
            <div className="backdrop-blur-xl bg-white/90 dark:bg-black/80 text-gray-800 dark:text-white shadow-lg border-b border-gray-200/20 dark:border-gray-700/20 transition-colors duration-300">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <a
                            href="/"
                            className="group flex items-center gap-3 text-2xl font-bold tracking-tight"
                        >
                            <CoPlaIcon className="w-9 h-9 text-purple-600 dark:text-purple-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent transition-colors duration-300">
                                CoPla
                            </span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-4">
                            <ul className="flex items-center space-x-3">
                                {currentNavItems.map(item => (
                                    <li key={item.id}>
                                        <NavLink item={item} isMobile={false} username={username || undefined} />
                                    </li>
                                ))}
                            </ul>
                            <div className="ml-3 pl-3 border-l border-gray-300 dark:border-gray-600">
                                <ThemeToggleButtonComponent 
                                    darkMode={darkMode} 
                                    toggleDarkMode={toggleDarkMode} 
                                    className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                                />
                            </div>
                        </nav>

                        <div className="flex items-center space-x-3 md:hidden">
                            <ThemeToggleButtonComponent 
                                darkMode={darkMode} 
                                toggleDarkMode={toggleDarkMode}
                                className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                            />
                            <button
                                className="text-gray-800 dark:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    {menuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden mobile-menu-container">
                    <nav className="bg-white/95 dark:bg-black/95 backdrop-blur-xl text-gray-800 dark:text-white p-6 shadow-xl border-b border-gray-200/20 dark:border-gray-700/20 transition-colors duration-300">
                        <ul className="flex flex-col space-y-4">
                            {currentNavItems.map(item => (
                                <li key={item.id}>
                                    <NavLink item={item} isMobile={true} username={username || undefined} />
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}

export { Header };