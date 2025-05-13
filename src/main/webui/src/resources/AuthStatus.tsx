import { useState, useEffect } from 'react';

interface AuthStatus {
    loading: boolean;
    username: string | null;
    isLoggedIn: boolean;
}

export function useAuthStatus(): AuthStatus {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        // Initial fetch
        const preAuthData = localStorage.getItem('preAuthState');
        const preAuthState = preAuthData ? JSON.parse(preAuthData) : null;

        if (preAuthState && preAuthState.username) {
            setUsername(preAuthState.username);
        }

        const fetchUser = async () => {
            //setLoading(true);
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
                    setUsername(data.username);
                    // Check if current cookie is set and alive
                    const cookie = document.cookie.split('; ').find(row => row.startsWith('username='));
                    if (cookie) {
                        const cookieValue = cookie.split('=')[1];
                        // If the cookie is already set, do nothing
                        if (cookieValue === data.username) {
                            // Do nothing
                            return;
                        } else {
                            document.cookie = `username=${data.username}; path=/; max-age=86400; SameSite=Strict`;
                        }
                    }
                } else if (response.status === 401) {
                    setUsername(null);
                } else {
                    console.error("Failed to fetch user:", response.statusText);
                    setUsername(null);
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
        isLoggedIn: username !== "",
    };
}