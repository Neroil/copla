// --- START OF FILE App.tsx ---

import "./index.css";
import { useAuthStatus } from "./resources/AuthStatus.tsx";
import { PageLayout } from "./ui-component/PageLayout.tsx";
import { Button, Avatar } from "@material-tailwind/react";

function App() {
    const { loading, username, isLoggedIn } = useAuthStatus();

    const COMMON_GRADIENT_CLASSES_BUTTON = "bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-700 hover:via-indigo-700 hover:to-teal-700 dark:from-purple-500 dark:via-indigo-500 dark:to-teal-500 dark:hover:from-purple-600 dark:hover:via-indigo-600 dark:hover:to-teal-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl";
    const COMMON_GRADIENT_CLASSES_AVATAR = "bg-gradient-to-r from-teal-500 to-pink-500";

    return (
        <PageLayout contentMaxWidth="w-full">
            <div className="container mx-auto px-4 py-8 space-y-20">
                {/* Hero Section */}
                <section className="text-center pt-12 md:pt-20">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent leading-tight">
                            Connect. Create. Commission.
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
                            The ultimate platform where visionary clients meet talented artists. 
                            <span className="block mt-2 font-medium text-gray-800 dark:text-gray-200">
                                Bring your creative dreams to life with custom artwork that tells your story.
                            </span>
                        </p>

                        {loading ? (
                            <div className="animate-pulse h-16 w-64 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
                        ) : isLoggedIn ? (
                            <div className="flex items-center gap-6 justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-200/50 dark:border-gray-700/50">
                                <Avatar
                                    src={`https://avatar.iran.liara.run/public?username=${username}`}
                                    alt={`${username}'s avatar`}
                                    className={`h-20 w-20 ${COMMON_GRADIENT_CLASSES_AVATAR} rounded-full ring-4 ring-white dark:ring-gray-800`}
                                />
                                <div className="text-left">
                                    <span className="text-gray-500 dark:text-gray-400 block text-sm font-medium">Welcome back,</span>
                                    <span className="font-bold text-2xl text-gray-900 dark:text-white">{username}</span>
                                    <span className="text-purple-600 dark:text-purple-400 block text-sm font-medium mt-1">Ready to create?</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Button
                                    size="lg"
                                    className={`${COMMON_GRADIENT_CLASSES_BUTTON} rounded-full px-10 py-4 text-lg font-bold transform hover:scale-105`}
                                    ripple={true}
                                    onClick={() => window.location.href='/register'}
                                >
                                    Start Your Journey
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
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Action Section */}
                <section className="text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                            Ready to Start Creating?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                            Whether you're seeking custom artwork or showcasing your artistic talents, 
                            your creative journey begins here.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                ripple={true}
                                onClick={() => window.location.href='/users'}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">🎨</span>
                                    <span>Find Artists</span>
                                </div>
                            </Button>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                ripple={true}
                                onClick={() => window.location.href='/commissions'}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">💼</span>
                                    <span>Browse Commissions</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Why Choose CoPla?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            We've built the perfect ecosystem for artistic collaboration
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">👥</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">For Clients</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                Discover exceptional artists, review portfolios, and commission unique artwork that brings your vision to life with transparent pricing and secure transactions.
                            </p>
                        </div>
                        
                        <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🎨</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">For Artists</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                Showcase your talent, connect with clients who value your art, manage commissions effortlessly, and build a sustainable creative career.
                            </p>
                        </div>
                        
                        <div className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-700 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Seamless Experience</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                Intuitive platform design, clear communication tools, fair terms, and a focus on creativity make every collaboration smooth and enjoyable.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 dark:from-purple-700 dark:via-indigo-700 dark:to-teal-700 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-8">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Transform Ideas into Art?</h2>
                        <p className="text-xl sm:text-2xl mb-12 opacity-90 leading-relaxed">
                            Join thousands of artists and clients who are already creating amazing collaborations on CoPla
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-white text-purple-700 hover:bg-gray-100 font-bold rounded-full px-10 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                onClick={() => window.location.href='/register'}
                            >
                                Join as an Artist
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                                onClick={() => window.location.href='/commissions'}
                            >
                                Start Commissioning
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default App;