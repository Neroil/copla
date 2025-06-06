import { useEffect, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <LoadingSpinner message="Fetching artist directory..." />
                </motion.div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <ErrorAlert message={error} />
                </motion.div>
            </PageLayout>
        );
    }

    return (
        <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Card className="w-full shadow-xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <CardHeader
                            variant="gradient"
                            color="purple"
                            className="mb-4 p-6 flex flex-col sm:flex-row justify-between items-center"
                        >
                            <motion.div 
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                            >
                                <Users className="w-10 h-10 text-white" />
                                <Typography variant="h4">
                                    Browse Artists
                                </Typography>
                            </motion.div>
                            <motion.div 
                                className="w-full sm:w-72 mt-4 sm:mt-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            >
                                <PageHeader
                                    title=""
                                    searchPlaceholder="Search Artists"
                                    searchValue={searchTerm}
                                    onSearchChange={setSearchTerm}
                                />
                            </motion.div>
                        </CardHeader>
                    </motion.div>
                    <CardBody className="p-0">
                        <AnimatePresence mode="wait">
                            {filteredUsers.length > 0 ? (
                                <motion.div
                                    key="user-list"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <List>
                                        {filteredUsers.map((user, index) => (
                                            <motion.div
                                                key={user.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ 
                                                    delay: index * 0.05, 
                                                    duration: 0.3,
                                                    ease: "easeOut"
                                                }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <a href={`/users/${user.name}`} className="text-initial block">
                                                    <ListItem
                                                        ripple={true}
                                                        className="flex items-center gap-4 py-3 px-4 hover:bg-purple-50 dark:hover:bg-purple-900/50 focus:bg-purple-50 dark:focus:bg-purple-900/50 active:bg-purple-100 dark:active:bg-purple-900 transition-all duration-200"
                                                    >
                                                        <motion.div 
                                                            className="flex-shrink-0"
                                                            whileHover={{ scale: 1.1 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Avatar
                                                                shape="circular"
                                                                alt={user.name}
                                                                src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
                                                            />
                                                        </motion.div>
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
                                            </motion.div>
                                        ))}
                                    </List>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="p-6"
                                    key="empty-state"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <EmptyState
                                        icon={Users}
                                        title="No Artists Found"
                                        description="No artists found matching your search, or the directory is currently empty."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardBody>
                </Card>
            </motion.div>
        </PageLayout>
    );
}

export default UserList;