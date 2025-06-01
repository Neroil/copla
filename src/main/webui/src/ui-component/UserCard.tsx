import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Chip
} from "@material-tailwind/react";
import { CustomTagComponent } from "./CustomTagComponent";
import { BlueskyIcon } from "./CustomIcons";
import { CheckCircle } from "lucide-react";
import CustomFormButton from "./CustomFormButton";

interface UserCardProps {
    user: {
        id: number;
        name: string;
        bio?: string;
        profilePicPath?: string;
        verified?: boolean;
        isOpenForCommissions?: boolean;
        lowestPrice?: number;
        tags?: string[];
        galleryImages?: string[];
        socialProfiles?: Array<{
            platform: string;
            username: string;
            profileUrl: string;
            isVerified: boolean;
        }>;
    };
    viewMode?: "grid" | "list";
    onViewProfile?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
    user,
    viewMode = "grid",
    onViewProfile
}) => {
    const getStatusColor = (isOpen?: boolean): "success" | "error" => {
        return isOpen ? "success" : "error";
    };

    return (
        <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${viewMode === "list" ? "flex flex-row" : ""}`}>
            <CardHeader
                floated={false}
                color="transparent"
                className={`w-full m-0 rounded-b-none relative overflow-hidden ${viewMode === "list" ? "w-1/3 h-auto" : "h-64"}`}
            >
                {/* Centered Avatar */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                    <Avatar
                        shape="circular"
                        alt={user.name}
                        src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
                        className="border-4 border-white shadow-lg w-64 h-50"
                    />
                </div>

                {/* Status and Verified Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Chip
                        color={getStatusColor(user.isOpenForCommissions)}
                        className="text-xs font-bold text-white dark:text-white"
                        size="sm"
                    >
                        {user.isOpenForCommissions ? "OPEN" : "CLOSED"}
                    </Chip>

                    {user.verified && (
                        <Chip
                            color="info"
                            className="text-xs font-bold flex items-center gap-1 text-white dark:text-white"
                            size="sm"
                        >
                            <CheckCircle className="w-3 h-3" />
                            VERIFIED
                        </Chip>
                    )}
                </div>

                {/* Artist Name Overlay */}
                {viewMode !== "list" && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <Typography variant="h5" className="text-white font-bold">
                            {user.name}
                        </Typography>
                    </div>
                )}
            </CardHeader>

            <CardBody className={`p-4 ${viewMode === "list" ? "w-2/3" : ""}`}>
                {viewMode === "list" && (
                    <div className="flex items-center gap-3 mb-3">
                        <Typography variant="h5" className="font-bold text-gray-800 dark:text-gray-100">
                            {user.name}
                        </Typography>
                        {user.verified && (
                            <Chip
                                color="info"
                                className="text-xs font-bold flex items-center gap-1"
                                size="sm"
                            >
                                <CheckCircle className="w-3 h-3" />
                                VERIFIED
                            </Chip>
                        )}
                    </div>
                )}

                {/* Pricing */}
                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                    <Typography variant="small" className="text-green-700 dark:text-green-200 font-medium">
                        Starting from
                    </Typography>
                    <Typography variant="h6" className="font-bold text-green-600 dark:text-green-400">
                        ${user.lowestPrice || 0}+
                    </Typography>
                </div>

                {/* Bio */}
                <Typography variant="small" className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {user.bio}
                </Typography>

                {/* Tags */}
                {user.tags && user.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {user.tags.slice(0, 3).map((tag) => (
                            <CustomTagComponent
                                key={tag}
                                tag={tag}
                                variant="current"
                            />
                        ))}
                        {user.tags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{user.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </CardBody>

            <CardFooter className="pt-0 pb-4 px-4 flex justify-between items-center">
                <div className="flex gap-2">
                    {/* Social Links */}
                    {user.socialProfiles && user.socialProfiles.length > 0 ? (
                        user.socialProfiles
                            .filter(profile => profile.platform.toLowerCase() === 'bluesky')
                            .map((profile, index) => (
                                <CustomFormButton
                                    key={index}
                                    size="sm"
                                    className="p-2 w-10 h-10 min-w-0"
                                    onClick={() => window.open(profile.profileUrl, '_blank')}
                                    title={`@${profile.username} on Bluesky${profile.isVerified ? ' (Verified)' : ''}`}
                                    isFullWidth={false}
                                >
                                    <BlueskyIcon className="w-4 h-4" />
                                </CustomFormButton>
                            ))
                    ) : (
                        <Typography variant="small" className="text-gray-400 italic">
                            No social profiles
                        </Typography>
                    )}
                </div>

                <CustomFormButton
                    size="sm"
                    className="w-auto px-4 py-2 min-w-0"
                    onClick={onViewProfile}
                    isFullWidth={false}
                >
                    View Profile
                </CustomFormButton>
            </CardFooter>
        </Card>
    );
};
