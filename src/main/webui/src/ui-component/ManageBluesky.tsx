import React, { useState } from "react";
import { Button, Input, Alert, Spinner, Typography, Card, CardBody } from "@material-tailwind/react";
import BlueskyVerif from "../resources/BlueskyVerif";

interface ManageBlueskyProps {
    username: string;
    onClose: () => void;
    onSuccess: () => void;
}

const ManageBluesky: React.FC<ManageBlueskyProps> = ({ username, onClose, onSuccess }) => {
    const [mode, setMode] = useState<"choice" | "manual" | "verify">("choice");
    const [handle, setHandle] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            const response = await fetch(`/api/users/${username}/social/bluesky`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: handle,
                    profileUrl,
                    isVerified: false
                })
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to add Bluesky account.");
            }
            setSuccess("Bluesky account added!");
            onSuccess();
            setTimeout(onClose, 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (mode === "verify") {
        return (
            <BlueskyVerif
                appUsername={username}
                onClose={onClose}
                onSuccess={() => {
                    onSuccess();
                    onClose();
                }}
            />
        );
    }

    if (mode === "manual") {
        return (
            <Card className="max-w-md mx-auto mt-4 shadow-xl">
                <CardBody>
                    <Typography variant="h5" className="mb-4">Add Bluesky Account (Unverified)</Typography>
                    {error && <Alert color="error" className="mb-2">{error}</Alert>}
                    {success && <Alert color="success" className="mb-2">{success}</Alert>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="w-72 space-y-1">
                            <Typography as="label" htmlFor="bluesky-handle" type="small" color="default" className="font-semibold">
                                Bluesky Handle
                            </Typography>
                            <Input
                                id="bluesky-handle"
                                placeholder="e.g. myuser.bsky.social"
                                value={handle}
                                onChange={e => setHandle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-72 space-y-1">
                            <Typography as="label" htmlFor="bluesky-profile-url" type="small" color="default" className="font-semibold">
                                Profile URL
                            </Typography>
                            <Input
                                id="bluesky-profile-url"
                                placeholder="https://bsky.app/profile/myuser.bsky.social"
                                value={profileUrl}
                                onChange={e => setProfileUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button type="submit" disabled={loading} isFullWidth={true}>
                                {loading ? <Spinner className="h-4 w-4" /> : "Save"}
                            </Button>
                            <Button type="button" onClick={onClose} isFullWidth={true}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        );
    }

    // Choice mode
    return (
        <Card className="max-w-md mx-auto mt-4 shadow-xl">
            <CardBody>
                <Typography variant="h5" className="mb-6 text-center">Add Bluesky Account</Typography>
                <div className="flex flex-col gap-4">
                    <Button  onClick={() => setMode("verify")} isFullWidth>
                        Add & Verify Bluesky Account
                    </Button>
                    <Button  onClick={() => setMode("manual")} isFullWidth>
                        Add Unverified Account (Manual)
                    </Button>
                    <Button onClick={onClose} isFullWidth>
                        Cancel
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default ManageBluesky;