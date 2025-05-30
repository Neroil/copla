import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
  Spinner,
  Input,
  Textarea
} from "@material-tailwind/react";
import { PaletteIcon } from "./CustomIcons";
import CustomFormButton from "./CustomFormButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";

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

// Reusable Commission Card Header Component
const CommissionCardHeader: React.FC<{
  title: string;
  subtitle: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ title, subtitle, isOwner = false, onEdit, onDelete }) => (
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
            {subtitle}
          </Typography>
        </div>
      </div>

      {isOwner && (
        <div className="flex gap-2">
          <CustomFormButton 
            size="sm"
            variant="outline"
            className="!text-xs !py-2 !px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
            onClick={onEdit}
            isFullWidth={false}
          >
            Edit
          </CustomFormButton>
          <CustomFormButton 
            size="sm"
            color="error"
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
);

// Reusable Service Element Component
const ServiceElement: React.FC<{
  element: CommissionCardElement;
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}> = ({ element, index, isOpen, onToggle }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800/30 shadow-sm hover:shadow-md transition-all duration-200">
    <div
      onClick={() => onToggle(index)}
      className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex-shrink-0"></div>
        <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-medium flex-1">
          {element.title}
        </Typography>
        {element.price != null && element.price > 0 && (
          <Chip 
            color="success" 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-sm flex-shrink-0"
            size="sm"
          >
            ${element.price.toFixed(2)}
          </Chip>
        )}
      </div>
      <ChevronDownIcon 
        className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0 ${
          isOpen ? 'rotate-180' : ''
        }`} 
      />
    </div>
    
    {isOpen && (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {element.exampleImageUrls.map((url, imgIndex) => (
                  <div key={imgIndex} className="relative group aspect-square">
                    <img 
                      src={url} 
                      alt={`Example for ${element.title}`} 
                      className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg transition-all duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200 cursor-pointer"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

// Form Field Component for consistent styling
const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
      <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
      {label}
    </div>
    {children}
  </div>
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

  const handleAccordionOpen = useCallback((index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  }, [openAccordion]);

  const validElements = elements?.filter(element => element.title && element.description) || [];

  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CommissionCardHeader
        title={title || "Commission Services"}
        subtitle="Available Services & Pricing"
        isOwner={isOwner}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <CardBody className="p-6 space-y-6">
        {description && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <Typography className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </Typography>
          </div>
        )}

        {validElements.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
              <Typography variant="h5" className="text-gray-800 dark:text-gray-200 font-semibold">
                Available Services ({validElements.length})
              </Typography>
            </div>
            
            <div className="space-y-3">
              {validElements.map((element, index) => (
                <ServiceElement
                  key={element.id || index}
                  element={element}
                  index={index}
                  isOpen={openAccordion === index}
                  onToggle={handleAccordionOpen}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<PaletteIcon className="h-12 w-12" />}
            title="No services available"
            description="This artist hasn't added any commission services yet."
            className="py-8"
          />
        )}
      </CardBody>

      <CardFooter className="pt-0 pb-6 px-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <CustomFormButton 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex-1"
            color="primary"
          >
            Request Commission
          </CustomFormButton>
          {validElements.some(el => el.price && el.price > 0) && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>Starting from</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ${Math.min(...validElements.filter(el => el.price && el.price > 0).map(el => el.price!)).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Loading State component using existing LoadingSpinner
export const CommissionCardLoading: React.FC = () => {
  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-12">
        <LoadingSpinner message="Loading commission details..." />
      </CardBody>
    </Card>
  );
};

// Error State component using existing ErrorAlert
export const CommissionCardError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800">
      <CardBody className="p-6">
        <ErrorAlert 
          title="Unable to Load Commission Card"
          message={message}
        />
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

    const isFormValid = title.trim().length > 0 && description.trim().length > 0;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
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
          credentials: 'include',
          body: JSON.stringify({ 
            title: title.trim(), 
            description: description.trim() 
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to create commission card: ${response.statusText}`);
        }
  
        // Reset form
        setTitle("");
        setDescription("");
        
        if (onSuccess) onSuccess();
      } catch (err: any) {
        setError(err.message || "Failed to create commission card");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <CommissionCardHeader
          title="Create Commission Card"
          subtitle="Showcase your artistic services to potential clients"
        />
  
        <CardBody className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Commission Card Title">
              <Input
                size="lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Digital Art Commissions, Custom Portraits, Logo Design"
                className="!border-gray-300 dark:!border-gray-600 focus:!border-purple-500 dark:focus:!border-purple-400"
                maxLength={100}
                required
              />
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                {title.length}/100 characters
              </Typography>
            </FormField>
  
            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the types of commissions you offer, your artistic style, pricing approach, and what makes your work unique. Include any important terms or requirements..."
                className="!border-gray-300 dark:!border-gray-600 focus:!border-purple-500 dark:focus:!border-purple-400 !bg-white dark:!bg-gray-800/50 min-h-[120px]"
                rows={5}
                maxLength={1000}
                required
              />
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/1000 characters
              </Typography>
            </FormField>
  
            {error && (
              <ErrorAlert
                title="Creation Failed"
                message={error}
              />
            )}
  
            <div className="pt-4">
              <CustomFormButton
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !isFormValid}
                color="primary"
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