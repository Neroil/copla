import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
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
    Typography,
    Switch,
    Chip
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout";
import ManageBluesky from "../ui-component/ManageBluesky";
import { useFetchUserData } from "../resources/FetchUserData";
import CustomFormButton from "../ui-component/CustomFormButton.tsx";
import { PaletteIcon } from "../ui-component/CustomIcons";
import { LoadingSpinner } from "../ui-component/LoadingSpinner";
import { ErrorAlert } from "../ui-component/ErrorAlert";
import { EmptyState } from "../ui-component/EmptyState";
import {
    useCommissionCard,
    CommissionCard,
    CommissionCardError,
    CommissionCardLoading,
    CreateCommissionCard
} from "../ui-component/CommissionCard";
import { CustomTagComponent } from "../ui-component/CustomTagComponent.tsx";

// Types
interface SocialProfile {
    platform: string;
    username: string;
    profileUrl: string;
    isVerified: boolean;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
    bio?: string;
    socialProfiles?: SocialProfile[];
    role?: string;
    isOpenForCommissions?: boolean;
    relatedTags?: string[];
}

// Icons
const VerifiedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const PhotoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 0A.75.75 0 013.25 4.5h13.5A.75.75 0 0117.5 5.25v9.5A.75.75 0 0116.75 16H3.25a.75.75 0 01-.75-.75v-9.5z" clipRule="evenodd" />
    </svg>
);

const getPlatformIcon = (platform: string, className: string) => {
    switch (platform.toLowerCase()) {
        case "bluesky":
            return (
                <svg viewBox="0 0 600 530" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" fill="#1185fe" />
                </svg>
            );
        default:
            return <ExclamationTriangleIcon className={className} />;
    }
};

// Components
const ManageButton = ({
    isCurrentUser,
    onClick
}: {
    isCurrentUser: boolean;
    onClick: () => void;
}) => {
    if (!isCurrentUser) return null;

    return (
        <CustomFormButton
            size="sm"
            variant="outline"
            color="primary"
            onClick={onClick}
            className="flex items-center gap-1 !text-xs !py-2 !px-4"
            isFullWidth={false}
        >
            <PencilIcon className="w-4 h-4" />
            Manage
        </CustomFormButton>
    );
}

const ProfileHeader = ({
    user,
    isCurrentUser,
    uploading,
    uploadError,
    onProfilePicUpload
}: {
    user: UserData;
    isCurrentUser: boolean;
    uploading: boolean;
    uploadError: string | null;
    onProfilePicUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <CardHeader
            floated={false}
            shadow={false}
            className="m-0 w-full rounded-none bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6"
        >
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                    <Avatar
                        size="xxl"
                        src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
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
                                onChange={onProfilePicUpload}
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
    );
};

