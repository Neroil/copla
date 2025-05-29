// src/main/webui/src/pages/ArtistDirectory.tsx
import { useEffect, useState } from "react";
import {
    Card, CardHeader, CardBody, CardFooter,
    Typography, Input, Avatar, Button, Spinner, Chip,
    Popover, PopoverContent, PopoverTrigger, Slider, Checkbox, Tabs, TabsList, TabsTrigger
} from "@material-tailwind/react";
import { PageLayout } from "../ui-component/PageLayout";
import { CustomTagComponent } from "../ui-component/CustomTagComponent.tsx";

// Define interface for user social profiles
interface SocialProfile {
    platform: string;
    username: string;
    profileUrl: string;
    isVerified: boolean;
}

// Define UserData interface with all required properties
interface UserData {
    id: number;
    name: string;
    email: string;
    timeCreated: string;
    profilePicPath?: string;
    role?: string;
    bio?: string;
    socialProfiles?: SocialProfile[];
    // Artist-specific fields
    verified?: boolean;
    isOpenForCommissions?: boolean;
    commissionCard?: any;
    lowestPrice: number;
    // UI enhancement fields (keep for demo)
    commissionStatus?: "open" | "closed" | "busy";
    tags?: string[];
    relatedTags?: string[]; // Use this for real artist tags
    galleryImages?: string[]; // Add gallery images array
}

// Icons
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
    </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z" clipRule="evenodd" />
    </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

// Social media icons
const TwitterIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
        <path d="M11.299 8.065c-2.209 0-4 1.791-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.209-1.791-4-4-4zm0 7.12c-1.72 0-3.12-1.4-3.12-3.12 0-1.72 1.4-3.12 3.12-3.12 1.72 0 3.12 1.4 3.12 3.12 0 1.72-1.4 3.12-3.12 3.12z" />
        <circle cx="15.445" cy="7.348" r="0.92" />
    </svg>
);

const BlueskyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 600 530" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "w-5 h-5"}>
        <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" fill="currentColor" />
    </svg>
);

