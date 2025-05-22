import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Accordion,
  Chip,
  Spinner
} from "@material-tailwind/react";
import { PaletteIcon } from "./CustomIcons";

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
          // Not found is expected for users without commission cards
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
    <Card className="w-full shadow-lg overflow-hidden">
      <CardHeader
        floated={false}
        shadow={false}
        color="blue-gray"
        className="m-0 bg-gradient-to-r from-purple-500 to-indigo-600 p-5"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <PaletteIcon className="h-8 w-8 text-white" />
            <div>
              <Typography variant="h5">
                {title}
              </Typography>
              <Typography variant="small" className="opacity-80">
                Commission Card
              </Typography>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button 
                size="sm" 
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="p-5">
        <Typography className="mb-4 text-gray-700 dark:text-gray-300">
          {description}
        </Typography>

        {elements && elements.length > 0 ? (
          <div className="mt-4">
            <Typography variant="h6" className="mb-3 text-gray-800 dark:text-gray-200">
              Commission Options
            </Typography>
            
            <div className="space-y-3">
              {elements.map((element, index) => (
                <div 
                  key={element.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  {/* Custom Accordion Header */}
                  <div
                    onClick={() => handleAccordionOpen(index)}
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <Typography variant="h6" className="text-gray-800 dark:text-gray-200">
                        {element.title}
                      </Typography>
                      {element.price && (
                        <Chip 
                          color="success" 
                          /*value={`$${element.price.toFixed(2)}`}*/
                          className="ml-2"
                          size="sm"
                        />
                      )}
                    </div>
                    {/*<ChevronDownIcon className={`h-5 w-5 transition-transform ${openAccordion === index ? 'rotate-180' : ''}`} />*/}
                  </div>
                  
                  {/* Custom Accordion Body */}
                  {openAccordion === index && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/60">
                      <Typography className="text-gray-700 dark:text-gray-300 mb-3">
                        {element.description}
                      </Typography>
                      
                      {element.exampleImageUrls && element.exampleImageUrls.length > 0 && (
                        <div className="mt-3">
                          <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-2">
                            Example Images:
                          </Typography>
                          <div className="flex gap-2 flex-wrap">
                            {element.exampleImageUrls.map((url, imgIndex) => (
                              <img 
                                key={imgIndex}
                                src={url} 
                                alt={`Example for ${element.title}`} 
                                className="h-24 w-24 object-cover rounded-md shadow-sm"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Typography className="text-gray-500 dark:text-gray-400 italic">
            No commission options available.
          </Typography>
        )}
      </CardBody>

      <CardFooter className="pt-0 flex justify-end">
        <Button className="mt-3">
          Request Commission
        </Button>
      </CardFooter>
    </Card>
  );
};

// Loading State component
export const CommissionCardLoading: React.FC = () => {
  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardBody className="p-8 flex flex-col items-center justify-center">
        <Spinner className="h-8 w-8 mb-4" />
        <Typography className="text-gray-700">Loading commission details...</Typography>
      </CardBody>
    </Card>
  );
};

// Error State component
export const CommissionCardError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Card className="w-full shadow-lg overflow-hidden">
      <CardBody className="p-8 text-center">
        <Typography variant="h6" color="error" className="mb-2">
          Error Loading Commission Card
        </Typography>
        <Typography className="text-gray-700">{message}</Typography>
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
      <Card className="w-full shadow-lg overflow-hidden">
        <CardHeader
          floated={false}
          shadow={false}
          color="blue-gray"
          className="m-0 bg-gradient-to-r from-purple-500 to-indigo-600 p-5"
        >
          <div className="flex items-center gap-3">
            <PaletteIcon className="h-8 w-8 text-white" />
            <div>
              <Typography variant="h5" color="white">
                Create Your Commission Card
              </Typography>
              <Typography color="white" variant="small" className="opacity-80">
                Let clients know what services you offer
              </Typography>
            </div>
          </div>
        </CardHeader>
  
        <CardBody className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Typography variant="h6" className="mb-2">
                Title
              </Typography>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Digital Art Commissions"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
  
            <div>
              <Typography variant="h6" className="mb-2">
                Description
              </Typography>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the types of commissions you offer..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                required
              />
            </div>
  
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
  
            <div className="flex justify-end">
              <Button
                type="submit"
                color="purple"
                className="mt-4"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" /> Creating...
                  </div>
                ) : (
                  "Create Commission Card"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    );
  };


export default CommissionCard;