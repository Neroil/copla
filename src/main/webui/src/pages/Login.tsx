import { Header } from "../ui-component/Header.tsx";
import { useLocation } from "react-router";
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

function Login() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const hasError = params.get("error") === "true";

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header />
            <main className="p-4 flex justify-center items-center grow w-full">
                <Card className="w-full max-w-md">
                    <CardBody>
                        <Typography type="h5" color="primary" className="mb-6 text-center">
                            Login
                        </Typography>
                        {hasError && (
                            <Typography color="error" className="mb-4 text-center">
                                Invalid username or password.
                            </Typography>
                        )}
                        <form action="/j_security_check" method="post" className="flex flex-col gap-4">
                            <Input
                                type="text"
                                placeholder="Username"
                                name="j_username"
                                size="lg"
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                name="j_password"
                                size="lg"
                                required
                            />
                            <Button type="submit" isFullWidth={true}>
                                Sign In
                            </Button>
                        </form>
                        <Typography type="small" className="mt-6 flex justify-center">
                            Don't have an account?
                            <a
                                href="/register"
                                className="ml-1 font-medium text-blue-500 transition-colors hover:text-blue-700"
                            >
                                Register
                            </a>
                        </Typography>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}

export default Login;