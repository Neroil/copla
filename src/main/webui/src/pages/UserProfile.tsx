import { useParams } from "react-router"; // Recommended
import React, { useEffect, useState, useRef } from "react";
import {
    Avatar,
    Button,
    Typography,
    Card,
    CardBody,
    CardHeader,
    Spinner,
    Alert,
    Textarea // For Bio
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout"; // Adjust path

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
    bio?: string; // Added bio
}

// Placeholder Icons
const PhotoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 0A.75.75 0 013.25 4.5h13.5A.75.75 0 0117.5 5.25v9.5A.75.75 0 0116.75 16H3.25a.75.75 0 01-.75-.75v-9.5zm6.5 1.5a.75.75 0 00-1.5 0v4.69L7.31 9.81a.75.75 0 00-1.12.815l1.914 3.313a.75.75 0 001.274.033l2.566-4.445a.75.75 0 00-1.274-.736L9 11.31V6.75z" clipRule="evenodd" />
    </svg>
);
const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
);
const ExclamationTriangleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);


function UserProfile() {
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { userId } = useParams<{ userId: string }>();

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) {
                setError("User ID is missing.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error(`User not found or server error (${response.status})`);
                }
                const userData = await response.json();
                setUser(userData);

                const currentUserResponse = await fetch('/api/users/me'); // Assuming this returns current user info
                if (currentUserResponse.ok) {
                    const currentUserData = await currentUserResponse.json();
                    setIsCurrentUser(currentUserData.username === userData.name);
                } else {
                    // Not necessarily an error, user might not be logged in
                    console.warn('Could not fetch current user data.');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch user data.');
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
            setUploadError(null);
            const response = await fetch('/api/images/upload/profilepic', {
                method: 'POST',
                body: formData,
                // Add CSRF token header if needed by your backend
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed with status: ' + response.statusText }));
                throw new Error(errorData.message || 'Failed to upload profile picture.');
            }

            const updatedUser = await response.json();
            setUser((prevUser) => ({
                ...prevUser!,
                profilePicPath: updatedUser.url,
            }));
            if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <PageLayout isLoading={true} loadingText={`Loading ${userId}'s profile...`} contentMaxWidth="max-w-2xl"
                           children={undefined} />;
    }

    if (error || !user) {
        return (
            <PageLayout pageTitle="Profile Error" contentMaxWidth="max-w-2xl">
                <Alert color="error">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        {error || "User data could not be loaded."}
                    </div>
                </Alert>
            </PageLayout>
        );
    }

    return (
        <PageLayout pageTitle={`${user.name}'s Den`} contentMaxWidth="max-w-2xl">
            <Card className="w-full shadow-xl overflow-hidden">
                <CardHeader
                    floated={false}
                    shadow={false}
                    color="transparent"
                    className="m-0 w-full rounded-none bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <Avatar
                                size="xxl"
                                shape="circular"
                                src={user.profilePicPath || "https://avatar.iran.liara.run/public/boy?username=" + user.name}
                                alt={`${user.name}'s profile picture`}
                                className="border-4 border-white dark:border-gray-800 shadow-lg"
                            />
                            {isCurrentUser && (
                                <label
                                    htmlFor="profilePicInput"
                                    className="absolute bottom-1 right-1 bg-white dark:bg-gray-700 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group-hover:opacity-100 opacity-75"
                                >
                                    <PencilIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <input
                                        id="profilePicInput"
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicUpload}
                                        className="sr-only"
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <Typography variant="h3" className="font-bold text-white dark:text-gray-200">
                                {user.name}
                            </Typography>
                            <Typography className="font-normal text-gray-200 dark:text-gray-300">
                                {user.email}
                            </Typography>
                            <Typography className="font-normal text-sm text-gray-300 dark:text-gray-400 mt-1">
                                Joined on: {new Date(user.timeCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </Typography>
                        </div>
                    </div>
                    {isCurrentUser && uploading && (
                        <div className="mt-4 flex items-center justify-center text-white">
                            <Spinner color="secondary" className="h-4 w-4 mr-2" /> Uploading picture...
                        </div>
                    )}
                    {isCurrentUser && uploadError && (
                        <Alert color="error">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                {error || "Upload failed !"}
                            </div>
                        </Alert>
                    )}
                </CardHeader>

                <CardBody className="p-6 space-y-8">
                    {/* Bio Section - Placeholder for now or simple display */}
                    <div>
                        <Typography variant="h5" color="primary" className="mb-3 font-semibold text-[#fffff] dark:text-gray-200">
                            About Me
                        </Typography>
                        {isCurrentUser ? (
                            <Textarea
                                placeholder="Your Bio"
                                defaultValue={user.bio || ""}
                                // Add onChange and save logic here
                                rows={4}
                                className="dark:text-gray-200"
                            />
                        ) : (
                            <Typography className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {user.bio || <span className="italic text-gray-500 dark:text-gray-400">No bio provided yet.</span>}
                            </Typography>
                        )}
                        {isCurrentUser && <Button size="sm" variant="outline" color="primary" className="mt-2 text-[#fffff] dark:text-gray-200">Save Bio</Button> /* Placeholder save */}
                    </div>

                    {/* User's Commissions Section - Placeholder */}
                    <div>
                        <Typography variant="h5" color="primary" className="mb-3 font-semibold text-[#fffff] dark:text-gray-200">
                            My Commissions
                        </Typography>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                            <Typography className="text-gray-600 dark:text-gray-400">
                                {isCurrentUser ? "You haven't posted any commissions yet." : `${user.name} hasn't posted any commissions yet.`}
                            </Typography>
                            {isCurrentUser && <Button color="primary" className="mt-4 text-gray-800 dark:text-[#fffff]">Create New Commission</Button>}
                        </div>
                    </div>

                    {/* Add more sections as needed: Settings, Activity, etc. */}
                </CardBody>
            </Card>
        </PageLayout>
    );
}

export default UserProfile;