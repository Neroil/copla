import { Header } from "../ui-component/header.tsx";
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

function Login() {

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header />
            <main className="p-4 flex justify-center items-center grow w-full">
                <Card className="w-full max-w-md">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-6 text-center">
                            Login
                        </Typography>
                        <form action="/j_security_check" method="post" className="flex flex-col gap-4">
                            <Input
                                type="text"
                                label="Username"
                                name="j_username"
                                size="lg"
                                required
                            />
                            <Input
                                type="password"
                                label="Password"
                                name="j_password"
                                size="lg"
                                required
                            />
                            <Button type="submit" fullWidth>
                                Sign In
                            </Button>
                        </form>
                        <Typography variant="small" className="mt-6 flex justify-center">
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