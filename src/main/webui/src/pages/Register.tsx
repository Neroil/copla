import { Header } from "../ui-component/Header.tsx";
import {
    Card,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import React, { useState } from 'react'; // Import useState

function Register() {
    // State for form fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    // State for error/success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password || !email) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
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
                setSuccess(result.message || 'Registration successful!');
                setTimeout(() => window.location.href = '/login', 2000);
            } else {
                setError(result.message || `Registration failed: ${response.statusText}`);
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-violet-100 flex flex-col">
            <Header />
            <main className="p-4 flex justify-center items-center grow w-full">
                <Card className="w-full max-w-md">
                    <CardBody>
                        <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
                            Register
                        </Typography>
                        {error && <Typography color="red" className="mb-4 text-center text-sm">{error}</Typography>}
                        {success && <Typography color="green" className="mb-4 text-center text-sm">{success}</Typography>}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input
                                type="text"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                size="lg"
                                required
                            />
                            <Input
                                type="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="lg"
                                required
                            />
                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size="lg"
                                required
                            />
                            <Input
                                type="password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                size="lg"
                                required
                            />
                            <Button type="submit" fullWidth>
                                Register
                            </Button>
                        </form>
                        <Typography variant="small" className="mt-6 flex justify-center">
                            Already have an account?
                            <a
                                href="/login"
                                className="ml-1 font-medium text-blue-500 transition-colors hover:text-blue-700"
                            >
                                Sign In
                            </a>
                        </Typography>
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}

export default Register;