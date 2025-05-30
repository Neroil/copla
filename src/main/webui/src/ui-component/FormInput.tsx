import React from 'react';
import { Input } from "@material-tailwind/react";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
    type: string;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    icon: LucideIcon;
    rightElement?: React.ReactNode;
    required?: boolean;
    size?: "md" | "lg";
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    type,
    placeholder,
    value,
    onChange,
    name,
    icon: Icon,
    rightElement,
    required = false,
    size = "lg",
    className = ""
}) => {
    const hasRightElement = !!rightElement;
    const inputClasses = `pl-12 ${hasRightElement ? 'pr-12' : ''} ${className}`;

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                size={size}
                className={inputClasses}
                required={required}
            />
            {rightElement && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {rightElement}
                </div>
            )}
        </div>
    );
};
