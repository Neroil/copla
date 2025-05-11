// --- START OF FILE App.tsx ---

import "./index.css";
import { useAuthStatus } from "./resources/AuthStatus.tsx";
// Header is now part of PageLayout, so we don't import it directly here
// import { Header } from "./ui-component/Header.tsx";
import { FeaturedCommissionCard } from "./ui-component/FeaturedCommissionCard.tsx";
import { PageLayout } from "./ui-component/PageLayout.tsx"; // Import PageLayout
import { Button, Avatar } from "@material-tailwind/react"; // For styling consistency with other pages

function App() {
    const { loading, username, isLoggedIn } = useAuthStatus();

    // Common gradient classes for buttons, similar to Header.tsx
    const COMMON_GRADIENT_CLASSES_BUTTON = "bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 hover:from-purple-600 hover:via-indigo-600 hover:to-teal-600 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 dark:hover:from-purple-500 dark:hover:via-indigo-500 dark:hover:to-teal-500 text-white transition-all duration-300";
    const COMMON_GRADIENT_CLASSES_AVATAR = "bg-gradient-to-r from-teal-500 to-pink-500";


    return (
        <PageLayout contentMaxWidth="w-full"> {/* Use PageLayout, Header is included in it */}
            {/* The main content of App.tsx is now a direct child of PageLayout */}
            <div className="container mx-auto px-4 py-12 space-y-12">
                <section className="text-center pt-8 md:pt-12"> {/* Added some top padding */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent">
                        Find Your Perfect Art Commission
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        Connect with talented artists and bring your creative visions to life. Explore a universe of styles and possibilities.
                    </p>

                    {loading ? (
                        <div className="animate-pulse h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto"></div>
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-4 justify-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md max-w-xs mx-auto">
                            <Avatar
                                src={`https://avatar.iran.liara.run/public}
                                ?username=${username}`}
                                className={`h-16 w-16 ${COMMON_GRADIENT_CLASSES_AVATAR} rounded-full`}
                            />
                            <div>
                                <span className="text-gray-600 dark:text-gray-400 block text-sm">Welcome back,</span>
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{username}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                color="primary" // Using Material Tailwind Button
                                size="lg"
                                className={`${COMMON_GRADIENT_CLASSES_BUTTON} rounded-full px-8 py-3 font-medium`}
                                ripple={true}
                                onClick={() => window.location.href='/login'} // Use Button's onClick or as="a"
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outline"
                                color="secondary" // A neutral color for outlined button
                                size="lg"
                                className="rounded-full px-8 py-3 font-medium border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                ripple={true}
                                onClick={() => window.location.href='/register'}
                            >
                                Register
                            </Button>
                        </div>
                    )}
                </section>

                {/* Featured Grid Section */}
                <section className="mt-16 md:mt-20"> {/* Adjusted margin */}
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                        Featured Commissions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <FeaturedCommissionCard key={item} />
                        ))}
                    </div>
                </section>

                {/* Call to Action Section - Example */}
                <section className="mt-16 md:mt-20 py-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 dark:from-purple-600 dark:via-indigo-600 dark:to-teal-600 rounded-xl text-white text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Artistic Journey?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Whether you're an artist looking to share your talent or a client seeking unique creations, CoPla is your platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            color="primary"
                            className="text-purple-600 font-semibold rounded-full px-8 py-3"
                            onClick={() => window.location.href='/register'}
                        >
                            Join as an Artist
                        </Button>
                        <Button
                            variant="outline"
                            color="secondary"
                            className="border-white text-white hover:bg-white/10 rounded-full px-8 py-3"
                            onClick={() => window.location.href='/commissions'}
                        >
                            Browse Commissions
                        </Button>
                    </div>
                </section>
            </div>
        </PageLayout>
    );
}

export default App;
// --- END OF FILE App.tsx ---