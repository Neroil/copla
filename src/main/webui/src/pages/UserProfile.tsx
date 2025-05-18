import {useParams} from "react-router"; // Recommended
import React, {useEffect, useRef, useState} from "react";
import {
    Alert,
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Dialog,
    Spinner,
    Textarea,
    Typography
} from "@material-tailwind/react";
import {PageLayout} from "../ui-component/PageLayout"; // Adjust path
import ManageBluesky from "../ui-component/ManageBluesky";
import BlueskyVerif from "../resources/BlueskyVerif.tsx";

interface SocialProfile {
    platform: string; // e.g., "bluesky", "twitter", "github"
    username: string; // Username or handle
    profileUrl: string; // Full URL to the profile
    isVerified: boolean;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
    bio?: string; // Added bio
    socialProfiles?: SocialProfile[]; // Added for social media links
}

const SocialVerificationBadge = ({
                                     isVerified,
                                     isCurrentUser,
                                     onVerify
                                 }: {
    isVerified: boolean;
    isCurrentUser: boolean;
    onVerify?: () => void;
}) => {
    if (isVerified) {
        return (
            <div className="flex items-center text-green-600 dark:text-green-400" title="Verified Account">
                <VerifiedIcon className="w-5 h-5 mr-1"/>
                <span className="font-medium">Verified</span>
            </div>
        );
    }
    return (
        <div className="flex items-center text-red-600 dark:text-red-400" title="Unverified Account">
            <ExclamationTriangleIcon className="w-5 h-5 mr-1"/>
            <span className="font-medium mr-2">Unverified</span>
            {isCurrentUser && (
                <Button
                    size="sm"
                    variant="outline"
                    color="error"
                    className="py-1 px-2 text-xs"
                    onClick={onVerify}
                >
                    Verify
                </Button>
            )}
        </div>
    );
};

const fetchUserData = async () => {
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

        const currentUserResponse = await fetch('/api/users/me');
        if (currentUserResponse.ok) {
            const currentUserData = await currentUserResponse.json();
            setIsCurrentUser(currentUserData.username === userData.name);
        }
    } catch (err: any) {
        setError(err.message || 'Failed to fetch user data.');
    } finally {
        setLoading(false);
    }
};

const getPlatformIcon = (platform: string, className: string) => {
    switch (platform.toLowerCase()) {
        case "bluesky":
            return (
                <svg
                    viewBox="0 0 600 530"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={className}
                >
                    <path
                        d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
                        fill="#1185fe"/>
                </svg>
            );
        case "twitter":
            return <PencilIcon className={className}/>;
        default:
            return <ExclamationTriangleIcon className={className}/>;
    }
};

// Define VerifiedIcon
const VerifiedIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
    </svg>
);

