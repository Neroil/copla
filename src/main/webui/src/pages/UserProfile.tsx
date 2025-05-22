// UserProfile.tsx
import { useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
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
import { PageLayout } from "../ui-component/PageLayout";
import ManageBluesky from "../ui-component/ManageBluesky";
import BlueskyVerif from "../resources/BlueskyVerif.tsx";
import { useFetchUserData } from "../resources/FetchUserData"; // Import the hook
import CustomFormButton from "../ui-component/CustomFormButton.tsx";
import { UserIcon, PaletteIcon } from "../ui-component/CustomIcons";
import { 
    useCommissionCard, 
    CommissionCard, 
    CommissionCardError, 
    CommissionCardLoading,
    CreateCommissionCard 
} from "../ui-component/CommissionCard";

// SocialProfile and UserData interfaces can be removed if they are identical to
// and imported from FetchUserData.tsx or a shared types file.
// For this example, let's assume they might have slight differences or are kept for clarity.
interface SocialProfile {
    platform: string;
    username: string;
    profileUrl: string;
    isVerified: boolean;
}

interface UserData { // This is the type expected by the component's rendering logic
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
    bio?: string;
    socialProfiles?: SocialProfile[];
    role?: string;
}


// --- Icons (VerifiedIcon, PhotoIcon, PencilIcon, ExclamationTriangleIcon, getPlatformIcon) remain the same ---
// Define VerifiedIcon
const VerifiedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
);

// Placeholder Icons
const PhotoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd"
            d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 0A.75.75 0 013.25 4.5h13.5A.75.75 0 0117.5 5.25v9.5A.75.75 0 0116.75 16H3.25a.75.75 0 01-.75-.75v-9.5zm6.5 1.5a.75.75 0 00-1.5 0v4.69L7.31 9.81a.75.75 0 00-1.12.815l1.914 3.313a.75.75 0 001.274.033l2.566-4.445a.75.75 0 00-1.274-.736L9 11.31V6.75z"
            clipRule="evenodd" />
    </svg>
);
const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path
            d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
);
const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
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
                        fill="#1185fe" />
                </svg>
            );
        case "twitter": // Example, replace with actual icon if needed
            return <PencilIcon className={className} />; // Placeholder, replace with actual Twitter/X icon
        default:
            return <ExclamationTriangleIcon className={className} />;
    }
};

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
                <VerifiedIcon className="w-5 h-5 mr-1" />
                <span className="font-medium">Verified</span>
            </div>
        );
    }
    return (
        <div className="flex items-center text-red-600 dark:text-red-400" title="Unverified Account">
            <ExclamationTriangleIcon className="w-5 h-5 mr-1" />
            <span className="font-medium mr-2">Unverified</span>
            {isCurrentUser && (
                <Button
                    size="sm"
                    variant="outline"
                    color="error" // Material Tailwind uses "red", not "error" for Button color
                    className="py-1 px-2 text-xs"
                    onClick={onVerify}
                >
                    Verify
                </Button>
            )}
        </div>
    );
};


