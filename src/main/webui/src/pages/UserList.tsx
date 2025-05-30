import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    Avatar,
    Card,
    CardHeader,
    Typography,
    CardBody
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout";
import { PageHeader } from "../ui-component/PageHeader";
import { LoadingSpinner } from "../ui-component/LoadingSpinner";
import { ErrorAlert } from "../ui-component/ErrorAlert";
import { EmptyState } from "../ui-component/EmptyState";
import { Users } from "lucide-react";

// This interface should ideally be in a shared types file
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
    socialProfiles?: SocialProfile[]; // Added for consistency, though not displayed in list yet
}

function UserList() {
    const [userList, setUserList] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchUserList() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/users/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch user list: ' + response.statusText);
                }
                const userListData = await response.json();
                setUserList(userListData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserList();
    }, []);

    const filteredUsers = userList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
                <LoadingSpinner message="Fetching artist directory..." />
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
                <ErrorAlert message={error} />
            </PageLayout>
        );
    }

    return (
        <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
            <Card className="w-full shadow-xl">
                <CardHeader
                    variant="gradient"
                    color="purple"
                    className="mb-4 p-6 flex flex-col sm:flex-row justify-between items-center"
                >
                    <div className="flex items-center gap-3">
                        <Users className="w-10 h-10 text-white" />
                        <Typography variant="h4">
                            Browse Artists
                        </Typography>
                    </div>
                    <div className="w-full sm:w-72 mt-4 sm:mt-0">
                        <PageHeader
                            title=""
                            searchPlaceholder="Search Artists"
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {filteredUsers.length > 0 ? (
                        <List>
                            {filteredUsers.map((user) => (
                                <a href={`/users/${user.name}`} key={user.id} className="text-initial block">
                                    <ListItem
                                        ripple={true}
                                        className="flex items-center gap-4 py-3 px-4 hover:bg-purple-50 dark:hover:bg-purple-900/50 focus:bg-purple-50 dark:focus:bg-purple-900/50 active:bg-purple-100 dark:active:bg-purple-900"
                                    >
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                shape="circular"
                                                alt={user.name}
                                                src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <Typography variant="h6" className="dark:text-gray-200">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="small" className="font-normal dark:text-gray-400">
                                                Joined: {new Date(user.timeCreated).toLocaleDateString()}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                </a>
                            ))}
                        </List>
                    ) : (
                        <div className="p-6">
                            <EmptyState
                                icon={Users}
                                title="No Artists Found"
                                description="No artists found matching your search, or the directory is currently empty."
                            />
                        </div>
                    )}
                </CardBody>
            </Card>
        </PageLayout>
    );
}

export default UserList;