import "./index.css";
import { useAuthStatus } from "./resources/AuthStatus.tsx";
import { PageLayout } from "./ui-component/PageLayout.tsx";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { Users, Search, MapPin, Zap, Rocket, Gift, Sparkles} from "lucide-react";
import { BlueskyIcon } from "./ui-component/CustomIcons.tsx";
import { motion, AnimatePresence } from "framer-motion";
import CustomFormButton from "./ui-component/CustomFormButton.tsx";
import { GRADIENT_CLASSES } from './constants/styles';

function App() {
    const { loading: authLoading, isLoggedIn } = useAuthStatus();
    const [userType, setUserType] = useState<'client' | 'artist'>('client');
    const [loading, setLoading] = useState(false);

    // Handle user type change with loading animation
    const handleUserTypeChange = (newType: 'client' | 'artist') => {
        if (userType === newType) return;
        setLoading(true);
        setTimeout(() => {
            setUserType(newType);
            setLoading(false);
        }, 200);
    };

    return (
        <PageLayout contentMaxWidth="w-full">
            <div className="container mx-auto px-4 py-8 space-y-20">
                {/* Brand Header */}
                <section className="text-center pt-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
                            CoPla
                        </h1>
                        <motion.p 
                            className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-700 dark:text-gray-300 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:via-indigo-500 hover:to-teal-500 hover:bg-clip-text hover:text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400"
                                whileHover={{ 
                                    scale: 1.1, 
                                    rotate: [0, -2, 2, -1, 1, 0],
                                    transition: { 
                                        rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
                                        scale: { duration: 0.2 }
                                    }
                                }}
                            >
                                Find.
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.7 }}
                                className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:via-indigo-500 hover:to-teal-500 hover:bg-clip-text hover:text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400"
                                whileHover={{ 
                                    scale: 1.1, 
                                    rotate: [0, -2, 2, -1, 1, 0],
                                    transition: { 
                                        rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
                                        scale: { duration: 0.2 }
                                    }
                                }}
                            >
                                Follow.
                            </motion.span>{" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8, duration: 0.9 }}
                                className="cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:via-indigo-500 hover:to-teal-500 hover:bg-clip-text hover:text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400"
                                whileHover={{ 
                                    scale: 1.1, 
                                    rotate: [0, -2, 2, -1, 1, 0],
                                    transition: { 
                                        rotate: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
                                        scale: { duration: 0.2 }
                                    }
                                }}
                            >
                                Commission.
                            </motion.span>
                        </motion.p>
                    </div>
                </section>

                {/* Improved User Type Toggle */}
                <section className="text-center">
                    <div className="flex justify-center gap-6 mb-8">
                        {['client', 'artist'].map((type) => (
                            <CustomFormButton
                                key={type}
                                onClick={() => handleUserTypeChange(type as 'client' | 'artist')}
                                className={`px-14 py-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
                                    userType === type
                                        ? type === 'client' 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg text-white dark:text-white'
                                            : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg text-white dark:text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                                }`}
                                isFullWidth={false}
                                aria-pressed={userType === type}
                            >
                                {type === 'client' ? "I'm looking for an artist" : "I'm an artist"}
                            </CustomFormButton>
                        ))}
                    </div>
                </section>

                {/* Hero Section with Animation */}
                <AnimatePresence mode="wait">
                    <motion.section
                        key={userType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <div className="max-w-5xl mx-auto">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
                                {userType === 'client' ? 'Find Your Favorite Artist' : 'Connect With Your Followers'}
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                                {userType === 'client' 
                                    ? 'Discover talented artists, or find the ones that you already follow and see their commission availability at a glance.'
                                    : 'Showcase your commission status and connect with potential clients who love your style.'
                                }
                                <span className="block mt-2 font-medium text-gray-800 dark:text-gray-200">
                                    {userType === 'client'
                                        ? 'Browse portfolios, check availability, and commission directly through CoPla!'
                                        : 'Let clients find you easily when your commissions are open!'
                                    }
                                </span>
                            </p>

                            {authLoading ? (
                                <div className="animate-pulse h-16 w-64 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
                            ) : !isLoggedIn &&(
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                                >
                                    <Button
                                        size="lg"
                                        className={`${GRADIENT_CLASSES.button} rounded-full px-10 py-4 text-lg font-bold transform hover:scale-105`}
                                        ripple={true}
                                        onClick={() => window.location.href='/register'}
                                    >
                                        {userType === 'client' ? 'Start Finding Artists' : 'Join as Artist'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full px-10 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                                        ripple={true}
                                        onClick={() => window.location.href='/login'}
                                    >
                                        Sign In
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </motion.section>
                </AnimatePresence>

                {/* Loading state */}
                {loading && (
                    <div className="text-center text-gray-400 text-xl mb-16">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-flex items-center gap-2"
                        >
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                            Switching perspective...
                        </motion.div>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Quick Action Section - Only show when logged in */}
                        {isLoggedIn && (
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center"
                            >
                                <div className="max-w-3xl mx-auto">
                                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                                        {userType === 'client' ? 'Ready to Commission?' : 'Ready to Get Discovered?'}
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                                        {userType === 'client'
                                            ? 'Browse artists, check their commission status, and connect with creators whose style matches your vision.'
                                            : 'Manage your commission availability and let clients easily find you when you\'re open for work.'
                                        }
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                            ripple={true}
                                            onClick={() => window.location.href = userType === 'client' ? '/artists' : '/commissions'}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-8 h-8" />
                                                <span>{userType === 'client' ? 'Browse Artists' : 'Check Competition'}</span>
                                            </div>
                                        </Button>
                                        <Button
                                            size="lg"
                                            className="bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                            ripple={true}
                                            onClick={() => window.location.href = userType === 'client' ? '/profile' : '/profile'}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8" />
                                                <span>{userType === 'client' ? 'Edit Profile' : 'Setup My Status'}</span>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Social Platform Introduction */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                                    Connect Artists Across Social Platforms
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    {userType === 'client' 
                                        ? 'Artists showcase their work across various social platforms, but finding who\'s available for commissions can be a challenge.'
                                        : 'You share your art on social media, but potential clients might not know when you\'re open for commissions.'
                                    }
                                </p>
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <BlueskyIcon className="w-8 h-8 text-blue-500" />
                                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">But we use Bluesky!</h3>
                                    </div>
                                    <div className="text-left max-w-2xl mx-auto space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Rocket className="w-6 h-6 mt-1 text-purple-600" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Growing X/Twitter Alternative</h4>
                                                <p className="text-gray-600 dark:text-gray-400">Bluesky is the new growing social platform where many artists are migrating from X/Twitter</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Gift className="w-6 h-6 mt-1 text-green-600" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Free & Open API</h4>
                                                <p className="text-gray-600 dark:text-gray-400">Unlike other platforms, Bluesky's API is completely free and accessible to developers</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-6 h-6 mt-1 text-pink-600" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Everyone Should Move There Anyway</h4>
                                                <p className="text-gray-600 dark:text-gray-400">It's decentralized, artist-friendly, and the future of social media</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        {/* Features Section */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="py-16"
                        >
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                                    Why Choose CoPla?
                                </h2>
                                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                    The perfect bridge between artists and commission opportunities
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                                <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <BlueskyIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Social Integration</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                        {userType === 'client'
                                            ? 'Discover artists directly from social platforms with real-time commission availability status and portfolio access.'
                                            : 'Seamlessly link your social accounts and automatically sync your art posts and commission status.'
                                        }
                                    </p>
                                </div>
                                
                                <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {userType === 'client' ? <Search className="w-8 h-8 text-white" /> : <MapPin className="w-8 h-8 text-white" />}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                        {userType === 'client' ? 'Easy Discovery' : 'Visibility Control'}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                        {userType === 'client'
                                            ? 'Filter artists by availability, style, price range, and commission type to find the perfect match for your project.'
                                            : 'Control when clients can find you - toggle your commission status and let CoPla handle the rest.'
                                        }
                                    </p>
                                </div>
                                
                                <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-700 transform hover:-translate-y-2">
                                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Direct Connection</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                        {userType === 'client'
                                            ? 'Connect directly with artists through their preferred platforms while tracking commission progress in one place.'
                                            : 'Get contacted by serious clients who already know your availability and commission details.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Call to Action Section */}
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 dark:from-purple-700 dark:via-indigo-700 dark:to-teal-700 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 max-w-4xl mx-auto px-8">
                                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                                    {userType === 'client' ? 'Ready to Find Your Perfect Artist?' : 'Ready to Get Discovered?'}
                                </h2>
                                <p className="text-xl sm:text-2xl mb-12 opacity-90 leading-relaxed">
                                    {userType === 'client'
                                        ? 'Join thousands who are discovering amazing artists and commissioning unique artwork'
                                        : 'Connect with clients who are actively looking for artists with your unique style and availability'
                                    }
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                    <Button
                                        size="lg"
                                        className="bg-white text-purple-700 hover:bg-gray-100 font-bold rounded-full px-10 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        onClick={() => window.location.href='/register'}
                                    >
                                        {userType === 'client' ? 'Start Browsing Artists' : 'Join the Platform'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                                        onClick={() => window.location.href='/commissions'}
                                    >
                                        {userType === 'client' ? 'Learn More' : 'View Success Stories'}
                                    </Button>
                                </div>
                            </div>
                        </motion.section>
                    </>
                )}
            </div>
        </PageLayout>
    );
}

export default App;