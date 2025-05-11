import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Typography,
    Alert,
    Spinner
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout"; // Adjust path as needed

// Placeholder Icons
const UserPlusIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM4.25 8.5c-.69 0-1.25.56-1.25 1.25V12h2.5V9.75c0-.69-.56-1.25-1.25-1.25H4.25zM10.75 8.5c-.69 0-1.25.56-1.25 1.25V12h2.5V9.75c0-.69-.56-1.25-1.25-1.25H10.75zM15.75 9.75c0-.69-.56-1.25-1.25-1.25H13V12h2.5V9.75zM6 14.75c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75V14a2 2 0 00-2-2H7a2 2 0 00-2 2v.75z" />
    </svg>
);
const ExclamationTriangleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
const CheckCircleIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!username || !password || !email || !confirmPassword) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name: username, password: password, email: email }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message || 'Registration successful! Redirecting to login...');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');
                setTimeout(() => window.location.href = '/login', 2500);
            } else {
                setError(result.message || `Registration failed: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError('An error occurred during registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout pageTitle="Join CoPla Today!" contentMaxWidth="max-w-md">
            <Card className="w-full shadow-2xl">
                <CardHeader
                    variant="gradient"
                    color="purple" // Or your theme's primary color
                    className="mb-4 grid h-28 place-items-center"
                >
                    <div className="flex flex-col items-center">
                        <UserPlusIcon className="w-12 h-12 text-white mb-2" />
                        <Typography variant="h4" color="white">
                            Create Account
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="flex flex-col gap-6 p-6">
                    {error && (
                        <Alert
                            color="red"
                            icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                            className="mb-4"
                        >
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert
                            color="green"
                            icon={<CheckCircleIcon className="h-5 w-5" />}
                            className="mb-4"
                        >
                            {success}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            size="lg"
                            required
                            crossOrigin={undefined}
                        />
                        <Button type="submit" color="purple" fullWidth disabled={isLoading}>
                            {isLoading ? <Spinner className="h-5 w-5 mx-auto" /> : "Register"}
                        </Button>
                    </form>
                </CardBody>
                <CardFooter className="pt-2 text-center">
                    <Typography variant="small" className="flex justify-center">
                        Already have an account?
                        <Typography
                            as="a"
                            href="/login"
                            variant="small"
                            color="purple"
                            className="ml-1 font-bold hover:underline"
                        >
                            Sign In
                        </Typography>
                    </Typography>
                </CardFooter>
            </Card>
        </PageLayout>
    );
}

export default Register;