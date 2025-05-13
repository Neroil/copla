import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    // ListItemPrefix, // Removed this import
    Avatar,
    Card,
    CardHeader,
    Typography,
    Spinner,
    Alert,
    Input, CardBody
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout"; // Adjust path

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
}

// Placeholder Icons
const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM1.396 16.404a.999.999 0 011.09-.602A4.999 4.999 0 017 12.5a.999.999 0 011.087.464l.383.767a.999.999 0 001.061.465h.004a.999.999 0 00.855-.526l.41-.901A4.999 4.999 0 0113 9.5a.999.999 0 011.706-.707l.093-.093a.999.999 0 011.414 0l.707.707a.999.999 0 010 1.414l-.707.707a.999.999 0 01-1.414 0l-.093-.093a.999.999 0 01-.706-1.706 3.001 3.001 0 00-4.038 2.06l-.41.902a2.999 2.999 0 01-2.547 1.578h-.003a2.999 2.999 0 01-2.67-1.719A3.001 3.001 0 002.5 15.5a.999.999 0 01-.502.866l-.707.353a.999.999 0 01-1.248-.608l-.25-.75a.999.999 0 01.353-1.053z" />
    </svg>
);
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);
const ExclamationTriangleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);


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
        return <PageLayout isLoading={true} loadingText="Fetching artist directory..." contentMaxWidth="max-w-2xl" />;
    }

    if (error) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
                <Alert color="error" icon={<ExclamationTriangleIcon className="h-5 w-5" />}>
                    Error: {error}
                </Alert>
            </PageLayout>
        );
    }

    return (
        <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-2xl">
            <Card className="w-full shadow-xl">
                <CardHeader
                    type="gradient"
                    color="purple"
                    className="mb-4 p-6 flex flex-col sm:flex-row justify-between items-center"
                >
                    <div className="flex items-center gap-3">
                        <UsersIcon className="w-10 h-10 text-white" />
                        <Typography type="h4" >
                            Browse Artists
                        </Typography>
                    </div>
                    <div className="w-full sm:w-72 mt-4 sm:mt-0">
                        <Input
                            placeholder="Search Artists"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!border-white text-white placeholder:text-gray-300 focus:!border-white"
                            labelProps={{
                                className: "!text-white peer-focus:!text-white",
                            }}
                            crossOrigin={undefined}
                        />
                    </div>
                </CardHeader>
                <CardBody className="p-0">
                    {filteredUsers.length > 0 ? (
                        <List>
                            {filteredUsers.map((user) => (
                                <a href={`/users/${user.name}`} key={user.id} className="text-initial block"> {/* Added block here */}
                                    <ListItem
                                        ripple={true}
                                        className="flex items-center gap-4 py-3 px-4 hover:bg-purple-50 dark:hover:bg-purple-900/50 focus:bg-purple-50 dark:focus:bg-purple-900/50 active:bg-purple-100 dark:active:bg-purple-900"
                                    >
                                        {/* Manual Prefix Structure */}
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                shape="circular"
                                                alt={user.name}
                                                src={user.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${user.name}`}
                                            />
                                        </div>
                                        {/* Main Content */}
                                        <div className="flex-grow">
                                            <Typography type="h6" className="dark:text-gray-200">
                                                {user.name}
                                            </Typography>
                                            <Typography type="small" className="font-normal dark:text-gray-400">
                                                Joined: {new Date(user.timeCreated).toLocaleDateString()}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                </a>
                            ))}
                        </List>
                    ) : (
                        <Typography className="p-6 text-center text-gray-600 dark:text-gray-400">
                            No artists found matching your search, or the directory is currently empty.
                        </Typography>
                    )}
                </CardBody>
            </Card>
        </PageLayout>
    );
}

export default UserList;