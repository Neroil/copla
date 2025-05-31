import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import CustomFormButton from "./CustomFormButton";

interface ImageModalProps {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  onClose: () => void;
}

// Close Icon Component
const CloseIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageSrc, imageAlt, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to ensure the element is rendered before starting animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before hiding
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`relative max-w-7xl max-h-full w-full h-full flex items-center justify-center transition-all duration-300 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Close button */}
        <CustomFormButton
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 ${
            isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
        >
          <CloseIcon className="w-6 h-6" />
        </CustomFormButton>

        {/* Image container */}
        <div className={`relative max-w-full max-h-full transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}>
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          />
          
          {/* Image caption */}
          <div className={`absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg backdrop-blur-sm transition-all duration-300 delay-150 ${
            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}>
            <Typography variant="small" className="text-white/90 text-center">
              {imageAlt}
            </Typography>
            <Typography variant="small" className="text-white/70 text-center mt-1">
              Press ESC or click outside to close
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
