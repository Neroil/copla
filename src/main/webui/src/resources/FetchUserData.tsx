// FetchUserData.tsx
import { useState, useEffect, useCallback } from 'react';

// Define SocialProfile if it's not globally available or imported
// For simplicity, assuming it might be similar to UserProfile's version
interface SocialProfile {
    platform: string;
    username: string;
    profileUrl: string;
    isVerified: boolean;
}

// Define the User type based on UserData in UserProfile.tsx
interface User {
    id: number; // Matching UserData in UserProfile
    name: string;
    email?: string;
    timeCreated?: string;
    profilePicPath?: string;
    socialProfiles?: SocialProfile[];
}

export const useFetchUserData = (initialUserId?: string) => {
    const [userId, setUserId] = useState<string | undefined>(initialUserId);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const fetchDataInternal = useCallback(async (idToFetch: string) => {
        setLoading(true);
        setError(null);
        setUser(null); // Clear previous user data while fetching new
        setIsCurrentUser(false);

        try {
            const response = await fetch(`/api/users/${idToFetch}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `User not found or server error (${response.status})` }));
                throw new Error(errorData.message);
            }
            const userData: User = await response.json();
            setUser(userData);

            // Check if this user is the currently logged-in user
            try {
                const currentUserResponse = await fetch('/api/users/me');
                if (currentUserResponse.ok) {
                    const currentUserData = await currentUserResponse.json();
                    setIsCurrentUser(currentUserData.username === userData.name);
                } else {
                     console.warn('Could not fetch current user data to determine if profile is current user.');
                }
            } catch (meError) {
                console.warn('Error fetching /api/users/me:', meError);
            }

        } catch (err: any) {
            setError(err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies, as idToFetch is passed directly

    // Effect to fetch data when userId (managed by setTargetUserId) changes
    useEffect(() => {
        if (userId) {
            fetchDataInternal(userId);
        } else {
            // Clear data if userId becomes undefined/null
            setUser(null);
            setError(null);
            setIsCurrentUser(false);
            setLoading(false);
        }
    }, [userId, fetchDataInternal]);

    // Function to explicitly set which user's data to fetch
    const setTargetUserId = useCallback((newUserId: string | undefined) => {
        setUserId(newUserId);
    }, []);

    // Function to manually refetch data for the current targetUserId
    const refetch = useCallback(() => {
        if (userId) {
            fetchDataInternal(userId);
        }
    }, [userId, fetchDataInternal]);

    return {
        user,
        loading,
        error,
        isCurrentUser,
        setUserId: setTargetUserId, 
        fetchData: refetch,      
    };
};