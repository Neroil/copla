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

// Defined as a function to access username for dynamic hrefs if needed immediately,
// or it can be a const array if username is passed to NavLink component.
// For this structure, passing username to NavLink is cleaner.
const navItemConfigsList: Omit<NavItemConfig, 'href'> & { href?: string | ((username?: string) => string) }[] = [
    {
        id: 'browse',
        text: 'Browse',
        href: '/commissions',
        condition: 'always',
        desktopClassName: "px-4 py-2 rounded-full border border-purple-500/30 dark:border-purple-400/30 hover:bg-purple-500/10 dark:hover:bg-purple-400/10 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 inline-block text-gray-800 dark:text-white",
        mobileClassName: "block px-4 py-2 rounded-lg hover:bg-purple-500/10 dark:hover:bg-purple-400/10 transition-colors duration-300",
    },
    {
        id: 'artists',
        text: 'Artists',
        href: '/users',
        condition: 'always',
        desktopClassName: "px-4 py-2 rounded-full border border-indigo-500/30 dark:border-indigo-400/30 hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 inline-block text-gray-800 dark:text-white",
        mobileClassName: "block px-4 py-2 rounded-lg hover:bg-indigo-500/10 dark:hover:bg-indigo-400/10 transition-colors duration-300",
    },
    {
        id: 'my-den',
        text: 'My Den',
        href: (username?: string) => `/users/${username || ''}`, // Dynamic href based on username
        condition: 'loggedIn',
        desktopClassName: "px-4 py-2 rounded-full border border-teal-500/30 dark:border-teal-400/30 hover:bg-teal-500/10 dark:hover:bg-teal-400/10 hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 inline-block text-gray-800 dark:text-white",
        mobileClassName: "block px-4 py-2 rounded-lg hover:bg-teal-500/10 dark:hover:bg-teal-400/10 transition-colors duration-300",
    },
    {
        id: 'sign-out',
        text: 'Sign Out',
        onClick: logout,
        condition: 'loggedIn',
        isButton: true,
        isGradient: true,
        desktopClassName: "px-4 py-2 rounded-full",
        mobileClassName: "w-full text-left px-4 py-2 rounded-lg",
    },
    {
        id: 'sign-in',
        text: 'Sign In',
        href: '/login',
        condition: 'loggedOut',
        isGradient: true,
        desktopClassName: "px-4 py-2 rounded-full inline-block",
        mobileClassName: "block px-4 py-2 rounded-lg",
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
        }) as NavItemConfig[]; // Cast because filter preserves type, and href logic is handled by NavLink

    return (
        <header className="sticky top-0 z-50">
            <div className="backdrop-blur-md bg-white/80 dark:bg-black/30 text-gray-800 dark:text-white shadow-lg transition-colors duration-300">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <a
                            href="/"
                            className="group flex items-center gap-2 text-2xl font-semibold tracking-tighter"
                        >
                            <CoPlaIcon className="w-8 h-8 text-purple-500 dark:text-purple-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
                            <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-teal-400 dark:from-purple-400 dark:via-indigo-300 dark:to-teal-300 bg-clip-text text-transparent transition-colors duration-300">
                                CoPla
                            </span>
                        </a>

                        <nav className="hidden md:flex items-center space-x-3">
                            <ThemeToggleButtonComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                            <ul className="flex items-center space-x-2">
                                {currentNavItems.map(item => (
                                    <li key={item.id}>
                                        <NavLink item={item} isMobile={false} username={username || undefined} />
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="flex items-center space-x-2 md:hidden">
                            <ThemeToggleButtonComponent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                            <button
                                className="text-gray-800 dark:text-white focus:outline-none"
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
                    <nav className="bg-white/90 dark:bg-black/90 backdrop-blur-lg text-gray-800 dark:text-white p-4 shadow-lg rounded-b-lg transition-colors duration-300">
                        <ul className="flex flex-col space-y-3">
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