import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {Header} from "../ui-component/Header.tsx";
import {Avatar, Button} from "@material-tailwind/react";

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
}

function UserProfile() {
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const {userId} = useParams();

    useEffect(() => {
        async function fetchUserData() {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data: ' + response.statusText);
                }
                const userData = await response.json();
                setUser(userData);

                const currentUserResponse = await fetch('/api/users/me');
                if (!currentUserResponse.ok) {
                    throw new Error('Failed to fetch current user data: ' + currentUserResponse.statusText);
                }
                const currentUserData = await currentUserResponse.json();
                setIsCurrentUser(currentUserData.username === userData.name);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [userId]);

    const handleProfilePicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);
            console.log(file.name)
            const response = await fetch('/api/images/upload/profilepic', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile picture: ' + response.statusText);
            }

            // Refresh user data after successful upload
            const updatedUser = await response.json();
            console.log(updatedUser);
            setUser((prevUser) => ({
                ...prevUser!,
                profilePicPath: updatedUser.url, // Update the profile picture path
            }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header/>
            <main className="p-4 flex justify-center items-center grow w-full">
                {loading ? (
                    <div>Loading user data...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : (
                    <div className="w-full max-w-md">
                        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="flex gap-4 items-center mb-4">
                                <Avatar
                                    size={"xl"}
                                    shape={"rounded"}
                                    src={user?.profilePicPath || "https://avatar.iran.liara.run/public/boy"}
                                    alt="profile-picture"
                                />
                                <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
                            </div>

                            <p>Email: {user?.email}</p>
                            <p>Member since: {user?.timeCreated ? new Date(user.timeCreated).toLocaleDateString() : "Unknown"}</p>

                            {isCurrentUser&& (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Change Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicUpload}
                                        className="mt-2"
                                        disabled={uploading}
                                    />
                                    {uploading && <p>Uploading...</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default UserProfile;