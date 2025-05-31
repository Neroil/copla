import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Avatar,
    Button,
    Chip
} from "@material-tailwind/react";
import { CustomTagComponent } from "./CustomTagComponent";
import { BlueskyIcon } from "./CustomIcons";
import { CheckCircle } from "lucide-react";

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
        <Card className={`group overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 ${viewMode === "list" ? "flex flex-row" : ""}`}>
            <CardHeader
                floated={false}
                color="transparent"
                className={`m-0 w-full rounded-b-none relative overflow-hidden ${viewMode === "list" ? "w-1/3 h-auto" : "h-72"}`}
            >
                {/* Gallery Image Background */}
                <div className="absolute inset-0">
                    {user.galleryImages && user.galleryImages.length > 0 ? (
                        <img
                            src={user.galleryImages[0]}
                            alt={`${user.name}'s artwork`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"></div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                </div>
                
                {/* Profile Avatar */}
                <div className="absolute top-6 left-6 group-hover:scale-110 transition-transform duration-300">
                    <Avatar
                        size="xxl"
                        shape="circular"
                        alt={user.name}
                        src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
                        className="border-4 border-white shadow-xl ring-4 ring-purple-200 group-hover:ring-purple-300 transition-all duration-300"
                    />
                </div>

                {/* Status and Verified Badges */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <Chip
                        color={getStatusColor(user.isOpenForCommissions)}
                        className="text-xs font-bold shadow-lg"
                        size="sm"
                    >
                        {user.isOpenForCommissions ? "OPEN" : "CLOSED"}
                    </Chip>
                    
                    {user.verified && (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <CheckCircle className="w-3 h-3" />
                            VERIFIED
                        </div>
                    )}
                </div>

                {/* Artist Name Overlay */}
                {viewMode !== "list" && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <Typography variant="h4" className="text-white font-bold drop-shadow-lg">
                            {user.name}
                        </Typography>
                    </div>
                )}
            </CardHeader>

            <CardBody className={`p-6 ${viewMode === "list" ? "w-2/3" : ""}`}>
                {viewMode === "list" && (
                    <div className="flex items-center gap-3 mb-4">
                        <Typography variant="h4" className="font-bold text-gray-800 dark:text-gray-100">
                            {user.name}
                        </Typography>
                        {user.verified && (
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <CheckCircle className="w-3 h-3" />
                                VERIFIED
                            </div>
                        )}
                    </div>
                )}

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700/50">
                    <Typography variant="small" className="text-green-700 dark:text-green-200 font-medium">
                        Starting from
                    </Typography>
                    <Typography variant="h5" className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        ${user.lowestPrice || 0}+
                    </Typography>
                </div>

                {/* Bio */}
                <Typography variant="small" className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4 leading-relaxed">
                    {user.bio}
                </Typography>

                {/* Tags */}
                {user.tags && user.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {user.tags.map((tag) => (
                            <CustomTagComponent
                                key={tag}
                                tag={tag}
                                variant="current"
                            />
                        ))}
                    </div>
                )}
            </CardBody>

            <CardFooter className="pt-0 pb-6 px-6 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/60 dark:to-gray-800/60">
                <div className="flex gap-2">
                    {/* Social Links */}
                    {user.socialProfiles && user.socialProfiles.length > 0 ? (
                        user.socialProfiles
                            .filter(profile => profile.platform.toLowerCase() === 'bluesky')
                            .map((profile, index) => (
                                <Button
                                    key={index}
                                    size="sm"
                                    variant="ghost"
                                    color="info"
                                    className="p-2 hover:scale-110 transition-transform duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                                    onClick={() => window.open(profile.profileUrl, '_blank')}
                                    title={`@${profile.username} on Bluesky${profile.isVerified ? ' (Verified)' : ''}`}
                                >
                                    <BlueskyIcon className="w-4 h-4" />
                                    {profile.isVerified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                                </Button>
                            ))
                    ) : (
                        <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                            No social profiles
                        </Typography>
                    )}
                </div>

                <Button
                    size="sm"
                    variant="gradient"
                    color={user.isOpenForCommissions ? "primary" : "secondary"}
                    className="flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    onClick={onViewProfile}
                >
                    View Profile
                </Button>
            </CardFooter>
        </Card>
    );
};
