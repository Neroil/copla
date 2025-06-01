import { Agent } from '@atproto/api';

export interface BlueskyFollowData {
    handle: string;
    did: string;
    displayName: string;
}

export class BlueskyService {
    static async syncFollowingWithBackend(username: string, following: BlueskyFollowData[]): Promise<{ syncedCount: number; linkedCount: number }> {
        const response = await fetch(`/api/users/${username}/sync-bluesky-following`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ following }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Failed to sync following: ${response.status}`);
        }

        return response.json();
    }

    static async createAgentFromStoredSession(username: string): Promise<Agent | null> {
        try {
            // Use the session endpoint to get decrypted session data
            const response = await fetch(`/api/users/${username}/bluesky-session`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sessionData) {
                    const parsedSession = JSON.parse(data.sessionData);
                    return new Agent(parsedSession);
                }
            }

            // Fallback to browser OAuth session if no stored session
            const { BrowserOAuthClient } = await import('@atproto/oauth-client-browser');
            const oauthClient = await BrowserOAuthClient.load({
                clientId: `${window.location.origin}/client-metadata.json`,
                handleResolver: 'https://bsky.social/'
            });

            const result = await oauthClient.init();
            return result ? new Agent(result.session) : null;

        } catch (error) {
            console.error('Error creating agent from stored session:', error);
            return null;
        }
    }

    static async fetchBlueskyFollowing(agent: Agent, limit: number = 100): Promise<BlueskyFollowData[]> {
        const followsResponse = await agent.getFollows({
            actor: agent.did!,
            limit
        });

        if (!followsResponse.data.follows) {
            return [];
        }

        return followsResponse.data.follows.map((follow: any) => ({
            handle: follow.handle,
            did: follow.did,
            displayName: follow.displayName || follow.handle
        }));
    }
}
