// --- START OF FILE App.tsx ---

import "./index.css";
import { useAuthStatus } from "./resources/AuthStatus.tsx";
// FeaturedCommissionCard is no longer needed
// import { FeaturedCommissionCard } from "./ui-component/FeaturedCommissionCard.tsx";
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
                {/* Hero Section */}
                <section className="text-center pt-8 md:pt-12"> {/* Added some top padding */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-500 to-teal-500 dark:from-purple-400 dark:via-indigo-400 dark:to-teal-400 bg-clip-text text-transparent">
                        Find Your Perfect Artist
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-10">
                        You'll never have to scroll your twitter feed to find the perfect artist for your commission again. <br/> <br/> CoPla is a platform that connects artists and clients, making it easier than ever to find the right fit for your project.
                    </p>

                    {loading ? (
                        <div className="animate-pulse h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg mx-auto"></div>
                    ) : isLoggedIn ? (
                        <div className="flex items-center gap-4 justify-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md max-w-xs mx-auto">
                            <Avatar
                                src={`https://avatar.iran.liara.run/public?username=${username}`} // Corrected Avatar URL
                                alt={`${username}'s avatar`}
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
                                onClick={() => window.location.href='/login'}
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

                {/* Main Call to Action Button Section */}
                <section className="text-center mt-12 md:mt-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 dark:text-white">
                        Ready to Bring Your Vision to Life?
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                        Connect with talented artists ready to create custom artwork tailored to your desires.
                    </p>
                    <Button
                        size="lg"
                        className={`${COMMON_GRADIENT_CLASSES_BUTTON} rounded-full px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                        ripple={true}
                        onClick={() => window.location.href='/commissions'}
                    >
                        Find Your Future Artist to Commission!
                    </Button>
                </section>

                {/* Features Section */}
                <section className="mt-16 md:mt-20 py-12">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-white">
                        Why Choose CoPla?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {/* Feature 1 */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
                            {/* Optional: Add an icon here, e.g., using an SVG or an icon font like Heroicons or FontAwesome */}
                            {/* Example: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M..." /></svg> */}
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">For Clients</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Discover a diverse pool of talented artists. Easily browse portfolios, compare styles, and initiate commissions securely. Your vision, expertly crafted.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
                            {/* Optional: Icon */}
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">For Artists</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Showcase your unique artwork to a targeted audience. Manage your commissions, build your brand, and connect with clients who appreciate your talent.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
                            {/* Optional: Icon */}
                            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Seamless Experience</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our platform is designed to make the commission process smooth and enjoyable for everyone. Clear communication, fair terms, and a focus on creativity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section - Kept from original */}
                <section className="mt-16 md:mt-20 py-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 dark:from-purple-600 dark:via-indigo-600 dark:to-teal-600 rounded-xl text-white text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Artistic Journey?</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">
                        Whether you're an artist looking to share your talent or a client seeking unique creations, CoPla is your platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            color={"primary"} // Material Tailwind primary color
                            className="text-purple-600 font-semibold rounded-full px-8 py-3" // This button's appearance might differ from gradient buttons. Review if needed.
                            onClick={() => window.location.href='/register'}
                        >
                            Join as an Artist
                        </Button>
                        <Button
                            variant="outline"
                            color="secondary" // Material Tailwind secondary styles
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