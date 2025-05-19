import React, { useEffect, useState } from 'react';
import { Agent } from '@atproto/api';
import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import { Alert, Button, Card, CardBody, CardHeader, Spinner, Typography } from '@material-tailwind/react';

interface BlueskyVerifProps {
    appUsername: string;
    onClose: () => void;
    onSuccess: (message: string) => void;
}

const BlueskyVerif: React.FC<BlueskyVerifProps> = ({ appUsername, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('initial'); // 'initial', 'authenticating', 'authenticated'
    const [profileData, setProfileData] = useState<any>(null);
    const [agent, setAgent] = useState<Agent | null>(null);
    const [sessionStore, setSessionStore] = useState<any | null>(null);

    // App configuration that can be easily modified
    const appConfig = {
        baseUrl: window.location.origin,
        appName: "YourAppName Bluesky Verification"
    };

    useEffect(() => {
        const initializeOAuth = async () => {
            try {
                setLoading(true);
                setError(null);

                const oauthClient = await BrowserOAuthClient.load({
                    clientId: `${appConfig.baseUrl}/client-metadata.json`,
                    handleResolver: 'https://bsky.social/'
                });

                const result = await oauthClient.init();

                if (result) {
                    if ('state' in result) {
                        setStatus('authenticated');
                        console.log('The user was just redirected back from the authorization page');
                    }

                    console.log(`The user is currently signed in as ${result.session.did}`);
                    const newAgent = new Agent(result.session);
                    setSessionStore(result.session);

                    setAgent(newAgent);
                    setStatus('authenticated');

                    // Fetch profile after authentication
                    if (newAgent.did) {
                        try {
                            const profile = await newAgent.getProfile({ actor: newAgent.did });
                            setProfileData(profile.data);
                        } catch (profileError) {
                            console.error('Error fetching profile:', profileError);
                        }
                    }
                } else {
                    setStatus('initial');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to initialize OAuth');
                console.error('OAuth initialization error:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeOAuth();
    }, []);

    const handleAuthenticate = async () => {
        try {
            setLoading(true);
            setError(null);
            setStatus('authenticating');

            const oauthClient = await BrowserOAuthClient.load({
                clientId: `${appConfig.baseUrl}/client-metadata.json`,
                handleResolver: 'https://bsky.social/'
            });

            // Get the handle from user input or use a fixed one
            const handle = prompt('Enter your Bluesky handle (e.g., username.bsky.social)');
            if (!handle) {
                setError('Authentication canceled');
                setStatus('initial');
                setLoading(false);
                return;
            }

            const url = await oauthClient.authorize(handle, {
                scope: 'atproto transition:generic'
            });

            // Store the app username in session storage for retrieval after redirect
            sessionStorage.setItem('bluesky_verification_for', appUsername);

            // Redirect the user to the authorization page
            window.location.href = url.toString();

        } catch (err: any) {
            setError(err.message || 'Failed to authenticate');
            setStatus('initial');
            console.error('Authentication error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAccount = async () => {
        if (!agent || !profileData) {
            setError('No authenticated session available');
            return;
        }

        try {
            setLoading(true);

            // Make API call to your backend to link the Bluesky account
            const response = await fetch('/api/users/link-bluesky', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blueskyDid: agent.did,
                    blueskyHandle: profileData.handle,
                    blueskyDisplayName: profileData.displayName,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Failed to link account: ${response.status}`);
            }

            onSuccess(`Successfully linked Bluesky account ${profileData.handle}`);
        } catch (err: any) {
            setError(err.message || 'Failed to verify account');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (agent) {
            try {
                await sessionStore.signOut()
                setStatus('initial');
                setAgent(null);
                setProfileData(null);
            } catch (err) {
                console.error('Error signing out:', err);
            }
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader
                variant="gradient"
                className="h-16 flex items-center justify-center"
            >
                <Typography variant="h5" className="font-medium">
                    Bluesky Account Verification
                </Typography>
            </CardHeader>

            <CardBody className="flex flex-col gap-4">
                {error && (
                    <Alert color="error" variant="solid" className="mb-4">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Spinner className="h-12 w-12" />
                        <Typography className="mt-4 text-center text-gray-700">
                            {status === 'authenticating' ? 'Redirecting to Bluesky...' : 'Loading your Bluesky profile...'}
                        </Typography>
                    </div>
                ) : (
                    <>
                        {status === 'initial' ? (
                            <div className="text-center py-4">
                                <Typography className="mb-4">
                                    Link your Bluesky account to verify your identity
                                </Typography>
                                <Button
                                    size="lg"
                                    className="bg-purple-500 dark:bg-purple-100 text-white dark:text-black mt-4"
                                    onClick={handleAuthenticate}
                                >
                                    Connect to Bluesky
                                </Button>
                            </div>
                        ) : (
                            <div className="py-2">
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
                                    <Typography variant="h6" className="text-gray-800 dark:text-gray-200 mb-2">
                                        Connected Account
                                    </Typography>
                                    {profileData ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-2">
                                                {profileData.avatar && (
                                                    <img
                                                        src={profileData.avatar}
                                                        alt={`${profileData.handle}'s avatar`}
                                                        className="h-10 w-10 rounded-full"
                                                    />
                                                )}
                                                <div>
                                                    <Typography variant="h6" className="font-medium">
                                                        {profileData.displayName || profileData.handle}
                                                    </Typography>
                                                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                                                        @{profileData.handle}
                                                    </Typography>
                                                </div>
                                            </div>
                                            {profileData.description && (
                                                <Typography variant="small" className="text-gray-700 dark:text-gray-300 mt-2">
                                                    {profileData.description}
                                                </Typography>
                                            )}
                                        </>
                                    ) : (
                                        <Typography>Connected to Bluesky</Typography>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button onClick={handleVerifyAccount} disabled={loading}>
                                        Verify Account
                                    </Button>
                                    <Button variant="outline" color="error" onClick={handleSignOut} disabled={loading}>
                                        Disconnect
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-end mt-2">
                    <Button className="bg-purple-500 dark:bg-purple-100 text-white dark:text-black" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default BlueskyVerif;