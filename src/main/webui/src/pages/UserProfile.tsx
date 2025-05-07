import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {Header} from "../ui-component/header.tsx";

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
}

function UserProfile() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {userId} = useParams();

    useEffect(() => {
        async function fetchUserData() {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch user data : ' + response.statusText);
                }

                const userData = await response.json();
                setUser(userData);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [userId]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header/>
            <main className="p-4 flex justify-center items-center grow w-full">
                {loading ? (
                    <div>Loading user data...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                )  : (
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
                            <p>Email: {user?.email}</p>
                            <p>Member since: {user?.timeCreated ? new Date(user.timeCreated).toLocaleDateString() : "Unknown"}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )

}

export default UserProfile;