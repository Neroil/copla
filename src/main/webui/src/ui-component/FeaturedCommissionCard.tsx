// --- START OF FILE ui-component/FeaturedCommissionCard.tsx ---
// (Create this new file, e.g., in a 'ui-component' directory)

interface FeaturedCommissionCardProps {
    // In the future, you might pass actual data here like:
    // imageUrl: string;
    // title: string;
    // artist: string;
}

// For now, it's just a placeholder card, so no specific props are needed beyond 'key' which is handled by React.
// If you were passing data, you'd destructure props here: const FeaturedCommissionCard = ({ imageUrl, title }: FeaturedCommissionCardProps) => {
const FeaturedCommissionCard: React.FC<FeaturedCommissionCardProps> = () => {
    return (
        <div
            className="aspect-square rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-1 group cursor-pointer overflow-hidden"
        >
        <div className="h-full w-full rounded-lg bg-white dark:bg-gray-800 p-4 flex flex-col justify-between transition-transform duration-500 group-hover:scale-105">
            {/* Placeholder for image/art preview */}
            <div className="h-2/3 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 dark:from-black dark:to-gray-700"></div>
    {/* Placeholder for text content */}
    <div>
        <div className="h-4 w-2/3 rounded-full bg-gray-200 dark:bg-gray-700 mb-2"></div>
        <div className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        </div>
        </div>
);
};

export { FeaturedCommissionCard };
// --- END OF FILE ui-component/FeaturedCommissionCard.tsx ---