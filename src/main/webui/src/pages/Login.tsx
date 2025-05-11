import { useLocation } from "react-router"; // Recommended to use react-router-dom
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Typography,
    Alert,
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout"; // Adjust path as needed
import React from "react";

// Placeholder Icon
const LockClosedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);
const ExclamationTriangleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);


function Login() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const hasError = params.get("error") === "true";

    return (
        <PageLayout pageTitle="Welcome Back!" contentMaxWidth="max-w-md">
            <Card className="w-full shadow-2xl">
                <CardHeader
                    variant="gradient"
                    color="purple" // Or your theme's primary color
                    className="mb-4 grid h-28 place-items-center"
                >
                    <div className="flex flex-col items-center">
                        <LockClosedIcon className="w-12 h-12 text-white mb-2" />
                        <Typography variant="h4" color="white">
                            Sign In
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-6 p-6">
                    {hasError && (
                        <Alert
                            color="red"
                            icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                            className="mb-4"
                        >
                            Invalid username or password. Please try again.
                        </Alert>
                    )}
                    <form action="/j_security_check" method="post" className="flex flex-col gap-6">
                        <Input
                            type="text"
                            placeholder="Username"
                            name="j_username"
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            name="j_password"
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Button type="submit" color="purple" fullWidth>
                            Sign In
                        </Button>
                    </form>
                </CardBody>
                <CardFooter className="pt-2 text-center">
                    <Typography variant="small" className="flex justify-center">
                        Don't have an account?
                        <Typography
                            as="a"
                            href="/register"
                            variant="small"
                            color="purple"
                            className="ml-1 font-bold hover:underline"
                        >
                            Register Here
                        </Typography>
                    </Typography>
                </CardFooter>
            </Card>
        </PageLayout>
    );
}

export default Login;