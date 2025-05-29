import { Chip } from "@material-tailwind/react";

export const CustomTagComponent = ({
    tag,
    variant = "current",
    onClick,
    onRemove,
    showRemove = false
}: {
    tag: string;
    variant?: "current" | "add";
    onClick?: () => void;
    onRemove?: () => void;
    showRemove?: boolean;
}) => (
    <div className="relative group">
        <Chip
            variant="solid"
            onClick={onClick}
            className={`
                ${variant === "current" ? "cursor-default" : "cursor-pointer"}
                bg-gradient-to-r from-purple-500 to-purple-600 
                hover:from-purple-600 hover:to-purple-700 
                dark:from-purple-400 dark:to-purple-500 
                dark:hover:from-purple-500 dark:hover:to-purple-600
                text-white dark:text-white
                shadow-md hover:shadow-lg
                transition-all duration-200 ease-in-out
                border border-purple-300 dark:border-purple-600
                ${showRemove ? 'pr-8' : 'pr-3'}
                pl-3 py-1.5
                text-sm font-medium
                rounded-full
                ${variant === "add" ? "transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-200" : ""}
            `}
        >
            {tag}
        </Chip>
        {showRemove && (
            <button
                onClick={onRemove}
                className="
                    absolute right-1.5 top-1/2 transform -translate-y-1/2 
                    w-5 h-5 rounded-full
                    bg-purple-700 hover:bg-red-500 
                    dark:bg-purple-300 dark:hover:bg-red-400
                    text-white dark:text-purple-800 dark:hover:text-white
                    transition-all duration-200 ease-in-out
                    hover:scale-110 active:scale-95
                    flex items-center justify-center
                    shadow-sm hover:shadow-md
                "
                title={`Remove ${tag}`}
            >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        )}
    </div>
);