// Placeholder Icons
const PhotoIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd"
              d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 0A.75.75 0 013.25 4.5h13.5A.75.75 0 0117.5 5.25v9.5A.75.75 0 0116.75 16H3.25a.75.75 0 01-.75-.75v-9.5zm6.5 1.5a.75.75 0 00-1.5 0v4.69L7.31 9.81a.75.75 0 00-1.12.815l1.914 3.313a.75.75 0 001.274.033l2.566-4.445a.75.75 0 00-1.274-.736L9 11.31V6.75z"
              clipRule="evenodd"/>
    </svg>
);
const PencilIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path
            d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"/>
    </svg>
);
const ExclamationTriangleIcon = ({className}: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
         className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
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
    const [showManageSocials, setShowManageSocials] = useState(false);
    const [showBlueskyVerification, setShowBlueskyVerification] = useState(false);

    const {userId} = useParams<{ userId: string }>();

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

                const currentUserResponse = await fetch('/api/users/me');
                if (currentUserResponse.ok) {
                    const currentUserData = await currentUserResponse.json();
                    setIsCurrentUser(currentUserData.username === userData.name); // Assuming username field in current user data matches 'name'
                } else {
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
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({message: 'Upload failed with status: ' + response.statusText}));
                throw new Error(errorData.message || 'Failed to upload profile picture.');
            }

            const updatedUser = await response.json();
            setUser((prevUser) => ({
                ...prevUser!,
                profilePicPath: updatedUser.url,
            }));
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <PageLayout isLoading={true} loadingText={`Loading ${userId}'s profile...`} contentMaxWidth="max-w-2xl"
                           children={undefined}/>;
    }

    if (error || !user) {
        return (
            <PageLayout pageTitle="Profile Error" contentMaxWidth="max-w-2xl">
                <Alert color="error">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2"/>
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
                                    <PencilIcon className="w-5 h-5 text-purple-600 dark:text-purple-400"/>
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
                                Joined on: {new Date(user.timeCreated).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </Typography>
                        </div>
                    </div>
                    {isCurrentUser && uploading && (
                        <div className="mt-4 flex items-center justify-center text-white">
                            <Spinner
                                className="h-4 w-4 mr-2"/> {/* Adjusted spinner color for better visibility on gradient */}
                            Uploading picture...
                        </div>
                    )}
                    {isCurrentUser && uploadError && (
                        <Alert color="error" className="mt-4">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2"/>
                                {uploadError || "Upload failed !"}
                            </div>
                        </Alert>
                    )}
                </CardHeader>

                <CardBody className="p-6 space-y-8">
                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-[#fffff] dark:text-gray-200">
                            About Me
                        </Typography>
                        {isCurrentUser ? (
                            <Textarea
                                placeholder="Your Bio"
                                defaultValue={user.bio || ""}
                                rows={4}
                                className="dark:text-gray-200 dark:bg-gray-700/50 focus:border-purple-500"
                            />
                        ) : (
                            <Typography className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {user.bio || <span className="italic text-gray-500 dark:text-gray-400">No bio provided yet.</span>}
                            </Typography>
                        )}
                        {isCurrentUser && <Button size="sm" variant="outline"
                                                  className="mt-4 text-white dark:text-black bg-purple-600 hover:bg-purple-700 dark:bg-purple-200 dark:hover:bg-purple-500">Save
                            Bio</Button>}
                    </div>

                    {/* Social Profiles Section */}
                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-[#fffff] dark:text-gray-200">
                            Connect
                        </Typography>
                        {user.socialProfiles && user.socialProfiles.length > 0 ? (
                            <ul className="space-y-3">
                                {user.socialProfiles.map((profile) => (
                                    <li key={profile.platform}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-3">
                                            {getPlatformIcon(profile.platform, "w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0")}
                                            <div>
                                                <Typography
                                                    className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                                                    {profile.platform}
                                                </Typography>
                                                <a
                                                    href={profile.profileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                                                    title={`Visit ${user.name}'s ${profile.platform} profile`}
                                                >
                                                    {profile.username}
                                                </a>
                                            </div>
                                        </div>
                                        <SocialVerificationBadge
                                            isVerified={profile.isVerified}
                                            isCurrentUser={isCurrentUser}
                                            onVerify={() => {
                                                if (profile.platform.toLowerCase() === 'bluesky') {
                                                    setShowBlueskyVerification(true);
                                                }
                                            }}
                                        />

                                        {showBlueskyVerification && (
                                            <Dialog
                                                open={showBlueskyVerification}
                                                handler={() => setShowBlueskyVerification(false)}
                                                size="md"
                                            >
                                                <BlueskyVerif
                                                    appUsername={user.name}
                                                    onClose={() => setShowBlueskyVerification(false)}
                                                    onSuccess={(message) => {
                                                        // Show success message
                                                        alert(message);
                                                        setShowBlueskyVerification(false);

                                                        // Refresh user data to show updated verification status
                                                        fetchUserData(); // Make sure to define this function to refresh user data
                                                    }}
                                                />
                                            </Dialog>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography className="text-gray-600 dark:text-gray-400 italic">
                                {isCurrentUser ? "You haven't linked any social accounts yet." : `${user.name} hasn't linked any social accounts yet.`}
                            </Typography>
                        )}
                        {/* Add button for current user to manage social links in the future */}
                        {/* {isCurrentUser && <Button size="sm" variant="text" color="purple" className="mt-2">Manage Social Links</Button>} */}
                        {isCurrentUser && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-4 text-white dark:text-black bg-purple-600 hover:bg-purple-700 dark:bg-purple-200 dark:hover:bg-purple-500"
                                onClick={() => setShowManageSocials(true)}
                            >
                                Manage Socials
                            </Button>
                        )}

                        {/* Conditionally render the entire Dialog and its contents */}
                        {showManageSocials && (
                            <Dialog
                                open={true}
                                handler={() => setShowManageSocials(false)}

                            >
                                {user && (
                                    <ManageBluesky
                                        username={user.name}
                                        onClose={() => setShowManageSocials(false)}
                                        onSuccess={() => { /* Optionally refresh user data here */
                                        }}
                                    />
                                )}
                            </Dialog>
                        )}
                    </div>


                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-[#fffff] dark:text-gray-200">
                            My Commissions
                        </Typography>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2"/>
                            <Typography className="text-gray-600 dark:text-gray-400">
                                {isCurrentUser ? "You haven't posted any commissions yet." : `${user.name} hasn't posted any commissions yet.`}
                            </Typography>
                            {isCurrentUser && <Button
                                className="mt-4 text-white dark:text-black bg-purple-600 hover:bg-purple-700 dark:bg-purple-200 dark:hover:bg-purple-500">Create
                                New Commission</Button>}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </PageLayout>
    );
}

export default UserProfile;