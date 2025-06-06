import React, { createContext, useContext, useState } from "react";
import { Header } from "./Header"; // Adjust path if Header is elsewhere
import { Spinner } from "@material-tailwind/react"; // For a potential global loading state if needed
import { SiGithub } from "@icons-pack/react-simple-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { CoPlaIcon } from "./CustomIcons";

interface PageLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
    contentMaxWidth?: string; // e.g., "max-w-md", "max-w-lg", "max-w-2xl"
    isLoading?: boolean; // Optional global loading state for the page content
    loadingText?: string;
}

// --- Feedback Context ---
interface FeedbackContextType {
    showFeedbackModal: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};

// --- Feedback Modal Component ---
interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            // Save to Firebase Firestore instead of mailto
            await addDoc(collection(db, 'feedback'), {
                feedback: feedback.trim(),
                email: email.trim() || null,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                buildType: 'development'
            });
            
            setIsSubmitted(true);
            
            // Close modal after a delay
            setTimeout(() => {
                setIsSubmitted(false);
                setFeedback('');
                setEmail('');
                onClose();
            }, 2000);
            
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <motion.div 
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <motion.div 
                                className="flex items-center justify-between mb-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.2 }}
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Send Feedback
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </motion.div>
                            
                            <AnimatePresence mode="wait">
                                {isSubmitted ? (
                                    <motion.div 
                                        className="text-center py-8"
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        <motion.div 
                                            className="text-green-500 mb-2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
                                        >
                                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                        <motion.p 
                                            className="text-gray-700 dark:text-gray-300"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.3 }}
                                        >
                                            Thank you for your feedback!
                                        </motion.p>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        onSubmit={handleSubmit} 
                                        className="space-y-4"
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div 
                                            className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15, duration: 0.2 }}
                                        >
                                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                                <strong>Development Build:</strong> You're using a development version of CoPla. 
                                                Your feedback helps us improve the application!
                                            </p>
                                        </motion.div>
                                        
                                        <AnimatePresence>
                                            {error && (
                                                <motion.div 
                                                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.2 }}
                                        >
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email (optional)
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="your.email@example.com"
                                            />
                                        </motion.div>
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25, duration: 0.2 }}
                                        >
                                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Feedback *
                                            </label>
                                            <textarea
                                                id="feedback"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                required
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                placeholder="Share your thoughts, report bugs, or suggest improvements..."
                                            />
                                        </motion.div>
                                        
                                        <motion.div 
                                            className="flex gap-3 pt-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.2 }}
                                        >
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!feedback.trim() || isSubmitting}
                                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md transition-colors"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Feedback'}
                                            </button>
                                        </motion.div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PageLayout: React.FC<PageLayoutProps> = ({
                                                   children,
                                                   pageTitle,
                                                   contentMaxWidth = "max-w-xl", // Default to a slightly wider card
                                                   isLoading = false,
                                                   loadingText = "Loading, please wait..."
                                               }) => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const feedbackContextValue = {
        showFeedbackModal: () => setIsFeedbackModalOpen(true)
    };

    return (
        <FeedbackContext.Provider value={feedbackContextValue}>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex flex-col text-gray-800 dark:text-gray-200">
                <Header />
                <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 pt-10 sm:pt-12 lg:pt-16">
                    {pageTitle && (
                        <div className="flex items-center gap-3 mb-8">
                            <CoPlaIcon className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center">
                                {pageTitle}
                            </h1>
                        </div>
                    )}
                    <div className={`w-full ${contentMaxWidth}`}>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-10 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                                <Spinner className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{loadingText}</p>
                            </div>
                        ) : (
                            children
                        )}
                    </div>
                </main>
                <footer className="py-6 text-center text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-6">
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-600 transition-all cursor-pointer hover:scale-105 transform"
                            onClick={() => window.open("https://github.com/Neroil/copla", "_blank")}
                            title="Star us on GitHub!"
                        >
                            <SiGithub className="text-gray-600 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Star us on GitHub!</span>
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} CoPla - Art Commission Platform. Early Alpha Development Build.
                        </div>
                    </div>
                </footer>
                
                {/* Feedback Modal - renders at page level */}
                <FeedbackModal 
                    isOpen={isFeedbackModalOpen} 
                    onClose={() => setIsFeedbackModalOpen(false)} 
                />
            </div>
        </FeedbackContext.Provider>
    );
};

export { PageLayout};