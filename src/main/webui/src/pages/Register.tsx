import React, { useState } from 'react';
import { Alert, Spinner, Typography } from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout";
import CustomFormButton from '../ui-component/CustomFormButton';
import { GradientCard } from '../ui-component/GradientCard';
import { FormInput } from '../ui-component/FormInput';
import { UserTypeToggle } from '../ui-component/UserTypeToggle';
import { GRADIENT_CLASSES } from '../constants/styles';
import {
    UserPlus,
    AlertTriangle,
    CheckCircle,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isArtist, setIsArtist] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                body: JSON.stringify({
                    name: username,
                    password: password,
                    email: email,
                    isArtist: isArtist
                }),
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

    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600"
        >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
    );

    const confirmPasswordToggle = (
        <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600"
        >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
    );

    const footer = (
        <Typography variant="small" className="flex justify-center items-center text-gray-600 dark:text-gray-400">
            Already have an account?
            <Typography
                as="a"
                href="/login"
                className="ml-2 font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200"
            >
                Sign In
            </Typography>
        </Typography>
    );

    return (
        <PageLayout pageTitle="Join CoPla Today!" contentMaxWidth="max-w-lg">
            <GradientCard
                title="Join CoPla"
                subtitle={isArtist ? "Start showcasing your art" : "Find amazing artists"}
                icon={UserPlus}
                footer={footer}
            >
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Alert color="error" className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            {error}
                        </Alert>
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Alert color="success" className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {success}
                        </Alert>
                    </motion.div>
                )}

                <UserTypeToggle
                    isArtist={isArtist}
                    setIsArtist={setIsArtist}
                    variant="register"
                />

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <FormInput
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={User}
                        required
                    />

                    <FormInput
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={Mail}
                        required
                    />

                    <FormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                        rightElement={passwordToggle}
                        required
                    />

                    <FormInput
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={Lock}
                        rightElement={confirmPasswordToggle}
                        required
                    />

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <CustomFormButton
                            type="submit"
                            disabled={isLoading}
                            className={`w-full ${GRADIENT_CLASSES.primaryButton} py-4 flex items-center justify-center gap-2`}
                        >
                            {isLoading ? (
                                <Spinner className="h-5 w-5" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </CustomFormButton>
                    </motion.div>
                </form>
            </GradientCard>
        </PageLayout>
    );
}

export default Register;