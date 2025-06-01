import React from "react";
import { Button, ButtonProps } from "@material-tailwind/react";

interface CustomFormButtonProps extends Omit<ButtonProps, 'className'> {
  children: React.ReactNode;
  className?: string;
}

const CustomFormButton: React.FC<CustomFormButtonProps> = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <Button
      className={`
        bg-purple-500 hover:bg-purple-600 active:bg-purple-700
        dark:bg-purple-400 dark:hover:bg-purple-500 dark:active:bg-purple-600
        text-white dark:text-white
        font-large
        shadow-md hover:shadow-lg
        px-6 py-3
        rounded-lg
        transition-all duration-200 ease-in-out
        transform hover:-translate-y-0.5 active:translate-y-0
        focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-200
        ${className}
      `}
      isFullWidth
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomFormButton;