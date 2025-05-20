import { useState, useEffect } from 'react';

interface AuthStatus {
    loading: boolean;
    username: string | null;
    isLoggedIn: boolean;
}

export function useAuthStatus(): AuthStatus {
    
    // Check preAuth state from localStorage first
    const preAuthData = localStorage.getItem('preAuthState');
    const preAuthState = preAuthData ? JSON.parse(preAuthData) : null;

    // Initial state with cookie's values
    const [username, setUsername] = useState<string | null>((preAuthState && preAuthState.username && preAuthState.username !== '') ? preAuthState.username : null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await fetch('/api/users/me', {
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    redirect: 'manual'
                });

                if (response.ok) {
                    const data = await response.json();
                    // Handle empty string as "not logged in"
                    if (data.username && data.username !== '') {
                        setUsername(data.username);

                        // Update cookie if needed
                        const existingCookie = document.cookie.split('; ').find(row => row.startsWith('username='));
                        if (!existingCookie || existingCookie.split('=')[1] !== data.username) {
                            document.cookie = `username=${data.username}; path=/; max-age=86400; SameSite=Strict`;
                        }
                    } else {
                        // Empty string means anonymous user
                        setUsername(null);
                        // Clear invalid cookies
                        document.cookie = `username=; Max-Age=0; path=/`;
                    }
                } else {
                    console.error("Failed to fetch user:", response.statusText);
                    setUsername(null);
                    // Clear invalid cookies on error
                    document.cookie = `username=; Max-Age=0; path=/`;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUsername(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return {
        loading,
        username,
        isLoggedIn: username !== null && username !== '', // Check both null and empty string
    };
}