function ArtistDirectory() {
    const [userList, setUserList] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState("grid");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [customTagInput, setCustomTagInput] = useState("");

    // Fetch available tags
    useEffect(() => {
        async function fetchTags() {
            try {
                const response = await fetch('/api/tags/names');
                if (response.ok) {
                    const tagNames = await response.json();
                    setAvailableTags(tagNames);
                }
            } catch (err) {
                console.error('Failed to fetch tags:', err);
                // Fallback to demo tags if API fails
                setAvailableTags(["Portrait", "Character Design", "Illustration", "Digital", "Traditional", "NSFW", "Fantasy", "Animation"]);
            }
        }
        fetchTags();
    }, []);

    useEffect(() => {
        async function fetchArtists() {
            try {
                setLoading(true);
                setError(null);

                // Build query parameters
                const params = new URLSearchParams();
                if (verifiedOnly) {
                    params.append('verified', 'true');
                }

                // Add commission status filter if any selected
                if (availabilityFilter.includes('open')) {
                    params.append('openForCommissions', 'true');
                } else if (availabilityFilter.includes('closed') && availabilityFilter.length === 1) {
                    params.append('openForCommissions', 'false');
                }

                const queryString = params.toString();
                const url = `/api/users/artists${queryString ? '?' + queryString : ''}`;

                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch artist list' }));
                    throw new Error(errorData.message || 'Failed to fetch artist list: ' + response.statusText);
                }

                const artistData: UserData[] = await response.json();

                // Enhance the data with demo UI fields while preserving real data
                const enhancedData = artistData.map(artist => ({
                    ...artist,
                    // Map real commission status to UI status
                    commissionStatus: artist.isOpenForCommissions ? "open" : "closed" as "open" | "closed" | "busy",
                    // Use real tags from artist profile instead of demo tags
                    tags: artist.relatedTags || [],
                    startingPrice: artist.lowestPrice,
                    bio: artist.bio || `${artist.name} doesn't have a bio yet!`,
                    // Add mock gallery images for demo (replace with real API call later)
                    galleryImages: [
                        `https://picsum.photos/400/300?random=${artist.id}`,
                        `https://picsum.photos/400/300?random=${artist.id + 1000}`,
                        `https://picsum.photos/400/300?random=${artist.id + 2000}`
                    ]
                }));

                setUserList(enhancedData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch artists if we have tags loaded (or if tags failed to load)
        if (availableTags.length > 0) {
            fetchArtists();
        }
    }, [verifiedOnly, availabilityFilter, availableTags]); // Re-fetch when filters change or tags are loaded


    // Filter the artists (now working with real artist data)
    const filteredArtists = userList.filter(artist => {
        // Search filter
        const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (artist.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

        // Price filter - Fixed to work properly
        const artistPrice = artist.lowestPrice || 0;
        const matchesPrice = artistPrice >= priceRange[0] && artistPrice <= priceRange[1];

        // Availability filter - now using real data
        const matchesAvailability = availabilityFilter.length === 0 ||
            (availabilityFilter.includes('open') && artist.isOpenForCommissions) ||
            (availabilityFilter.includes('closed') && !artist.isOpenForCommissions) ||
            (availabilityFilter.includes('busy') && artist.commissionStatus === 'busy'); // Keep busy as demo status

        // Tags filter - enhanced to work with custom tags
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => 
                artist.tags?.some(artistTag => 
                    artistTag.toLowerCase().includes(tag.toLowerCase())
                )
            );

        return matchesSearch && matchesPrice && matchesAvailability && matchesTags;
    });

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleAddCustomTag = () => {
        const trimmedTag = customTagInput.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag)) {
            setSelectedTags(prev => [...prev, trimmedTag]);
            setCustomTagInput("");
        }
    };

    const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddCustomTag();
        }
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setPriceRange([0, 500]);
        setAvailabilityFilter([]);
        setSelectedTags([]);
        setVerifiedOnly(false);
        setCustomTagInput("");
    };

    // Get status color mapping to Material Tailwind colors
    const getStatusColor = (status?: string): "primary" | "secondary" | "info" | "success" | "warning" | "error" => {
        switch (status) {
            case 'open': return 'success';
            case 'busy': return 'warning';
            case 'closed': return 'error';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-7xl">
                <div className="flex flex-col items-center justify-center min-h-[500px] w-full">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <Spinner className="h-16 w-16 text-purple-600 relative z-10" />
                    </div>
                    <Typography className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-200 animate-pulse">
                        Discovering amazing artists...
                    </Typography>
                    <div className="flex space-x-1 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-7xl">
                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 mb-8 shadow-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <Typography variant="h6" className="text-red-800 dark:text-red-200 font-semibold">
                                Oops! Something went wrong
                            </Typography>
                            <Typography className="text-red-700 dark:text-red-300 mt-1">
                                {error}
                            </Typography>
                        </div>
                    </div>
                </div>
            </PageLayout>
        );
    }

    const handleAvailabilityChange = (statusType: string) => {
        setAvailabilityFilter(prev =>
            prev.includes(statusType) 
                ? prev.filter(status => status !== statusType)
                : [...prev, statusType]
        );
    };

    return (
        <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-7xl">
            {/* Hero Section with Search */}
            <div className="mb-12 w-full">
                <div className="text-center mb-8">
                    <Typography variant="h2" className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                        Discover Amazing Artists
                    </Typography>
                    <Typography variant="lead" className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Connect with talented creators and commission your perfect artwork
                    </Typography>
                </div>

                {/* Enhanced Search Bar */}
                <div className="relative w-full max-w-4xl mx-auto mb-8">
                    <div className="relative group">
                        <Input
                            placeholder="Search for artists, styles, or specialties..."
                            size="lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="!border-2 !border-purple-200 dark:!border-purple-700/50 focus:!border-purple-500 dark:focus:!border-purple-400 shadow-xl pl-12 pr-4 py-4 text-lg rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl dark:text-gray-100"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <MagnifyingGlassIcon className="h-6 w-6 text-purple-400 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-200 transition-colors" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                </div>

                {/* Enhanced Filter Bar */}
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700/50">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-6">
                            {/* View Mode Selector */}
                            <div className="flex items-center gap-3">
                                <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-200">
                                    View:
                                </Typography>
                                <Tabs value={viewMode} onValueChange={setViewMode}>
                                    <TabsList className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg">
                                        <TabsTrigger value="grid" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:text-gray-200">
                                            Grid
                                        </TabsTrigger>
                                        <TabsTrigger value="list" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:text-gray-200">
                                            List
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            {/* Verified Filter */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50">
                                <Checkbox
                                    checked={verifiedOnly}
                                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                                    color="primary"
                                />
                                <Typography variant="small" className="font-medium text-blue-700 dark:text-blue-200">
                                    Verified Artists Only
                                </Typography>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Results Counter */}
                            <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                                <Typography variant="small" className="font-semibold text-purple-700 dark:text-purple-200">
                                    {filteredArtists.length} artist{filteredArtists.length !== 1 ? 's' : ''} found
                                </Typography>
                            </div>

                            {/* Filter Button */}
                            <Popover placement="bottom-end">
                                <PopoverTrigger>
                                    <Button
                                        variant="gradient"
                                        color="primary"
                                        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <FilterIcon className="h-4 w-4" /> 
                                        Filters
                                        {(selectedTags.length > 0 || availabilityFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-2xl">
                                    <Typography variant="h6" className="mb-4 text-gray-800 dark:text-gray-100 font-bold">
                                        Filter Artists
                                    </Typography>

                                    {/* Price Range Filter */}
                                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50">
                                        <Typography variant="small" className="font-semibold mb-2 text-green-700 dark:text-green-200 flex items-center gap-2">
                                            Price Range: ${priceRange[0]} - ${priceRange[1]}
                                        </Typography>
                                        <Slider
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            min={0}
                                            max={500}
                                            step={10}
                                            className="text-green-500"
                                        />
                                        <div className="flex justify-between mt-2">
                                            <Typography variant="small" className="text-green-600 dark:text-green-300">
                                                $0
                                            </Typography>
                                            <Typography variant="small" className="text-green-600 dark:text-green-300">
                                                $500+
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* Availability Filter */}
                                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                                        <Typography variant="small" className="font-semibold mb-3 text-blue-700 dark:text-blue-200 flex items-center gap-2">
                                            Availability
                                        </Typography>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { statusType: "open", label: "Open for Commissions", color: "success" },
                                                { statusType: "busy", label: "Currently Busy", color: "warning" },
                                                { statusType: "closed", label: "Closed", color: "error" }
                                            ].map(({ statusType, label, color }) => (
                                                <div key={statusType} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <Checkbox
                                                        checked={availabilityFilter.includes(statusType)}
                                                        onChange={() => handleAvailabilityChange(statusType)}
                                                        color={color as any}
                                                    />
                                                    <Typography variant="small" className="font-medium dark:text-gray-200">
                                                        {label}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Enhanced Tags Filter */}
                                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                                        <Typography variant="small" className="font-semibold mb-3 text-purple-700 dark:text-purple-200 flex items-center gap-2">
                                            Art Specialties
                                        </Typography>
                                        
                                        {/* Custom Tag Input */}
                                        <div className="mb-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    size="sm"
                                                    placeholder="Enter custom tag..."
                                                    value={customTagInput}
                                                    onChange={(e) => setCustomTagInput(e.target.value)}
                                                    onKeyPress={handleCustomTagKeyPress}
                                                    className="!border-purple-200 dark:!border-purple-600 focus:!border-purple-500 dark:focus:!border-purple-400 dark:text-gray-100"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="gradient"
                                                    color="primary"
                                                    onClick={handleAddCustomTag}
                                                    disabled={!customTagInput.trim()}
                                                    className="shrink-0"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Selected Tags Section */}
                                        {selectedTags.length > 0 && (
                                            <div className="mb-4 p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg border border-purple-300 dark:border-purple-600">
                                                <Typography variant="small" className="font-medium mb-2 text-purple-800 dark:text-purple-200">
                                                    Selected Tags ({selectedTags.length}):
                                                </Typography>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:from-purple-600 hover:to-purple-700"
                                                            onClick={() => handleTagToggle(tag)}
                                                            title="Click to remove"
                                                        >
                                                            <span>{tag}</span>
                                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    color="error"
                                                    onClick={() => setSelectedTags([])}
                                                    className="mt-2 text-xs"
                                                >
                                                    Clear All Tags
                                                </Button>
                                            </div>
                                        )}

                                        {/* Available Tags */}
                                        <div>
                                            <Typography variant="small" className="font-medium mb-2 text-purple-700 dark:text-purple-200">
                                                Popular Tags:
                                            </Typography>
                                            <div className="flex flex-wrap gap-2">
                                                {availableTags.map((tag) => (
                                                    <CustomTagComponent
                                                        key={tag}
                                                        tag={tag}
                                                        variant={selectedTags.includes(tag) ? "current" : "add"}
                                                        onClick={() => handleTagToggle(tag)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Artist Cards */}
            {filteredArtists.length > 0 ? (
                <div className={viewMode === "grid" ?
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" :
                    "flex flex-col gap-6"
                }>
                    {filteredArtists.map((artist) => (
                        <Card key={artist.id} className={`group overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 ${viewMode === "list" ? "flex flex-row" : ""}`}>
                            <CardHeader
                                floated={false}
                                color="transparent"
                                className={`m-0 w-full rounded-b-none relative overflow-hidden ${viewMode === "list" ? "w-1/3 h-auto" : "h-72"}`}
                            >
                                {/* Gallery Image Background */}
                                <div className="absolute inset-0">
                                    {artist.galleryImages && artist.galleryImages.length > 0 ? (
                                        <img
                                            src={artist.galleryImages[0]}
                                            alt={`${artist.name}'s artwork`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"></div>
                                    )}
                                    {/* Overlay for text readability */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                                </div>
                                
                                {/* Profile Avatar */}
                                <div className="absolute top-6 left-6 group-hover:scale-110 transition-transform duration-300">
                                    <Avatar
                                        size="xxl"
                                        shape="circular"
                                        alt={artist.name}
                                        src={artist.profilePicPath || `https://avatar.iran.liara.run/public/boy?username=${artist.name}`}
                                        className="border-4 border-white shadow-xl ring-4 ring-purple-200 group-hover:ring-purple-300 transition-all duration-300"
                                    />
                                </div>

                                {/* Status and Verified Badges */}
                                <div className="absolute top-6 right-6 flex flex-col gap-2">
                                    <Chip
                                        color={getStatusColor(artist.commissionStatus)}
                                        className="text-xs font-bold shadow-lg"
                                        size="sm"
                                    >
                                        {artist.isOpenForCommissions ? "OPEN" : "CLOSED"}
                                    </Chip>
                                    
                                    {artist.verified && (
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                            <CheckIcon className="w-3 h-3" />
                                            VERIFIED
                                        </div>
                                    )}
                                </div>

                                {/* Artist Name Overlay */}
                                {viewMode !== "list" && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <Typography variant="h4" className="text-white font-bold drop-shadow-lg">
                                            {artist.name}
                                        </Typography>
                                    </div>
                                )}
                            </CardHeader>

                            <CardBody className={`p-6 ${viewMode === "list" ? "w-2/3" : ""}`}>
                                {viewMode === "list" && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <Typography variant="h4" className="font-bold text-gray-800 dark:text-gray-100">
                                            {artist.name}
                                        </Typography>
                                        {artist.verified && (
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                <CheckIcon className="w-3 h-3" />
                                                VERIFIED
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Pricing */}
                                <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700/50">
                                    <Typography variant="small" className="text-green-700 dark:text-green-200 font-medium">
                                        Starting from
                                    </Typography>
                                    <Typography variant="h5" className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                        ${artist.lowestPrice || 0}+
                                    </Typography>
                                </div>

                                {/* Bio */}
                                <Typography variant="small" className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4 leading-relaxed">
                                    {artist.bio}
                                </Typography>

                                {/* Tags */}
                                {artist.tags && artist.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {artist.tags.map((tag) => (
                                            <CustomTagComponent
                                                key={tag}
                                                tag={tag}
                                                variant="current"
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardBody>

                            <CardFooter className="pt-0 pb-6 px-6 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/60 dark:to-gray-800/60">
                                <div className="flex gap-2">
                                    {/* Social Links - Focus on Bluesky */}
                                    {artist.socialProfiles && artist.socialProfiles.length > 0 ? (
                                        artist.socialProfiles
                                            .filter(profile => profile.platform.toLowerCase() === 'bluesky')
                                            .map((profile, index) => (
                                                <Button
                                                    key={index}
                                                    size="sm"
                                                    variant="ghost"
                                                    color="info"
                                                    className="p-2 hover:scale-110 transition-transform duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                                                    onClick={() => window.open(profile.profileUrl, '_blank')}
                                                    title={`@${profile.username} on Bluesky${profile.isVerified ? ' (Verified)' : ''}`}
                                                >
                                                    <BlueskyIcon className="w-4 h-4" />
                                                    {profile.isVerified && <CheckIcon className="w-3 h-3 text-blue-500" />}
                                                </Button>
                                            ))
                                    ) : (
                                        <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                                            No social profiles
                                        </Typography>
                                    )}
                                </div>

                                <Button
                                    size="sm"
                                    variant="gradient"
                                    color={artist.isOpenForCommissions ? "primary" : "secondary"}
                                    className="flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                                    onClick={() => window.location.href = `/users/${artist.name}`}
                                >
                                    View Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-xl p-16 text-center border border-purple-200 dark:border-purple-700/50">
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-purple-300 dark:text-purple-600 relative z-10">
                                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                            </svg>
                        </div>

                        <Typography variant="h3" className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                            No Artists Found
                        </Typography>
                        <Typography variant="lead" className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
                            Looks like no artists match your current search criteria. Try broadening your filters!
                        </Typography>

                        <Button
                            variant="gradient"
                            color="primary"
                            size="lg"
                            className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                            onClick={clearAllFilters}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </div>
            )}
        </PageLayout>
    );
}

export default ArtistDirectory;