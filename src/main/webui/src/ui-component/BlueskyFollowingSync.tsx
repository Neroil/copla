import React, { useState, useEffect } from 'react';
import { Spinner } from '@material-tailwind/react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomFormButton from './CustomFormButton';
import { BlueskyService } from '../services/BlueskyService';
import { useNavigate } from 'react-router';

interface BlueskyFollowingSyncProps {
    username: string;
    onSync?: (username: string) => Promise<void>;
    className?: string;
}

const BlueskyFollowingSync: React.FC<BlueskyFollowingSyncProps> = ({ 
    username, 
    onSync,
    className = "" 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    // Auto-dismiss messages after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleVerifyAccountRedirect = () => {
        sessionStorage.setItem('copla_show_social_management', 'true');
        sessionStorage.setItem('copla_show_bluesky_verification', 'true');
        navigate(`/users/${username}`);
    };

    const handleManualSync = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Try to get agent from stored session
            const agent = await BlueskyService.createAgentFromStoredSession(username);

            if (!agent) {
                setError('No active Bluesky session found. Please verify your account first.');
                return;
            }

            // Fetch following list
            const following = await BlueskyService.fetchBlueskyFollowing(agent);
            
            if (following.length === 0) {
                setSuccess('No following data found to sync.');
                return;
            }

            // Sync with backend
            const result = await BlueskyService.syncFollowingWithBackend(username, following);
            
            setSuccess(`Successfully rebuilt following list with ${result.syncedCount} followers. ${result.linkedCount} are linked to app users.`);
            
            // Call the onSync callback to refresh the parent component
            if (onSync) {
                await onSync(username);
            }

        } catch (err: any) {
            setError(err.message || 'Failed to sync Bluesky following');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className={`flex items-center gap-3 ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                transition={{ duration: 0.2 }}
            >
                <CustomFormButton
                    onClick={handleManualSync}
                    disabled={loading}
                    isFullWidth={false}
                    className="flex items-center gap-2 text-xs px-2 py-1"
                    size="sm"
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Spinner className="h-3 w-3" />
                                </motion.div>
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Syncing...
                                </motion.span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <motion.svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth={1.5} 
                                    stroke="currentColor" 
                                    className="w-3 h-3"
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </motion.svg>
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    Sync
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CustomFormButton>
            </motion.div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                            {error.includes('Please verify your account first') && (
                                <motion.button
                                    onClick={handleVerifyAccountRedirect}
                                    className="underline hover:no-underline font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Verify now
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
                
                {success && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1"
                    >
                        <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BlueskyFollowingSync;
