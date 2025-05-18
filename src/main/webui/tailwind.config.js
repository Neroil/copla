import { mtConfig } from "@material-tailwind/react";

module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#f1e9fd",
                    light: "#a78bfa",
                    dark: "#4c1d95",
                },
                secondary: {
                    DEFAULT: "#290e32",
                    light: "#fbbf24",
                    dark: "#b45309",
                },
                accent: "#10b981",
                info: "#0ea5e9",
                success: "#22c55e",
                warning: "#facc15",
                error: "#ef4444",
                "off-white": "#f8f8f8",
            },
        },
    },
    plugins: [mtConfig],
};