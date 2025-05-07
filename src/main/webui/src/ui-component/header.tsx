import {Button} from "@material-tailwind/react";
import {useAuthStatus} from "../resources/AuthStatus.tsx";

function logout() {
    document.cookie = `quarkus-credential=; Max-Age=0;path=/`;
    window.location.href = '/';
}

function Header(){
    const { isLoggedIn } = useAuthStatus();

    return (
        <>
            <div className="nav bg-gradient-to-r from-gray-900 to bg-gray-700 text-white flex justify-between items-center p-4">
                <h1 className="italic">CoPla</h1>
                <nav>
                    <ul>
                        <li>
                            <a href="/">
                                <Button>Home</Button>
                            </a>
                        </li>
                        {
                            isLoggedIn ? (
                                <>
                                    <li>
                                        <a href={"/profile"}>
                                            <Button>Profile</Button>
                                        </a>
                                    </li>
                                    <li>
                                        <Button onClick={logout}>Logout</Button>
                                    </li>
                                </>
                            ) : <li>
                                <a href={"/login"}>
                                    <Button>Login</Button>
                                </a>
                            </li>
                        }
                    </ul>

                </nav>
            </div>
        </>

    )


}



export { Header }