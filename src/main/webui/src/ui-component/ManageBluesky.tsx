import React, { useState } from 'react';
import { Typography, Input, Alert, Spinner } from '@material-tailwind/react';
import CustomFormButton from './CustomFormButton';
import { ExclamationTriangleIcon } from '../ui-component/CustomIcons';
import BlueskyVerif from '../resources/BlueskyVerif';

interface ManageBlueskyProps {
    username: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ManageBluesky: React.FC<ManageBlueskyProps> = ({ username, onClose, onSuccess }) => {
    const [mode, setMode] = useState<'select' | 'verify' | 'manual'>('select');
    const [blueskyHandle, setBlueskyHandle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const addBlueskyAccount = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!blueskyHandle) {
            setError('Please enter a valid Bluesky handle');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Call your API to add a Bluesky account
            const response = await fetch(`/api/users/${username}/social/bluesky`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: blueskyHandle,
                    platform: 'bluesky',
                    isVerified: false, // Manual mode is always unverified
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add Bluesky account');
            }

            setSuccess('Bluesky account added successfully!');
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'An error occurred while adding your Bluesky account');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = (message: string) => {
        setSuccess(message);
        setTimeout(() => {
            onSuccess();
        }, 1500);
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <div className="text-center mb-6">
                <Typography variant="h4" className="font-bold text-gray-800 dark:text-gray-200">
                    {mode === 'select' ? 'Add Bluesky Account' : 
                     mode === 'verify' ? 'Verify Bluesky Account' : 'Add Unverified Account'}
                </Typography>
                <Typography className="text-gray-600 dark:text-gray-400 mt-2">
                    {mode === 'select' ? 'Choose how you want to add your Bluesky account' : 
                     mode === 'verify' ? 'Connect your Bluesky account for verification' : 
                     'Manually add your Bluesky handle'}
                </Typography>
            </div>

            {error && (
                <Alert color="error" className="mb-4">
                    <div className="flex items-center">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                </Alert>
            )}
            
            {success && (
                <Alert color="success" className="mb-4">
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {success}
                    </div>
                </Alert>
            )}

            {mode === 'select' ? (
                <div className="flex flex-col gap-4">
                    <CustomFormButton onClick={() => setMode("verify")}>
                        Add & Verify Bluesky Account
                    </CustomFormButton>
                    
                    <CustomFormButton onClick={() => setMode("manual")}>
                        Add Unverified Account (Manual)
                    </CustomFormButton>
                    
                    <CustomFormButton onClick={onClose}>
                        Cancel
                    </CustomFormButton>
                </div>
            ) : mode === 'verify' ? (
                <BlueskyVerif 
                    appUsername={username} 
                    onClose={() => setMode("select")} 
                    onSuccess={handleVerificationSuccess} 
                />
            ) : (
                <form onSubmit={addBlueskyAccount} className="space-y-5">
                    <div>
                        <Input
                            value={blueskyHandle}
                            onChange={(e) => setBlueskyHandle(e.target.value)}
                            size="lg"
                            placeholder="username.bsky.social"
                            required
                            disabled={loading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !loading) {
                                    e.preventDefault();
                                    addBlueskyAccount(e as unknown as React.FormEvent);
                                }
                            }}
                        />
                        <Typography className="text-xs text-gray-500 mt-1">
                            Enter your Bluesky handle without the @ symbol
                        </Typography>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <CustomFormButton onClick={() => setMode("select")} className="bg-gray-500 hover:bg-gray-600">
                            Back
                        </CustomFormButton>
                        <CustomFormButton type="submit" disabled={loading}>
                            {loading ? <Spinner className="h-4 w-4" /> : "Save"}
                        </CustomFormButton>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ManageBluesky;