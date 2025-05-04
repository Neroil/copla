import { Button } from "@material-tailwind/react";

function Header(){

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
                        <li>
                            <a href={"/login"}>
                                <Button>Login</Button>
                            </a>
                        </li>
                    </ul>

                </nav>
            </div>
        </>

    )


}



export { Header }