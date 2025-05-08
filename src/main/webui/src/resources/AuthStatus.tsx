import { useState, useEffect } from 'react';

interface AuthStatus {
    loading: boolean;
    username: string | null;
    isLoggedIn: boolean;
}

export function useAuthStatus(): AuthStatus {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
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