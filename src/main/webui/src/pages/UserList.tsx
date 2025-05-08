import {useEffect, useState} from "react";
import {Header} from "../ui-component/Header.tsx";

interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
}


function UserList(){

    const [userList, setUserList] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserList() {
            try {
                setLoading(true);
                const response = await fetch('/api/users/all');

                if (!response.ok) {
                    throw new Error('Failed to fetch user list');
                }

                const userListData = await response.json();
                setUserList(userListData);

            } catch (err : any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchUserList();
    }, []);

    return(
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header/>
            <main className="p-4 flex justify-center items-center grow w-full">
                {loading ? (
                    <div>Loading user list...</div>
                    ) : error ?(
                    <div>Error: {error}</div>
                    ): (
                <div className="w-full max-w-md">
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-xl font-semibold mb-2">Users</h2>
                        <ul>
                            {userList && userList.map((user: any) => (
                                <li key={user.name} className="mb-2">
                                    <a href={`/users/${user.name}`} className="text-blue-500 hover:underline">
                                        {user.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>)
                }
            </main>
        </div>
    );

}

export default UserList;