import React from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface GradientCardProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full ${className}`}
        >
            <Card className="w-full shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader
                    variant="gradient"
                    className="mb-6 grid h-32 place-items-center bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    <div className="flex flex-col items-center relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="p-3 bg-white/20 rounded-full mb-3"
                        >
                            <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <Typography variant="h4" className="text-white font-bold">
                            {title}
                        </Typography>
                        <Typography variant="small" className="text-white/80 mt-1">
                            {subtitle}
                        </Typography>
                    </div>
                </CardHeader>

                <CardBody className="flex flex-col gap-6 p-8">
                    {children}
                </CardBody>

                {footer && (
                    <CardFooter className="pt-0 pb-6 text-center">
                        {footer}
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
};
