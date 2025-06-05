// src/main/webui/src/pages/ArtistDirectory.tsx
import { useEffect, useState } from "react";
import {
    Typography, Input, Button,
    Slider, Tabs, TabsList, TabsTrigger,
    Spinner
} from "@material-tailwind/react";
import { DollarSign, Clock, Palette } from "lucide-react";
import { PageLayout } from "../ui-component/PageLayout";
import { CustomTagComponent } from "../ui-component/CustomTagComponent.tsx";
import { CustomCheckbox } from "../ui-component/CustomCheckbox.tsx";
import { PageHeader } from "../ui-component/PageHeader";
import { LoadingSpinner } from "../ui-component/LoadingSpinner";
import { ErrorAlert } from "../ui-component/ErrorAlert";
import { UserCard } from "../ui-component/UserCard";
import { EmptyState } from "../ui-component/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

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

function ArtistDirectory() {
    const [userList, setUserList] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [followedArtistIds, setFollowedArtistIds] = useState<number[]>([]);
    const [followingLoading, setFollowingLoading] = useState(false);

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [availabilityFilter, setAvailabilityFilter] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [followingOnly, setFollowingOnly] = useState(false);
    const [customTagInput, setCustomTagInput] = useState("");
    
    // Global animation speed modifier
    const [animationSpeed, ] = useState(0.5);

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

    // Check current user authentication and load following data
    useEffect(() => {
        async function checkCurrentUser() {
            try {
                const response = await fetch('/api/users/me', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    const username = data.username || null;
                    setCurrentUser(username);
                    
                    // Load following data if user is logged in
                    if (username) {
                        await loadFollowingData(username);
                    }
                }
            } catch (err) {
                console.error('Failed to check current user:', err);
            }
        }
        checkCurrentUser();
    }, []);

    // Load following data separately
    const loadFollowingData = async (username: string) => {
        try {
            setFollowingLoading(true);
            const response = await fetch(`/api/users/${username}/following`, { 
                credentials: 'include' 
            });
            if (response.ok) {
                const followingData = await response.json();
                // Extract artist IDs from following data where user is linked and is an artist
                const artistIds = followingData
                    .filter((f: any) => f.isLinked && f.coplaUser?.role === 'artist')
                    .map((f: any) => f.coplaUser.id);
                setFollowedArtistIds(artistIds);
            }
        } catch (err) {
            console.error('Failed to load following data:', err);
        } finally {
            setFollowingLoading(false);
        }
    };

    useEffect(() => {
        async function fetchArtists() {
            try {
                setLoading(true);
                setError(null);

                // Always fetch all artists, apply following filter client-side
                const response = await fetch('/api/users/artists', { credentials: 'include' });
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

        // Fetch artists only once on component mount
        fetchArtists();
    }, []); // Remove dependencies to prevent reloading

    // Filter the artists (now working with real artist data) - enhanced client-side filtering
    const filteredArtists = userList.filter(artist => {
        // Search filter
        const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (artist.bio?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

        // Price filter - Fixed to work properly with proper max value handling
        const artistPrice = artist.lowestPrice || 0;
        const matchesPrice = artistPrice >= priceRange[0] && 
            (priceRange[1] >= 1000 ? true : artistPrice <= priceRange[1]);

        // Verified filter - apply client-side
        const matchesVerified = !verifiedOnly || artist.verified === true;

        // Following filter - apply client-side
        const matchesFollowing = !followingOnly || followedArtistIds.includes(artist.id);

        // Availability filter - enhanced client-side filtering
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

        return matchesSearch && matchesPrice && matchesAvailability && matchesTags && matchesVerified && matchesFollowing;
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

    const handleAvailabilityChange = (statusType: string) => {
        setAvailabilityFilter(prev =>
            prev.includes(statusType) ? prev.filter(s => s !== statusType) : [...prev, statusType]
        );
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setPriceRange([0, 1000]);
        setAvailabilityFilter([]);
        setSelectedTags([]);
        setVerifiedOnly(false);
        setFollowingOnly(false);
        setCustomTagInput("");
    };

    if (loading) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 * animationSpeed }}
                >
                    <LoadingSpinner message="Discovering amazing artists..." />
                </motion.div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout pageTitle="Artist Directory" contentMaxWidth="max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 * animationSpeed }}
                >
                    <ErrorAlert message={error} />
                </motion.div>
            </PageLayout>
        );
    }

    return (
        <PageLayout pageTitle="Discover your favorite artist !" contentMaxWidth="max-w-7xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 * animationSpeed, ease: "easeOut" }}
            >
                <PageHeader
                    title=""
                    subtitle="Connect with talented creators and commission your perfect artwork"
                    searchPlaceholder="Search for artists, styles, or specialties..."
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                >
                    {/* Enhanced Filter Bar */}
                    <motion.div 
                        className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * animationSpeed, duration: 0.5 * animationSpeed }}
                    >
                        {/* Top Row - Quick Filters */}
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                            <div className="flex flex-wrap items-center gap-6">
                                {/* Following Filter - Only show if user is logged in */}
                                {currentUser && (
                                    <motion.div 
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 * animationSpeed, duration: 0.4 * animationSpeed }}
                                    >
                                        <CustomCheckbox
                                            checked={followingOnly}
                                            onChange={setFollowingOnly}
                                            disabled={followingLoading}
                                            colorScheme="indigo"
                                        />
                                        <Typography variant="small" className="font-medium text-indigo-700 dark:text-indigo-200">
                                            Following Only {followingLoading && <Spinner className="inline h-3 w-3 ml-1" />}
                                        </Typography>
                                        {followedArtistIds.length > 0 && (
                                            <Typography variant="small" className="text-indigo-600 dark:text-indigo-300">
                                                ({followedArtistIds.length})
                                            </Typography>
                                        )}
                                    </motion.div>
                                )}

                                {/* Verified Filter */}
                                <motion.div 
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 * animationSpeed, duration: 0.4 * animationSpeed }}
                                >
                                    <CustomCheckbox
                                        checked={verifiedOnly}
                                        onChange={setVerifiedOnly}
                                        colorScheme="blue"
                                    />
                                    <Typography variant="small" className="font-medium text-blue-700 dark:text-blue-200">
                                        Verified Artists Only
                                    </Typography>
                                </motion.div>

                                {/* View Mode Selector */}
                                <motion.div 
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 * animationSpeed, duration: 0.4 * animationSpeed }}
                                >
                                    <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-200">
                                        View:
                                    </Typography>
                                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")}>
                                        <TabsList className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg">
                                            <TabsTrigger value="grid" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:text-gray-200">
                                                Grid
                                            </TabsTrigger>
                                            <TabsTrigger value="list" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white dark:text-gray-200">
                                                List
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </motion.div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Results Counter */}
                                <motion.div 
                                    className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 * animationSpeed, duration: 0.4 * animationSpeed }}
                                    key={filteredArtists.length}
                                >
                                    <Typography variant="small" className="font-semibold text-purple-700 dark:text-purple-200">
                                        {filteredArtists.length} {followingOnly ? 'followed ' : ''}artist{filteredArtists.length !== 1 ? 's' : ''} found
                                    </Typography>
                                </motion.div>

                                {/* Clear Filters Button */}
                                {(selectedTags.length > 0 || availabilityFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || verifiedOnly || followingOnly) && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 * animationSpeed, duration: 0.4 * animationSpeed }}
                                    >
                                        <Button
                                            variant="outline"
                                            color="error"
                                            size="sm"
                                            onClick={clearAllFilters}
                                            className="flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear All
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Main Filters Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Price Range Filter */}
                            <motion.div 
                                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 * animationSpeed, duration: 0.4 * animationSpeed }}
                            >
                                <Typography variant="small" className="font-semibold mb-3 text-green-700 dark:text-green-200 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Price Range: ${priceRange[0]} - {priceRange[1] >= 1000 ? '$1000+' : `$${priceRange[1]}`}
                                </Typography>
                                
                                {/* Manual Input Fields */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Input
                                        size="sm"
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const newMin = Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRange[1] - 1));
                                            setPriceRange([newMin, priceRange[1]]);
                                        }}
                                        className="!border-green-200 dark:!border-green-600 focus:!border-green-500 dark:focus:!border-green-400 dark:text-gray-100"
                                    />
                                    <Typography variant="small" className="text-green-600 dark:text-green-300">
                                        to
                                    </Typography>
                                    <Input
                                        size="sm"
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const newMax = Math.min(1000, Math.max(parseInt(e.target.value) || 0, priceRange[0] + 1));
                                            setPriceRange([priceRange[0], newMax]);
                                        }}
                                        className="!border-green-200 dark:!border-green-600 focus:!border-green-500 dark:focus:!border-green-400 dark:text-gray-100"
                                    />
                                </div>

                                {/* Two-Thumb Range Slider */}
                                <div className="mb-2">
                                    <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={1000} step={25}>
                                        <Slider.Range className="bg-green-500" />
                                        <Slider.Thumb className="border-green-500" />
                                        <Slider.Thumb className="border-green-500" />
                                    </Slider>
                                </div>
                                
                                <div className="flex justify-between">
                                    <Typography variant="small" className="text-green-600 dark:text-green-300">
                                        $0
                                    </Typography>
                                    <Typography variant="small" className="text-green-600 dark:text-green-300">
                                        $1000+
                                    </Typography>
                                </div>
                            </motion.div>

                            {/* Availability Filter */}
                            <motion.div 
                                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 * animationSpeed, duration: 0.4 * animationSpeed }}
                            >
                                <Typography variant="small" className="font-semibold mb-3 text-blue-700 dark:text-blue-200 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Availability
                                </Typography>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { statusType: "open", label: "Open for Commissions", color: "success" },
                                        { statusType: "busy", label: "Currently Busy", color: "warning" },
                                        { statusType: "closed", label: "Closed", color: "error" }
                                    ].map(({ statusType, label, color }) => (
                                        <div key={statusType} className="flex items-center gap-2">
                                            <CustomCheckbox
                                                checked={availabilityFilter.includes(statusType)}
                                                onChange={() => handleAvailabilityChange(statusType)}
                                                colorScheme={
                                                    statusType === 'open' ? 'green' :
                                                    statusType === 'busy' ? 'yellow' : 'red'
                                                }
                                            />
                                            <Typography variant="small" className="font-medium dark:text-gray-200">
                                                {label}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Tags Filter */}
                            <motion.div 
                                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 * animationSpeed, duration: 0.4 * animationSpeed }}
                            >
                                <Typography variant="small" className="font-semibold mb-3 text-purple-700 dark:text-purple-200 flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Art Specialties
                                </Typography>

                                {/* Custom Tag Input */}
                                <div className="mb-3">
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
                                            className="shrink-0 dark:text-white text-white"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                {/* Available Tags */}
                                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                                    {availableTags.map((tag) => (
                                        <CustomTagComponent
                                            key={tag}
                                            tag={tag}
                                            variant={selectedTags.includes(tag) ? "current" : "add"}
                                            onClick={() => handleTagToggle(tag)
                                            }
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Selected Tags Section */}
                        <AnimatePresence>
                            {selectedTags.length > 0 && (
                                <motion.div 
                                    className="mt-4 p-4 bg-white/50 dark:bg-gray-700/30 rounded-lg border border-purple-300 dark:border-purple-600"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 * animationSpeed }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Typography variant="small" className="font-medium text-purple-800 dark:text-purple-200">
                                            Selected Tags ({selectedTags.length}):
                                        </Typography>
                                        <Button
                                            size="sm"
                                            color="error"
                                            variant="outline"
                                            onClick={() => setSelectedTags([])}
                                            className="text-xs"
                                        >
                                            Clear Tags
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTags.map((tag, index) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ delay: index * 0.05 * animationSpeed, duration: 0.2 * animationSpeed }}
                                                className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:from-purple-600 hover:to-purple-700"
                                                onClick={() => handleTagToggle(tag)}
                                                title="Click to remove"
                                            >
                                                <span>{tag}</span>
                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </PageHeader>
            </motion.div>

            {/* Enhanced Artist Cards */}
            <AnimatePresence mode="wait">
                {filteredArtists.length > 0 ? (
                    <motion.div 
                        className={viewMode === "grid" ?
                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" :
                            "flex flex-col gap-6"
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 * animationSpeed }}
                        key={`${viewMode}-${filteredArtists.length}`}
                    >
                        {filteredArtists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    delay: index * 0.1 * animationSpeed, 
                                    duration: 0.4 * animationSpeed,
                                    ease: "easeOut"
                                }}
                                whileHover={animationSpeed > 0 ? { y: -5 } : {}}
                            >
                                <UserCard
                                    user={artist}
                                    viewMode={viewMode}
                                    onViewProfile={() => window.location.href = `/users/${artist.name}`}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 * animationSpeed }}
                    >
                        <EmptyState
                            title={followingOnly ? "No Followed Artists Found" : "No Artists Found"}
                            description={followingOnly 
                                ? followedArtistIds.length === 0
                                    ? "You're not following any artists yet. Connect your Bluesky account to sync your follows!"
                                    : "None of your followed artists match the current filters. Try adjusting your search criteria."
                                : "Looks like no artists match your current search criteria. Try broadening your filters!"
                            }
                            actionLabel="Clear All Filters"
                            onAction={clearAllFilters}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </PageLayout>
    );
}

export default ArtistDirectory;