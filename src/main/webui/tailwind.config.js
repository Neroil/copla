import { mtConfig } from "@material-tailwind/react";

module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#7c3aed", // violet-600
                    light: "#a78bfa",   // violet-400
                    dark: "#4c1d95",    // violet-900
                },
                secondary: {
                    DEFAULT: "#f59e42", // orange-400
                    light: "#fbbf24",   // orange-300
                    dark: "#b45309",    // orange-700
                },
                accent: "#10b981",      // emerald-500
                info: "#0ea5e9",        // sky-500
                success: "#22c55e",     // green-500
                warning: "#facc15",     // yellow-400
                error: "#ef4444",       // red-500
                "off-white": "#f8f8f8",
            },
        },
    },
    plugins: [mtConfig],
};