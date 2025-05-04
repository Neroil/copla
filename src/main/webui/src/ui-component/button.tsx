// src/components/ui/MyButton.tsx (Create folders like this for organization)

import React from 'react';

// Define Props types for type safety and clarity
interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    // children prop is implicitly included via React.ButtonHTMLAttributes
    variant?: 'primary' | 'secondary' | 'danger'; // Example variants
    size?: 'small' | 'medium' | 'large';
}

const MyButton: React.FC<MyButtonProps> = ({
                                               children,
                                               variant = 'primary', // Default variant
                                               size = 'medium', // Default size
                                               className = '', // Allow passing additional classes
                                               disabled = false,
                                               ...props // Pass down other standard button attributes (like onClick, type)
                                           }) => {

    // Base styles common to all buttons
    const baseStyles = `
    font-semibold
    rounded
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    transition duration-150 ease-in-out
    border
    disabled:opacity-50
    disabled:cursor-not-allowed
  `;

    // Variant-specific styles
    const variantStyles = {
        primary: `
      bg-blue-600 hover:bg-blue-700
      text-white
      border-transparent
      focus:ring-blue-500
    `,
        secondary: `
      bg-gray-200 hover:bg-gray-300
      text-gray-800
      border-gray-300
      focus:ring-gray-400
    `,
        danger: `
      bg-red-600 hover:bg-red-700
      text-white
      border-transparent
      focus:ring-red-500
    `,
    };

    // Size-specific styles
    const sizeStyles = {
        small: 'py-1 px-2 text-sm',
        medium: 'py-2 px-4 text-base',
        large: 'py-3 px-6 text-lg',
    };

    // Combine all classes
    // Note: Using template literals here. For complex logic, clsx is better (see below)
    const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className} // Allow overriding or adding classes from outside
  `;

    return (
        <button
            className={combinedClassName.trim().replace(/\s+/g, ' ')} // Trim and normalize whitespace
    disabled={disabled}
    {...props} // Spread remaining props (like onClick, type="submit", etc.)
>
    {children}
    </button>
);
};

export default MyButton;

