import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BrowserOAuthClient } from '@atproto/oauth-client-browser';

const BlueskyCallback = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [, setProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Try to extract username from sessionStorage (set before redirect)
                const username = sessionStorage.getItem('bluesky_verification_for');

                // Load the OAuth client
                const oauthClient = await BrowserOAuthClient.load({
                    clientId: `${window.location.origin}/client-metadata.json`,
                    handleResolver: 'https://bsky.social/'
                });

                // This completes the OAuth flow
                await oauthClient.init();

                // Success path - redirect to profile or original page
                if (username) {
                    navigate(`/users/${username}`, { replace: true });
                    sessionStorage.removeItem('bluesky_verification_for');
                } else {
                    navigate("/", { replace: true });
                }
            } catch (err: any) {
                console.error("Error processing OAuth callback:", err);
                setError(err.message || "Failed to process Bluesky authentication");
                setProcessing(false);
            }
        };

        handleCallback();
    }, [navigate]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md max-w-md mx-auto mt-8">
                <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg">Processing Bluesky authentication...</p>
        </div>
    );
};

export default BlueskyCallback;