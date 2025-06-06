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
  Textarea,
} from "@material-tailwind/react";
import { PaletteIcon } from "./CustomIcons";
import CustomFormButton from "./CustomFormButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";
import { useAuthStatus } from "../resources/AuthStatus";
import ImageModal from "./ImageModal";

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
  currentUser?: string; // Add current user prop
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

// Edit Icon Component
const EditIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-4 h-4"}>
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v4.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h4.5a.75.75 0 000-1.5H5.25z" />
  </svg>
);

// Delete Icon Component
const DeleteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-4 h-4"}>
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

// Upload Icon Component
const UploadIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-4 h-4"}>
    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

// Reusable Service Element Component with editing capabilities
const ServiceElement: React.FC<{
  element: CommissionCardElement;
  index: number;
  isOpen: boolean;
  isOwner: boolean;
  onToggle: (index: number) => void;
  onUpdate: (elementId: number, updates: Partial<CommissionCardElement>) => void;
  onDelete: (elementId: number) => void;
  artistName: string;
}> = ({ element, index, isOpen, isOwner, onToggle, onUpdate, onDelete }) => {
  const { isLoggedIn } = useAuthStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(element.price?.toString() || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const handlePriceUpdate = async () => {
    if (updating || !isLoggedIn) return;
    
    try {
      setUpdating(true);
      const price = editPrice ? parseFloat(editPrice) : undefined;
      
      // Validate price
      if (editPrice && (isNaN(price!) || price! < 0)) {
        alert('Please enter a valid price');
        return;
      }
      
      await onUpdate(element.id, { price });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update price:', error);
      alert('Failed to update price. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (deleteLoading || !isLoggedIn) return;
    
    try {
      setDeleteLoading(true);
      await onDelete(element.id);
    } catch (error) {
      console.error('Failed to delete element:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/images/upload/userpic', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload image: ${errorText}`);
      }

      const result = await response.json();
      const newImageUrls = [...(element.exampleImageUrls || []), result.url];
      await onUpdate(element.id, { exampleImageUrls: newImageUrls });
      
      // Clear the input so the same file can be uploaded again if needed
      event.target.value = '';
    } catch (error: any) {
      console.error('Image upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = (url: string, title: string) => {
    setSelectedImage({ src: url, alt: `Example for ${title}` });
  };

  const handleImageDelete = async (imageIndex: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the image click
    
    if (!element.exampleImageUrls || imageIndex >= element.exampleImageUrls.length) {
      return;
    }

    const imageUrl = element.exampleImageUrls[imageIndex];
    
    try {
      // Extract filename from URL for deletion
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const response = await fetch(`/api/images/delete/${fileName}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Failed to delete image file:', errorData.error || 'Unknown error');
        // Continue with removing from array even if file deletion fails
      }

      // Remove from the array regardless of file deletion success
      const newImageUrls = element.exampleImageUrls.filter((_, idx) => idx !== imageIndex);
      await onUpdate(element.id, { exampleImageUrls: newImageUrls });
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Still try to remove from array as fallback
      const newImageUrls = element.exampleImageUrls.filter((_, idx) => idx !== imageIndex);
      await onUpdate(element.id, { exampleImageUrls: newImageUrls });
    }
  };

  return (
    <>
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
              <div className="flex items-center gap-2 flex-shrink-0">
                {isEditing ? (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Input
                      size="sm"
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="!w-20 !border-gray-300 dark:!border-gray-600"
                      disabled={updating}
                    />
                    <CustomFormButton 
                      size="sm" 
                      onClick={handlePriceUpdate} 
                      className="!p-1"
                      disabled={updating}
                    >
                      {updating ? <Spinner className="w-3 h-3" /> : '✓'}
                    </CustomFormButton>
                    <CustomFormButton 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)} 
                      className="!p-1"
                      disabled={updating}
                    >
                      ✕
                    </CustomFormButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Chip 
                      color="success" 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium shadow-sm"
                      size="sm"
                    >
                      ${element.price.toFixed(2)}
                    </Chip>
                    {isOwner && (
                      <CustomFormButton
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                        }}
                        className="!px-3"
                        disabled={updating || deleteLoading}
                      >
                        <EditIcon className="w-3 h-3" />
                      </CustomFormButton>
                    )}
                  </div>
                )}
              </div>
            )}
            {isOwner && !isEditing && (
              <CustomFormButton 
                size="sm" 
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                isFullWidth={false}
                className="flex-shrink-0 bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800 text-white rounded-full shadow-sm !px-3"
                disabled={updating || deleteLoading}
              >
                {deleteLoading ? <Spinner className="w-3 h-3" /> : <DeleteIcon className="w-3 h-3" />}
              </CustomFormButton>
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
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    Example Gallery
                  </div>
                  {isOwner && (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id={`upload-${element.id}`}
                      />
                      <CustomFormButton
                        size="sm"
                        variant="outline"
                        className="!py-1 !px-2 !text-xs"
                        disabled={uploading}
                        isFullWidth={false}
                        onClick={() => {
                          const fileInput = document.getElementById(`upload-${element.id}`) as HTMLInputElement;
                          fileInput?.click();
                        }}
                      >
                        {uploading ? (
                          <Spinner className="w-3 h-3" />
                        ) : (
                          <>
                            <UploadIcon className="w-3 h-3 mr-1" />
                            Add Image
                          </>
                        )}
                      </CustomFormButton>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <Typography variant="small" className="text-red-500 mb-2">
                    {uploadError}
                  </Typography>
                )}

                {element.exampleImageUrls && element.exampleImageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {element.exampleImageUrls.map((url, imgIndex) => (
                      <div key={imgIndex} className="relative group aspect-square">
                        <img 
                          src={url} 
                          alt={`Example for ${element.title}`} 
                          className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg transition-all duration-300 cursor-pointer transform group-hover:scale-105 group-active:scale-95"
                          loading="lazy"
                          onClick={() => handleImageClick(url, element.title)}
                        />
                        {isOwner && (
                          <CustomFormButton
                            onClick={(e) => handleImageDelete(imgIndex, e)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 shadow-lg transform group-hover:translate-y-0 translate-y-1"
                            isFullWidth={false}
                          >
                            <DeleteIcon className="w-3 h-3" />
                          </CustomFormButton>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 italic">
                    No example images yet
                  </Typography>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={selectedImage !== null}
        imageSrc={selectedImage?.src || ''}
        imageAlt={selectedImage?.alt || ''}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

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

// Common hooks and utilities
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      return await apiCall();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
};

// Add Service Form Component
const AddServiceForm: React.FC<{
  artistName: string;
  onSuccess: (newElement: CommissionCardElement) => void;
  onCancel: () => void;
}> = ({ artistName, onSuccess, onCancel }) => {
  const { isLoggedIn } = useAuthStatus();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { call, loading, error } = useApiCall();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    await call(async () => {
      const response = await fetch(`/api/users/${artistName}/commission-card/elements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: price ? parseFloat(price) : null,
          exampleImageUrls: []
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create service: ${response.statusText}`);
      }

      const newElement = await response.json();
      onSuccess(newElement);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <CardBody className="p-6">
        <Typography variant="h6" className="mb-4 text-blue-800 dark:text-blue-200">
          Add New Service
        </Typography>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Service Title">
            <Input
              size="lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Character Portrait, Logo Design"
              className="!border-blue-300 dark:!border-blue-600 focus:!border-blue-500"
              maxLength={100}
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this service includes, your process, delivery time, etc."
              className="!border-blue-300 dark:!border-blue-600 focus:!border-blue-500 min-h-[100px]"
              rows={4}
              maxLength={500}
              required
            />
          </FormField>

          <FormField label="Price (Optional)">
            <Input
              size="lg"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 50.00"
              className="!border-blue-300 dark:!border-blue-600 focus:!border-blue-500"
            />
          </FormField>

          {error && (
            <ErrorAlert title="Creation Failed" message={error} />
          )}

          <div className="flex gap-3 pt-4">
            <CustomFormButton
              type="submit"
              disabled={loading || !title.trim() || !description.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Creating...
                </div>
              ) : (
                'Add Service'
              )}
            </CustomFormButton>
            
            <CustomFormButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </CustomFormButton>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

// Commission Card Display Component
export const CommissionCard: React.FC<CommissionCardProps> = ({
  title,
  description,
  elements,
  isOwner = false,
  onEdit,
  onDelete,
  currentUser
}) => {
  const { username: loggedInUser, isLoggedIn } = useAuthStatus();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);
  const [commissionElements, setCommissionElements] = useState(elements);
  const [showAddForm, setShowAddForm] = useState(false);

  const effectiveCurrentUser = loggedInUser || currentUser;

  useEffect(() => {
    setCommissionElements(elements);
  }, [elements]);

  const handleAccordionOpen = useCallback((index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  }, [openAccordion]);

  const handleElementUpdate = async (elementId: number, updates: Partial<CommissionCardElement>) => {
    if (!effectiveCurrentUser || !isLoggedIn) {
      alert('You must be logged in to update elements');
      return;
    }
    
    try {
      setUpdating(true);
      const response = await fetch(`/api/users/${effectiveCurrentUser}/commission-card/elements/${elementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update element: ${response.statusText}`);
      }

      setCommissionElements(prev => 
        prev.map(element => 
          element.id === elementId 
            ? { ...element, ...updates }
            : element
        )
      );

    } catch (error: any) {
      console.error('Failed to update element:', error);
      alert(`Failed to update element: ${error.message}`);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleElementDelete = async (elementId: number) => {
    if (!effectiveCurrentUser || !isLoggedIn) {
      alert('You must be logged in to delete elements');
      return;
    }

    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      setUpdating(true);
      const response = await fetch(`/api/users/${effectiveCurrentUser}/commission-card/elements/${elementId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete element: ${response.statusText}`);
      }

      setCommissionElements(prev => 
        prev.filter(element => element.id !== elementId)
      );

    } catch (error: any) {
      console.error('Failed to delete element:', error);
      alert(`Failed to delete element: ${error.message}`);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  const handleServiceAdded = (newElement: CommissionCardElement) => {
    setCommissionElements(prev => [...prev, newElement]);
    setShowAddForm(false);
  };

  const validElements = commissionElements?.filter(element => element.title && element.description) || [];

  return (
    <div className="space-y-6">
      {showAddForm && isOwner && (
        <AddServiceForm
          artistName={effectiveCurrentUser || ''}
          onSuccess={handleServiceAdded}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        {updating && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <Spinner className="h-6 w-6" />
                <span className="text-gray-700 dark:text-gray-300">Updating...</span>
              </div>
            </div>
          </div>
        )}
        
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                  <Typography variant="h5" className="text-gray-800 dark:text-gray-200 font-semibold">
                    Available Services ({validElements.length})
                  </Typography>
                </div>
                
                {isOwner && !showAddForm && (
                  <CustomFormButton
                    size="sm"
                    onClick={() => setShowAddForm(true)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={updating}
                  >
                    + Add Service
                  </CustomFormButton>
                )}
              </div>
              
              <div className="space-y-3">
                {validElements.map((element, index) => (
                  <ServiceElement
                    key={element.id || index}
                    element={element}
                    index={index}
                    isOpen={openAccordion === index}
                    isOwner={isOwner}
                    onToggle={handleAccordionOpen}
                    onUpdate={handleElementUpdate}
                    onDelete={handleElementDelete}
                    artistName={currentUser || ''}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <EmptyState
                title="No services available"
                description={isOwner ? "Add your first commission service to get started!" : "This artist hasn't added any commission services yet."}
                className="py-8"
              />
              
              {isOwner && !showAddForm && (
                <div className="flex justify-center">
                  <CustomFormButton
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={updating}
                  >
                    + Add Your First Service
                  </CustomFormButton>
                </div>
              )}
            </div>
          )}
        </CardBody>

        <CardFooter className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {!isOwner && isLoggedIn && (
              <CustomFormButton 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex-1 text-white dark:text-white"
                color="primary"
                onClick={() => {
                  alert('Commission request feature coming soon!'); // Placeholder for actual request logic
                }}
              >
                Request Commission
              </CustomFormButton>
            )}
            {!isLoggedIn && (
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic py-3">
                <a href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Sign in to request commissions
                </a>
              </div>
            )}
            {isOwner && (
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm italic py-3">
                This is your commission card
              </div>
            )}
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
    </div>
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
    artistName?: string; // Make optional since we can get it from auth
    onSuccess?: () => void;
  }> = ({ artistName, onSuccess }) => {
    const { username: loggedInUser, isLoggedIn } = useAuthStatus();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const effectiveArtistName = artistName || loggedInUser;
    const isFormValid = title.trim().length > 0 && description.trim().length > 0 && isLoggedIn && effectiveArtistName;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) {
        setError("Please provide both title and description, and ensure you're logged in");
        return;
      }
  
      try {
        setLoading(true);
        setError(null);
  
        const response = await fetch(`/api/users/${effectiveArtistName}/commission-card`, {
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

    if (!isLoggedIn) {
      return (
        <Card className="w-full shadow-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardBody className="p-6 text-center">
            <Typography variant="h5" className="mb-4">Please Sign In</Typography>
            <Typography className="mb-4">You need to be signed in to create a commission card.</Typography>
            <a href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
              Go to Sign In
            </a>
          </CardBody>
        </Card>
      );
    }
  
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