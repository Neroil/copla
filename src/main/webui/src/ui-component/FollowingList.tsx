import React, { useState, useEffect } from 'react';
import { Typography, Card, CardBody, Chip, Avatar, Spinner, Alert } from '@material-tailwind/react';
import CustomFormButton from './CustomFormButton';
import { useNavigate } from 'react-router';

interface FollowingUser {
    id: number;
    blueskyHandle: string;
    blueskyDisplayName: string;
    coplaUser?: {
        name: string;
        profilePicPath?: string;
        role: string;
        verified?: boolean;
        isOpenForCommissions?: boolean;
    };
    isLinked: boolean;
    isOpenForCommissions: boolean;
    followedAt: string;
}

interface FollowingListProps {
    username: string;
    openOnly?: boolean;
}

const FollowingList: React.FC<FollowingListProps> = ({ username, openOnly = false }) => {
    const [following, setFollowing] = useState<FollowingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFollowing();
    }, [username, openOnly]);

    const fetchFollowing = async () => {
        try {
            setLoading(true);
            const endpoint = openOnly 
                ? `/api/users/${username}/following/open-for-commissions`
                : `/api/users/${username}/following`;
            
            const response = await fetch(endpoint, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch following list');
            }

            const data = await response.json();
            setFollowing(openOnly ? data.following : data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load following list');
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user: FollowingUser) => {
        if (user.isLinked && user.coplaUser) {
            navigate(`/users/${user.coplaUser.name}`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert color="error" className="mb-4">
                {error}
            </Alert>
        );
    }

    if (following.length === 0) {
        return (
            <Card className="mb-6">
                <CardBody className="text-center py-8">
                    <Typography className="text-gray-600 dark:text-gray-400">
                        {openOnly 
                            ? "None of your followed artists are currently open for commissions"
                            : "No Bluesky following data found. Connect your Bluesky account to sync your follows."
                        }
                    </Typography>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Typography variant="h6" className="font-semibold">
                    {openOnly ? 'Artists Open for Commissions' : 'Bluesky Following'}
                </Typography>
                <Typography variant="small" className="text-gray-600">
                    {following.length} {openOnly ? 'open' : 'total'}
                </Typography>
            </div>

            <div className="space-y-3">
                {following.map((user) => (
                    <Card 
                        key={user.id} 
                        className={`transition-all duration-200 ${
                            user.isLinked ? 'hover:shadow-md cursor-pointer' : ''
                        }`}
                        onClick={() => handleUserClick(user)}
                    >
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar
                                        src={user.coplaUser?.profilePicPath || '/api/images/view/default_profile.jpg'}
                                        alt={user.blueskyDisplayName}
                                        size="sm"
                                    />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <Typography variant="h6" className="font-medium">
                                                {user.blueskyDisplayName || user.blueskyHandle}
                                            </Typography>
                                            {user.isLinked && (
                                                <Chip
                                                    size="sm"
                                                    color="success"
                                                >
                                                    Linked
                                                </Chip>
                                            )}
                                            {user.isOpenForCommissions && (
                                                <Chip
                                                    size="sm"
                                                    color="info"
                                                >
                                                    Open
                                                </Chip>
                                            )}
                                        </div>
                                        <Typography variant="small" className="text-gray-600">
                                            @{user.blueskyHandle}
                                            {user.isLinked && user.coplaUser && (
                                                <span className="ml-2 text-blue-600">
                                                    → {user.coplaUser.name} on Copla
                                                </span>
                                            )}
                                        </Typography>
                                    </div>
                                </div>

                                {user.isLinked && user.isOpenForCommissions && (
                                    <CustomFormButton
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/users/${user.coplaUser!.name}`);
                                        }}
                                    >
                                        View Profile
                                    </CustomFormButton>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FollowingList;
