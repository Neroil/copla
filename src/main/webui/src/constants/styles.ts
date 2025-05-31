export const GRADIENT_CLASSES = {
    button: "bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:from-purple-700 hover:via-indigo-700 hover:to-teal-700 dark:from-purple-500 dark:via-indigo-500 dark:to-teal-500 dark:hover:from-purple-600 dark:hover:via-indigo-600 dark:hover:to-teal-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl",
    avatar: "bg-gradient-to-r from-teal-500 to-pink-500",
    primaryButton: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
};

export const MOTION_VARIANTS = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    },
    scaleIn: {
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { delay: 0.2, type: "spring", stiffness: 200 }
    }
};