function UserProfile() {
    const { userId: userIdFromParams } = useParams<{ userId: string }>();

    const {
        user,
        loading,
        error,
        isCurrentUser,
        setUserId: setProfileUserIdToFetch,
        fetchData: refreshUserData,
    } = useFetchUserData();

    const displayUser = user as UserData;

    const { commissionCard, loading: loadingCard, error: cardError } = useCommissionCard(
        displayUser?.role === "artist" ? displayUser.name : undefined
    );

    // Profile picture upload related states
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Manage Bluesky related states
    const [showManageSocials, setShowManageSocials] = useState(false);
    const [showBlueskyVerification, setShowBlueskyVerification] = useState(false);

    // Unlinking related states
    const [unlinkingPlatform, setUnlinkingPlatform] = useState<string | null>(null);
    const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
    const [unlinkLoading, setUnlinkLoading] = useState(false);
    const [unlinkError, setUnlinkError] = useState<string | null>(null);
    const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
    const [unlinkingUsername, setUnlinkingUsername] = useState<string | null>(null);

    // Commission card dialog state
    const [showCommissionCard, setShowCommissionCard] = useState(false);

    useEffect(() => {
        if (userIdFromParams) {
            setProfileUserIdToFetch(userIdFromParams);
        } else {
            setProfileUserIdToFetch(undefined); // Clear if no param
        }
    }, [userIdFromParams, setProfileUserIdToFetch]);

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
                // credentials: 'include', // Quarkus security might require this
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Upload failed with status: ' + response.statusText }));
                throw new Error(errorData.message || 'Failed to upload profile picture.');
            }
            // const updatedUser = await response.json(); // Backend returns updated user or just URL
            refreshUserData(); // Refresh data to get new profilePicPath from the hook
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUnlinkSocial = async (platformToUnlink: string, usernameToUnlink: string) => {
        if (platformToUnlink.toLowerCase() !== 'bluesky' || !user) return;
        setUnlinkingPlatform(platformToUnlink);
        setUnlinkingUsername(usernameToUnlink); // Add this state variable
        setShowUnlinkDialog(true);
        setUnlinkDialogOpen(true);
    };

    const confirmUnlinkSocial = async () => {
        if (!unlinkingPlatform || !unlinkingUsername || !user) return;

        try {
            setUnlinkLoading(true);
            setUnlinkError(null);

            const response = await fetch(`/api/users/${user.name}/social/${unlinkingPlatform.toLowerCase()}/${encodeURIComponent(unlinkingUsername)}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Failed to unlink ${unlinkingPlatform} account` }));
                throw new Error(errorData.message || `Failed to unlink ${unlinkingPlatform} account`);
            }

            setUnlinkDialogOpen(false);
            refreshUserData();

        } catch (err: any) {
            setUnlinkError(err.message || `An error occurred while unlinking your ${unlinkingPlatform} account`);
        } finally {
            setUnlinkLoading(false);
            setShowUnlinkDialog(false);
        }
    };

    const handleCommissionCardDelete = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/users/${user.name}/commission-card/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Failed to delete commission card` }));
                throw new Error(errorData.message || `Failed to delete commission card`);
            }

            refreshUserData();
        } catch (err: any) {
            console.error(err);
        }
    }




    if (loading && !user) { // Initial loading state for the profile
        return <PageLayout isLoading={true} loadingText={`Loading ${userIdFromParams || 'user'}'s profile...`} contentMaxWidth="max-w-2xl" children={undefined} />;
    }

    if (error && !user) { // If fetching failed and we have no user data
        return (
            <PageLayout pageTitle="Profile Error" contentMaxWidth="max-w-2xl">
                <Alert color="error" className="flex items-center"> {/* Material Tailwind uses "red" for Alert color */}
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    {error || "User data could not be loaded."}
                </Alert>
            </PageLayout>
        );
    }

    if (!user) { // If no user ID was provided or user not found but no error (e.g. hook cleared it)
        return (
            <PageLayout pageTitle="User Not Found" contentMaxWidth="max-w-2xl">
                <Alert color="info" className="flex items-center"> {/* Material Tailwind uses "amber" for warning */}
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    The user profile could not be found.
                </Alert>
            </PageLayout>
        );
    }

    // Cast user from hook (User type) to UserData if necessary, or ensure types are aligned




    return (
        <PageLayout
            pageTitle={
                <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium shadow-sm ${displayUser.role === 'artist'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-2 border-purple-300 dark:border-purple-700'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-2 border-blue-300 dark:border-blue-700'
                        }`}>
                        {displayUser.role === 'artist' ?
                            <>
                                <PaletteIcon className="w-5 h-5 mr-2" />
                                Artist
                            </> :
                            <>
                                <UserIcon className="w-5 h-5 mr-2" />
                                Client
                            </>
                        }
                    </span>
                    <span>{displayUser.name}'s Den</span>
                </div>
            }
            contentMaxWidth="max-w-2xl"
        >
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
                                // shape="circular" // Avatar is circular by default
                                src={displayUser.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${displayUser.name}`}
                                alt={`${displayUser.name}'s profile picture`}
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
                                {displayUser.name}
                            </Typography>
                            <Typography className="font-normal text-gray-200 dark:text-gray-300">
                                {displayUser.email}
                            </Typography>
                            <Typography className="font-normal text-sm text-gray-300 dark:text-gray-400 mt-1">
                                Joined on: {new Date(displayUser.timeCreated).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Typography>
                        </div>
                    </div>
                    {isCurrentUser && uploading && (
                        <div className="mt-4 flex items-center justify-center text-white">
                            <Spinner className="h-4 w-4 mr-2" />
                            Uploading picture...
                        </div>
                    )}
                    {isCurrentUser && uploadError && (
                        <Alert color="error" className="mt-4 flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            {uploadError || "Upload failed!"}
                        </Alert>
                    )}
                </CardHeader>

                <CardBody className="p-6 space-y-8">
                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-gray-900 dark:text-gray-100"> {/* Adjusted color */}
                            About Me
                        </Typography>
                        {isCurrentUser ? (
                            <Textarea
                                placeholder="Your Bio"
                                defaultValue={displayUser.bio || ""}
                                rows={4}
                                className="dark:text-gray-200 dark:bg-gray-700/50 focus:border-purple-500"
                            // onBlur={(e) => handleBioSave(e.target.value)} // Example: save on blur
                            />
                        ) : (
                            <Typography className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {displayUser.bio || <span className="italic text-gray-500 dark:text-gray-400">No bio provided yet.</span>}
                            </Typography>
                        )}
                        {isCurrentUser && <CustomFormButton isFullWidth={false}
                            className="mt-4">Save Bio</CustomFormButton>}
                    </div>

                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                            Connect
                        </Typography>
                        {displayUser.socialProfiles && displayUser.socialProfiles.length > 0 ? (
                            <ul className="space-y-3">
                                {/* Group by platform */}
                                {Object.entries(
                                    displayUser.socialProfiles.reduce((acc, profile) => {
                                        if (!acc[profile.platform]) {
                                            acc[profile.platform] = [];
                                        }
                                        acc[profile.platform].push(profile);
                                        return acc;
                                    }, {} as Record<string, SocialProfile[]>)
                                ).map(([platform, profiles]) => (
                                    <li key={platform} className="mb-6">
                                        <Typography className="font-medium text-gray-700 dark:text-gray-300 capitalize mb-2">
                                            {platform} Accounts ({profiles.length})
                                        </Typography>
                                        <div className="space-y-2">
                                            {profiles.map((profile) => (
                                                <div
                                                    key={profile.username}
                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        {getPlatformIcon(profile.platform, "w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0")}
                                                        <div>
                                                            <Typography className="text-sm text-gray-600 dark:text-gray-400">
                                                                @{profile.username}
                                                            </Typography>
                                                            <a
                                                                href={profile.profileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                                                                title={`Visit ${profile.username}'s ${profile.platform} profile`}
                                                            >
                                                                View Profile
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <SocialVerificationBadge
                                                            isVerified={profile.isVerified}
                                                            isCurrentUser={isCurrentUser}
                                                            onVerify={() => {
                                                                if (profile.platform.toLowerCase() === 'bluesky' && !profile.isVerified) {
                                                                    setShowBlueskyVerification(true);
                                                                }
                                                            }}
                                                        />
                                                        {isCurrentUser && profile.platform.toLowerCase() === 'bluesky' && (
                                                            <Button
                                                                size="sm"
                                                                color="error"
                                                                onClick={() => handleUnlinkSocial(profile.platform, profile.username)}
                                                                className="py-1 px-2 text-xs"
                                                            >
                                                                Unlink
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography className="text-gray-600 dark:text-gray-400 italic">
                                {isCurrentUser ? "You haven't linked any social accounts yet." : `${displayUser.name} hasn't linked any social accounts yet.`}
                            </Typography>
                        )}
                        {/* Unlink Confirmation Dialog */}
                        {showUnlinkDialog && displayUser && (
                            <Dialog open={unlinkDialogOpen} handler={() => setUnlinkDialogOpen(false)} size="sm">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl mt-4">
                                    <Typography variant="h5" className="flex items-center text-white">
                                        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                                        Confirm Unlink
                                    </Typography>
                                </div>
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <Typography className="text-gray-700 dark:text-gray-300 mb-3">
                                        Are you sure you want to unlink your <span className="font-semibold text-purple-600 dark:text-purple-400 capitalize">{unlinkingPlatform}</span> account?
                                    </Typography>
                                    <Typography className="text-sm text-gray-600 dark:text-gray-400">
                                        This action cannot be undone. You will need to re-link and verify your account later if you wish to reconnect it.
                                    </Typography>
                                    {unlinkError && (
                                        <Alert color="error" variant="gradient" className="mt-4 border border-red-300 shadow-sm">
                                            <div className="flex items-center">
                                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                                {unlinkError}
                                            </div>
                                        </Alert>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 p-6">
                                    <CustomFormButton
                                        isFullWidth={false}
                                        className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600 dark:text-white"
                                        onClick={() => {
                                            setUnlinkDialogOpen(false);
                                            setUnlinkError(null);
                                            setShowUnlinkDialog(false);
                                        }}
                                    >
                                        Cancel
                                    </CustomFormButton>
                                    <CustomFormButton
                                        isFullWidth={false}
                                        className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white"
                                        onClick={confirmUnlinkSocial}
                                        disabled={unlinkLoading}
                                    >
                                        {unlinkLoading ? (
                                            <div className="flex items-center justify-center">
                                                <Spinner className="h-4 w-4 mr-2" />
                                                Unlinking...
                                            </div>
                                        ) : (
                                            "Unlink"
                                        )}
                                    </CustomFormButton>
                                </div>
                            </Dialog>
                        )}
                        {isCurrentUser && (
                            <CustomFormButton
                                isFullWidth={false}
                                onClick={() => {
                                    if (showManageSocials === true) {
                                        setShowManageSocials(false); // Close if already open
                                    } else {
                                        setShowManageSocials(true);
                                    }
                                }}
                                className="mt-4"
                            >
                                Manage Socials
                            </CustomFormButton>
                        )}

                        {showManageSocials && displayUser && (
                            <Dialog
                                open={showManageSocials}
                                handler={() => setShowManageSocials(false)}
                                size="md" // ManageBluesky is max-w-md
                            >
                                <ManageBluesky
                                    username={displayUser.name}
                                    onClose={() => setShowManageSocials(false)}
                                    onSuccess={() => {
                                        refreshUserData();
                                        // ManageBluesky will call its own onClose after a timeout
                                    }}
                                />
                            </Dialog>
                        )}
                        {showBlueskyVerification && displayUser && (
                            <Dialog
                                open={showBlueskyVerification}
                                handler={() => setShowBlueskyVerification(false)}
                                size="md"
                            >
                                <BlueskyVerif
                                    appUsername={displayUser.name}
                                    onClose={() => setShowBlueskyVerification(false)}
                                    onSuccess={(message) => {
                                        alert(message); // Or use a more sophisticated notification
                                        setShowBlueskyVerification(false);
                                        refreshUserData();
                                    }}
                                />
                            </Dialog>
                        )}

                    </div>

                    {/*Commission card display */}
                    {/* Button to display commission card for artists */}
                    {displayUser.role === "artist" && (
                        <div className="mb-6">
                            <CustomFormButton
                                className="flex items-center gap-2"
                                onClick={() => setShowCommissionCard(!showCommissionCard)}
                                disabled={loadingCard}
                                isFullWidth={false}
                            >
                                <PaletteIcon className="h-5 w-5" />
                                {isCurrentUser ? "View My Commission Card" : `View ${displayUser.name}'s Commission Card`}
                            </CustomFormButton>
                        </div>
                    )}


                    {showCommissionCard && (
                        <Dialog
                            open={showCommissionCard}
                            handler={() => setShowCommissionCard(false)}
                            className="bg-transparent shadow-none"
                        >
                            <div className="max-w-4xl mx-auto w-full">
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        className="!absolute top-2 right-2 rounded-full z-10"
                                        onClick={() => setShowCommissionCard(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </Button>

                                    {loadingCard ? (
                                        <CommissionCardLoading />
                                    ) : cardError ? (
                                        <CommissionCardError message={cardError} />
                                    ) : commissionCard ? (
                                        <CommissionCard
                                            id={commissionCard.id}
                                            title={commissionCard.title}
                                            description={commissionCard.description}
                                            elements={commissionCard.elements || []}
                                            isOwner={isCurrentUser}
                                            onEdit={() => {/* Navigate to edit page */ }}
                                            onDelete={() => { handleCommissionCardDelete() }}
                                        />
                                    ) : isCurrentUser && displayUser.role === "artist" ? (
                                        <CreateCommissionCard
                                            artistName={displayUser.name}
                                            onSuccess={() => {
                                                setShowCommissionCard(false);
                                                setTimeout(() => {
                                                    // Refresh commission card data
                                                    if (typeof useCommissionCard(displayUser.name).refreshCard === 'function') {
                                                        useCommissionCard(displayUser.name).refreshCard();
                                                    }
                                                }, 500);
                                            }}
                                        />
                                    ) : (
                                        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl text-center">
                                            <Typography variant="h5" className="mb-3 text-gray-700 dark:text-gray-300">
                                                No Commission Card Available
                                            </Typography>
                                            <Typography className="text-gray-600 dark:text-gray-400">
                                                {`${displayUser.name} hasn't created a commission card yet.`}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Dialog>
                    )}


                    {/* Commissions/Portfolio display */}
                    <div>
                        <Typography variant="h5" className="mb-3 font-semibold text-gray-900 dark:text-gray-100">
                            {displayUser.role === 'artist' ? 'My Portfolio' : 'My Commissions'}
                        </Typography>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800/60 rounded-lg text-center">
                            <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                            <Typography className="text-gray-600 dark:text-gray-400">
                                {isCurrentUser ?
                                    (displayUser.role === 'artist'
                                        ? "You haven't added any artwork to your portfolio yet."
                                        : "You haven't posted any commission requests yet.") :
                                    (displayUser.role === 'artist'
                                        ? `${displayUser.name} hasn't added any artwork to their portfolio yet.`
                                        : `${displayUser.name} hasn't posted any commission requests yet.`)}
                            </Typography>
                            {isCurrentUser &&
                                <CustomFormButton
                                    isFullWidth={false}
                                    variant="solid"
                                    className="mt-4">
                                    {displayUser.role === 'artist' ? 'Add Artwork to Portfolio' : 'Create New Commission'}
                                </CustomFormButton>
                            }
                        </div>
                    </div>
                </CardBody>
            </Card>
        </PageLayout>
    );
}

export default UserProfile;