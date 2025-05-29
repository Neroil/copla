import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Spinner,
  Input
} from "@material-tailwind/react";
import { PaletteIcon } from "./CustomIcons";
import CustomFormButton from "./CustomFormButton";

// Interfaces matching your Java entities
interface CommissionCardElement {
  id: number;
  title: string;
  description: string;
  exampleImageUrls?: string[];
  price?: number;
}

interface CommissionCardProps {
  id: number;
  title: string;
  description: string;
  elements: CommissionCardElement[];
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Custom hook to fetch commission card data
export function useCommissionCard(username: string | undefined) {
  const [commissionCard, setCommissionCard] = useState<CommissionCardProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommissionCard = useCallback(async () => {
    if (!username) {
      setCommissionCard(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${username}/commission-card`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setCommissionCard(null);
          return;
        }
        throw new Error(`Failed to fetch commission card: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCommissionCard(data);
    } catch (err: any) {
      setError(err.message || "Failed to load commission card");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchCommissionCard();
  }, [fetchCommissionCard]);

  return { commissionCard, loading, error, refreshCard: fetchCommissionCard };
}

// Chevron Down Icon Component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
  </svg>
);

// Commission Card Display Component
export const CommissionCard: React.FC<CommissionCardProps> = ({
  id,
  title,
  description,
  elements,
  isOwner = false,
  onEdit,
  onDelete
}) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleAccordionOpen = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 w-full bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900 p-6 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <PaletteIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold mb-1">
                {title}
              </Typography>
              <Typography variant="small" className="text-white/80 font-medium">
                Commission Services
              </Typography>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <CustomFormButton 
                className="!text-xs !py-2 !px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
                onClick={onEdit}
                isFullWidth={false}
              >
                Edit
              </CustomFormButton>
              <CustomFormButton 
                className="!text-xs !py-2 !px-4 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/30"
                onClick={onDelete}
                isFullWidth={false}
              >
                Delete
              </CustomFormButton>
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <Typography className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </Typography>
        </div>

        {elements && elements.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
              <Typography variant="h5" className="text-gray-800 dark:text-gray-200 font-semibold">
                Available Services
              </Typography>
            </div>
            
            <div className="space-y-3">
              {elements.map((element, index) => (
                <div 
                  key={element.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800/30 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div
                    onClick={() => handleAccordionOpen(index)}
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                      <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-medium">
                        {element.title}
                      </Typography>
                      {element.price && (
                        <Chip 
                          color="green" 
                          value={`$${element.price.toFixed(2)}`}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-sm"
                          size="sm"
                        />
                      )}
                    </div>
                    <ChevronDownIcon 
                      className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                        openAccordion === index ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                  
                  {openAccordion === index && (
                    <div className="px-5 pb-5 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-900/30">
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <Typography className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {element.description}
                        </Typography>
                        
                        {element.exampleImageUrls && element.exampleImageUrls.length > 0 && (
                          <div>
                            <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium mb-3 flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                              Example Gallery
                            </Typography>
                            <div className="flex gap-3 flex-wrap">
                              {element.exampleImageUrls.map((url, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img 
                                    src={url} 
                                    alt={`Example for ${element.title}`} 
                                    className="h-24 w-24 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg transition-shadow duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
            <PaletteIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <Typography className="text-gray-500 dark:text-gray-400 italic">
              No services available at the moment.
            </Typography>
          </div>
        )}
      </CardBody>

      <CardFooter className="pt-0 pb-6 px-6">
        <CustomFormButton className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          Request Commission
        </CustomFormButton>
      </CardFooter>
    </Card>
  );
};

// Loading State component
export const CommissionCardLoading: React.FC = () => {
  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Spinner className="h-12 w-12 text-purple-500" />
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
        </div>
        <Typography className="text-gray-700 dark:text-gray-300 font-medium">
          Loading commission details...
        </Typography>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </CardBody>
    </Card>
  );
};

// Error State component
export const CommissionCardError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800">
      <CardBody className="p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <Typography variant="h6" className="text-red-600 dark:text-red-400 font-semibold">
          Unable to Load Commission Card
        </Typography>
        <Typography className="text-gray-700 dark:text-gray-300">
          {message}
        </Typography>
      </CardBody>
    </Card>
  );
};

// Create Commission Card Component
export const CreateCommissionCard: React.FC<{
    artistName: string;
    onSuccess?: () => void;
  }> = ({ artistName, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title || !description) {
        setError("Please provide both title and description");
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
  
        const response = await fetch(`/api/users/${artistName}/commission-card`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to create commission card: ${response.statusText}`);
        }
  
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setError(err.message || "Failed to create commission card");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CardHeader
          floated={false}
          shadow={false}
          className="m-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 dark:from-purple-800 dark:via-purple-900 dark:to-indigo-900 p-6 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <PaletteIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold mb-1">
                Create Commission Card
              </Typography>
              <Typography className="text-white/80 font-medium">
                Showcase your artistic services to potential clients
              </Typography>
            </div>
          </div>
        </CardHeader>
  
        <CardBody className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                Service Title
              </Typography>
              <Input
                size="lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Digital Art Commissions"
                className="!border-gray-300 dark:!border-gray-600 focus:!border-purple-500 dark:focus:!border-purple-400"
                labelProps={{
                  className: "hidden",
                }}
                required
              />
            </div>
  
            <div className="space-y-2">
              <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                Description
              </Typography>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the types of commissions you offer, your style, and what makes your work unique..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 min-h-[120px] transition-all duration-200"
                required
              />
            </div>
  
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            )}
  
            <div className="pt-4">
              <CustomFormButton
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Creating Your Commission Card...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <PaletteIcon className="h-5 w-5" />
                    Create Commission Card
                  </div>
                )}
              </CustomFormButton>
            </div>
          </form>
        </CardBody>
      </Card>
    );
  };

export default CommissionCard;