// Enhanced Stats/Quick Info Component
const InfoCard = ({ user, isCurrentUser, isUpdating, onToggle }: { 
    user: UserData; 
    isCurrentUser: boolean;
    isUpdating: boolean;
    onToggle: (checked: boolean) => void;
}) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardBody className="p-6">
            <Typography variant="h6" className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
                Info
            </Typography>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        Role:
                    </Typography>
                    <Chip
                        color={user.role === 'artist' ? 'primary' : 'secondary'}
                        variant="gradient"
                        size="sm"
                        className="capitalize px-3 py-1.5 text-white dark:text-gray-100"
                    >
                        {user.role || 'User'}
                    </Chip>
                </div>
                <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        Joined:
                    </Typography>
                    <Typography variant="small" className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(user.timeCreated).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                    </Typography>
                </div>
                {user.role === 'artist' && (
                    <>
                        <div className="flex justify-between items-center">
                            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                                Commissions:
                            </Typography>
                            {isCurrentUser ? (
                                <Switch
                                    checked={user.isOpenForCommissions || false}
                                    onChange={(e) => onToggle(e.target.checked)}
                                    disabled={isUpdating}
                                    color="success"
                                />
                            ) : (
                                <Chip
                                    color={user.isOpenForCommissions ? 'success' : 'error'}
                                    size="sm"
                                    className="capitalize px-3 py-1.5 text-white dark:text-gray-100"
                                >
                                    {user.isOpenForCommissions ? 'Open' : 'Closed'}
                                </Chip>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                                Specialties:
                            </Typography>
                            <Typography variant="small" className="font-medium text-gray-900 dark:text-gray-100">
                                {user.relatedTags?.length || 0} tag{(user.relatedTags?.length || 0) !== 1 ? 's' : ''}
                            </Typography>
                        </div>
                    </>
                )}
            </div>
        </CardBody>
    </Card>
);

// Compact Tags Section Component
const CompactTagsSection = ({
    user,
    isCurrentUser,
    availableTags,
    tagManagementOpen,
    onToggleManagement,
    onAddTag,
    onRemoveTag
}: {
    user: UserData;
    isCurrentUser: boolean;
    availableTags: string[];
    tagManagementOpen: boolean;
    onToggleManagement: () => void;
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                </Typography>
                <ManageButton isCurrentUser={isCurrentUser} onClick={onToggleManagement} />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
                {user.relatedTags && user.relatedTags.length > 0 ? (
                    user.relatedTags.map((tag) => (
                        <CustomTagComponent
                            key={tag}
                            tag={tag}
                            variant="current"
                            showRemove={isCurrentUser && tagManagementOpen}
                            onRemove={() => onRemoveTag(tag)}
                        />
                    ))
                ) : (
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                        {isCurrentUser ? "No tags added yet" : "No specialties listed"}
                    </Typography>
                )}
            </div>

            {isCurrentUser && tagManagementOpen && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Typography variant="small" className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Add Tags:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                        {availableTags
                            .filter(tag => !user.relatedTags?.includes(tag))
                            .map((tag) => (
                                <CustomTagComponent
                                    key={tag}
                                    tag={tag}
                                    variant="add"
                                    onClick={() => onAddTag(tag)}
                                />
                            ))}
                    </div>
                    {availableTags.filter(tag => !user.relatedTags?.includes(tag)).length === 0 && (
                        <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                            All available tags have been added!
                        </Typography>
                    )}
                </div>
            )}
        </CardBody>
    </Card>
);

// Enhanced Bio Section Component
const BioSection = ({
    user,
    isCurrentUser,
    bioText,
    setBioText,
    isEditingBio,
    setIsEditingBio,
    isSavingBio,
    onSaveBio
}: {
    user: UserData;
    isCurrentUser: boolean;
    bioText: string;
    setBioText: (text: string) => void;
    isEditingBio: boolean;
    setIsEditingBio: (editing: boolean) => void;
    isSavingBio: boolean;
    onSaveBio: () => void;
}) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
                <Typography variant="h5" className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    About {isCurrentUser ? "Me" : user.name}
                </Typography>
                {isCurrentUser && !isEditingBio && (
                    <CustomFormButton
                        size="sm"
                        variant="outline"
                        color="primary"
                        onClick={() => {
                            setBioText(user.bio || "");
                            setIsEditingBio(true);
                        }}
                        isFullWidth={false}
                        className="flex items-center gap-2"
                    >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                    </CustomFormButton>
                )}
            </div>
            
            {isEditingBio && isCurrentUser ? (
                <div className="space-y-4">
                    <Textarea
                        placeholder="Tell people about yourself, your art style, what you enjoy creating..."
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        rows={6}
                        className="dark:text-gray-200 dark:bg-gray-700/50 focus:border-purple-500"
                        maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                            {bioText.length}/500 characters
                        </Typography>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsEditingBio(false);
                                    setBioText(user.bio || "");
                                }}
                                disabled={isSavingBio}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                variant="gradient"
                                color="primary"
                                onClick={onSaveBio}
                                disabled={isSavingBio || bioText === user.bio}
                                className="flex items-center gap-2"
                            >
                                {isSavingBio ? <Spinner className="h-4 w-4" /> : null}
                                Save Bio
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="prose prose-purple dark:prose-invert max-w-none">
                    {user.bio ? (
                        <Typography className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                            {user.bio}
                        </Typography>
                    ) : (
                        <div className="text-center py-8">
                            <Typography className="text-gray-500 dark:text-gray-400 italic">
                                {isCurrentUser 
                                    ? "You haven't written a bio yet. Click 'Edit' to tell people about yourself!"
                                    : `${user.name} hasn't written a bio yet.`
                                }
                            </Typography>
                        </div>
                    )}
                </div>
            )}
        </CardBody>
    </Card>
);

// Main Component
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

    const { commissionCard, loading: loadingCard, error: cardError, refreshCard } = useCommissionCard(
        displayUser?.role === "artist" ? displayUser.name : undefined
    );

    // States
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showManageSocials, setShowManageSocials] = useState(false);
    const [unlinkingPlatform, setUnlinkingPlatform] = useState<string | null>(null);
    const [unlinkLoading, setUnlinkLoading] = useState(false);
    const [unlinkError, setUnlinkError] = useState<string | null>(null);
    const [showUnlinkDialog, setShowUnlinkDialog] = useState(false);
    const [unlinkingUsername, setUnlinkingUsername] = useState<string | null>(null);
    const [showCommissionCard, setShowCommissionCard] = useState(false);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [isUpdatingCommissionStatus, setIsUpdatingCommissionStatus] = useState(false);
    const [tagManagementOpen, setTagManagementOpen] = useState(false);
    const [bioText, setBioText] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isSavingBio, setIsSavingBio] = useState(false);

    // Local state to avoid full page refreshes
    const [localUser, setLocalUser] = useState<UserData | null>(null);
    const [localSocialProfiles, setLocalSocialProfiles] = useState<SocialProfile[]>([]);

    // Effects
    useEffect(() => {
        if (userIdFromParams) {
            setProfileUserIdToFetch(userIdFromParams);
        } else {
            setProfileUserIdToFetch(undefined);
        }
    }, [userIdFromParams, setProfileUserIdToFetch]);

    useEffect(() => {
        async function fetchTags() {
            try {
                const response = await fetch('/api/tags/names');
                if (response.ok) {
                    const tagNames = await response.json();
                    setAvailableTags(tagNames);
                }
            } catch (err) {
                console.error('Failed to fetch tags:', err);
            }
        }
        fetchTags();
    }, []);

    useEffect(() => {
        if (displayUser?.bio) {
            setBioText(displayUser.bio);
        }
    }, [displayUser?.bio]);

    // Sync local state with fetched user data
    useEffect(() => {
        if (displayUser) {
            setLocalUser(displayUser);
            setLocalSocialProfiles(displayUser.socialProfiles || []);
        }
    }, [displayUser]);

    // Use local user data if available, otherwise fall back to fetched data
    const currentUser = localUser || displayUser;

    // Handler functions
    const handleSaveBio = async () => {
        if (!user || !isCurrentUser) return;

        setIsSavingBio(true);
        try {
            const response = await fetch(`/api/users/${user.name}/bio`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ bio: bioText })
            });

            if (!response.ok) {
                throw new Error('Failed to save bio');
            }

            // Update local state
            setLocalUser(prev => prev ? { ...prev, bio: bioText } : null);
            setIsEditingBio(false);
        } catch (err) {
            console.error('Error saving bio:', err);
            // Refresh data on error
            refreshUserData();
        } finally {
            setIsSavingBio(false);
        }
    };

    const handleCommissionCardDelete = async () => {
        if (!user || !isCurrentUser) return;

        try {
            const response = await fetch(`/api/commission-cards/${user.name}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete commission card');
            }

            // Refresh commission card data
            await refreshCard();
        } catch (err) {
            console.error('Error deleting commission card:', err);
        }
    };

    const handleSocialLinkSuccess = () => {
        // Refresh user data when social link is successful
        refreshUserData();
        setShowManageSocials(false);
    };

    // Handlers
    const handleCommissionToggle = async (checked: boolean) => {
        if (!user || !isCurrentUser) return;

        // Optimistically update local state
        setLocalUser(prev => prev ? { ...prev, isOpenForCommissions: checked } : null);
        setIsUpdatingCommissionStatus(true);

        try {
            const response = await fetch(`/api/users/${user.name}/commission-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ isOpen: checked })
            });

            if (!response.ok) {
                // Revert optimistic update on error
                setLocalUser(prev => prev ? { ...prev, isOpenForCommissions: !checked } : null);
                throw new Error('Failed to update commission status');
            }
        } catch (err) {
            console.error('Error updating commission status:', err);
            // Refresh data only on error to get the correct state
            refreshUserData();
        } finally {
            setIsUpdatingCommissionStatus(false);
        }
    };

    const handleAddTag = async (tagName: string) => {
        if (!user || !isCurrentUser) return;

        // Optimistically update local state
        setLocalUser(prev => prev ? {
            ...prev,
            relatedTags: [...(prev.relatedTags || []), tagName]
        } : null);

        try {
            const response = await fetch(`/api/users/${user.name}/tags/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ tagName })
            });

            if (!response.ok) {
                // Revert optimistic update on error
                setLocalUser(prev => prev ? {
                    ...prev,
                    relatedTags: (prev.relatedTags || []).filter(tag => tag !== tagName)
                } : null);
                throw new Error('Failed to add tag');
            }
        } catch (err) {
            console.error('Error adding tag:', err);
            refreshUserData();
        }
    };

    const handleRemoveTag = async (tagName: string) => {
        if (!user || !isCurrentUser) return;

        // Optimistically update local state
        const previousTags = localUser?.relatedTags || [];
        setLocalUser(prev => prev ? {
            ...prev,
            relatedTags: (prev.relatedTags || []).filter(tag => tag !== tagName)
        } : null);

        try {
            const response = await fetch(`/api/users/${user.name}/tags/${encodeURIComponent(tagName)}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                // Revert optimistic update on error
                setLocalUser(prev => prev ? {
                    ...prev,
                    relatedTags: previousTags
                } : null);
                throw new Error('Failed to remove tag');
            }
        } catch (err) {
            console.error('Error removing tag:', err);
            refreshUserData();
        }
    };

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
                const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
                throw new Error(errorData.message || 'Failed to upload profile picture.');
            }
            
            // Only refresh user data for profile picture changes
            refreshUserData();
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleUnlinkSocial = async (platformToUnlink: string, usernameToUnlink: string) => {
        setUnlinkingPlatform(platformToUnlink);
        setUnlinkingUsername(usernameToUnlink);
        setShowUnlinkDialog(true);
        setUnlinkError(null);
    };

    const confirmUnlinkSocial = async () => {
        if (!unlinkingPlatform || !unlinkingUsername || !user) return;

        // Optimistically update local social profiles
        const profileToRemove = localSocialProfiles.find(
            p => p.platform === unlinkingPlatform && p.username === unlinkingUsername
        );
        setLocalSocialProfiles(prev => 
            prev.filter(p => !(p.platform === unlinkingPlatform && p.username === unlinkingUsername))
        );
        setLocalUser(prev => prev ? {
            ...prev,
            socialProfiles: localSocialProfiles.filter(
                p => !(p.platform === unlinkingPlatform && p.username === unlinkingUsername)
            )
        } : null);

        try {
            setUnlinkLoading(true);
            setUnlinkError(null);

            const response = await fetch(
                `/api/users/${user.name}/social/${unlinkingPlatform.toLowerCase()}/${encodeURIComponent(unlinkingUsername)}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response.ok) {
                // Revert optimistic update on error
                if (profileToRemove) {
                    setLocalSocialProfiles(prev => [...prev, profileToRemove]);
                    setLocalUser(prev => prev ? {
                        ...prev,
                        socialProfiles: [...(prev.socialProfiles || []), profileToRemove]
                    } : null);
                }
                const errorData = await response.json().catch(() => ({ message: `Failed to unlink ${unlinkingPlatform} account` }));
                throw new Error(errorData.message);
            }

            setShowUnlinkDialog(false);
            setUnlinkingPlatform(null);
            setUnlinkingUsername(null);
        } catch (err: any) {
            setUnlinkError(err.message || `An error occurred while unlinking your ${unlinkingPlatform} account`);
            refreshUserData();
        } finally {
            setUnlinkLoading(false);
        }
    };

    const cancelUnlink = () => {
        setShowUnlinkDialog(false);
        setUnlinkingPlatform(null);
        setUnlinkingUsername(null);
        setUnlinkError(null);
    };

    // Loading and error states
    if (loading && !user) {
        return (
            <PageLayout pageTitle="User Profile" contentMaxWidth="max-w-2xl">
                <LoadingSpinner message={`Loading ${userIdFromParams || 'user'}'s profile...`} />
            </PageLayout>
        );
    }

    if (error && !user) {
        return (
            <PageLayout pageTitle="Profile Error" contentMaxWidth="max-w-2xl">
                <ErrorAlert title="Profile Error" message={error || "User data could not be loaded."} />
            </PageLayout>
        );
    }

    if (!user) {
        return (
            <PageLayout pageTitle="User Not Found" contentMaxWidth="max-w-2xl">
                <ErrorAlert 
                    title="User Not Found" 
                    message="The user profile could not be found."
                />
            </PageLayout>
        );
    }

    const pageTitle = `${currentUser.role === 'artist' ? 'Artist' : 'Client'} - ${currentUser.name}'s Den`;

    return (
        <PageLayout pageTitle={pageTitle} contentMaxWidth="max-w-4xl">
            {/* Main Profile Card */}
            <Card className="w-full shadow-2xl overflow-hidden mb-8">
                <ProfileHeader
                    user={currentUser}
                    isCurrentUser={isCurrentUser}
                    uploading={uploading}
                    uploadError={uploadError}
                    onProfilePicUpload={handleProfilePicUpload}
                />
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bio Section */}
                    <BioSection
                        user={currentUser}
                        isCurrentUser={isCurrentUser}
                        bioText={bioText}
                        setBioText={setBioText}
                        isEditingBio={isEditingBio}
                        setIsEditingBio={setIsEditingBio}
                        isSavingBio={isSavingBio}
                        onSaveBio={handleSaveBio}
                    />

                    {/* Artist-specific sections */}
                    {currentUser.role === "artist" && (
                        <>
                            {/* Commission Card Section */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardBody className="p-6">
                                    <Typography variant="h5" className="mb-4 font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <PaletteIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        {isCurrentUser ? "My Commission Card" : "Commission Card"}
                                    </Typography>
                                    
                                    {isCurrentUser ? (
                                        <>
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
                                                    onEdit={() => {/* Navigate to edit page */}}
                                                    onDelete={handleCommissionCardDelete}
                                                />
                                            ) : (
                                                <CreateCommissionCard
                                                    artistName={currentUser.name}
                                                    onSuccess={() => {
                                                        setTimeout(() => {
                                                            refreshCard();
                                                        }, 500);
                                                    }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <CustomFormButton
                                            className="flex items-center gap-2"
                                            onClick={() => setShowCommissionCard(!showCommissionCard)}
                                            disabled={loadingCard}
                                            isFullWidth={false}
                                        >
                                            <PaletteIcon className="h-5 w-5" />
                                            {`View ${currentUser.name}'s Commission Card`}
                                        </CustomFormButton>
                                    )}
                                </CardBody>
                            </Card>
                        </>
                    )}

                    {/* Portfolio Section */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardBody className="p-6">
                            <Typography variant="h5" className="mb-4 font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <PhotoIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                {currentUser.role === 'artist' ? 'Portfolio' : 'Commission History'}
                            </Typography>

                            <EmptyState
                                title={isCurrentUser
                                    ? (currentUser.role === 'artist'
                                        ? "Your portfolio is empty"
                                        : "No commission history yet")
                                    : (currentUser.role === 'artist'
                                        ? `${currentUser.name}'s portfolio is empty`
                                        : `${currentUser.name} has no commission history yet`)}
                                description={isCurrentUser
                                    ? (currentUser.role === 'artist'
                                        ? "Showcase your amazing artwork to potential clients"
                                        : "Your commissioned artwork will appear here")
                                    : (currentUser.role === 'artist'
                                        ? "Check back later to see their latest work"
                                        : "Their commission history will appear here")}
                                actionLabel={isCurrentUser ? (currentUser.role === 'artist' ? 'Add Artwork' : 'Create Commission Request') : undefined}
                                onAction={isCurrentUser ? () => {} : undefined}
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Info Card */}
                    <InfoCard 
                        user={currentUser} 
                        isCurrentUser={isCurrentUser}
                        isUpdating={isUpdatingCommissionStatus}
                        onToggle={handleCommissionToggle}
                    />

                    {/* Tags Section - Only for artists */}
                    {currentUser.role === "artist" && (
                        <CompactTagsSection
                            user={currentUser}
                            isCurrentUser={isCurrentUser}
                            availableTags={availableTags}
                            tagManagementOpen={tagManagementOpen}
                            onToggleManagement={() => setTagManagementOpen(!tagManagementOpen)}
                            onAddTag={handleAddTag}
                            onRemoveTag={handleRemoveTag}
                        />
                    )}

                    {/* Social Profiles */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardBody className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Connect
                                </Typography>
                                <ManageButton isCurrentUser={isCurrentUser} onClick={() => setShowManageSocials(!showManageSocials)} />
                            </div>
                            
                            {showManageSocials && isCurrentUser ? (
                                <ManageBluesky
                                    username={currentUser.name}
                                    onClose={() => setShowManageSocials(false)}
                                    onSuccess={handleSocialLinkSuccess}
                                />
                            ) : (
                                <>
                                    {localSocialProfiles && localSocialProfiles.length > 0 ? (
                                        <div className="space-y-3">
                                            {Object.entries(
                                                localSocialProfiles.reduce((acc, profile) => {
                                                    if (!acc[profile.platform]) {
                                                        acc[profile.platform] = [];
                                                    }
                                                    acc[profile.platform].push(profile);
                                                    return acc;
                                                }, {} as Record<string, SocialProfile[]>)
                                            ).map(([platform, profiles]) => (
                                                <div key={platform} className="space-y-2">
                                                    <Typography variant="small" className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                                                        {platform} ({profiles.length})
                                                    </Typography>
                                                    {profiles.map((profile) => (
                                                        <div key={profile.username} className="space-y-2">
                                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                                    {getPlatformIcon(profile.platform, "w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0")}
                                                                    <div className="min-w-0 flex-1">
                                                                        <Typography variant="small" className="text-gray-600 dark:text-gray-400 truncate">
                                                                            @{profile.username}
                                                                        </Typography>
                                                                        <a
                                                                            href={profile.profileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                                                                            title={`Visit ${profile.username}'s ${profile.platform} profile`}
                                                                        >
                                                                            View Profile
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                                    {profile.isVerified ? (
                                                                        <div title="Verified Account">
                                                                            <VerifiedIcon className="w-4 h-4 text-green-500" />
                                                                        </div>
                                                                    ) : (
                                                                        <div 
                                                                            title="Unverified Account - This account has not been verified and may not belong to the real person"
                                                                            className="cursor-help"
                                                                        >
                                                                            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 hover:text-red-600" />
                                                                        </div>
                                                                    )}
                                                                    {isCurrentUser && (
                                                                        <Button
                                                                            size="sm"
                                                                            color="error"
                                                                            onClick={() => handleUnlinkSocial(profile.platform, profile.username)}
                                                                            className="p-1 min-w-0"
                                                                        >
                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Inline Unlink Dialog */}
                                                            {showUnlinkDialog && unlinkingPlatform === profile.platform && unlinkingUsername === profile.username && (
                                                                <div className="ml-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                                    <div className="flex items-start gap-3">
                                                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                                                        <div className="flex-1 min-w-0">
                                                                            <Typography variant="small" className="font-medium text-red-800 dark:text-red-200 mb-1">
                                                                                Confirm Unlink
                                                                            </Typography>
                                                                            <Typography variant="small" className="text-red-700 dark:text-red-300 mb-3">
                                                                                Are you sure you want to unlink @{profile.username} from {profile.platform}? This action cannot be undone.
                                                                            </Typography>
                                                                            
                                                                            {unlinkError && (
                                                                                <Alert color="error" className="mb-3 p-2">
                                                                                    <Typography variant="small" className="text-red-800">
                                                                                        {unlinkError}
                                                                                    </Typography>
                                                                                </Alert>
                                                                            )}
                                                                            
                                                                            <div className="flex gap-2">
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="outline"
                                                                                    onClick={cancelUnlink}
                                                                                    disabled={unlinkLoading}
                                                                                    className="flex-1"
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button
                                                                                    size="sm"
                                                                                    color="error"
                                                                                    onClick={confirmUnlinkSocial}
                                                                                    disabled={unlinkLoading}
                                                                                    className="flex-1 flex items-center justify-center gap-1"
                                                                                >
                                                                                    {unlinkLoading ? (
                                                                                        <>
                                                                                            <Spinner className="h-3 w-3" />
                                                                                            <span>Unlinking...</span>
                                                                                        </>
                                                                                    ) : (
                                                                                        "Unlink"
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                                                {isCurrentUser 
                                                    ? "No social accounts linked yet" 
                                                    : `${currentUser.name} hasn't linked any social accounts`
                                                }
                                            </Typography>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Remove the old dialog since it's now inline */}
            {showCommissionCard && !isCurrentUser && (
                <Dialog
                    open={showCommissionCard}
                    onOpenChange={setShowCommissionCard}
                >
                    <div className="max-w-4xl mx-auto w-full">
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
                                isOwner={false}
                                onEdit={() => {/* Navigate to edit page */}}
                                onDelete={handleCommissionCardDelete}
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
                </Dialog>
            )}
        </PageLayout>
    );
}

export default UserProfile;