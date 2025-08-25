import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    size?: 'default' | 'sm' | 'lg';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
        
        const variantClasses = {
            default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
            secondary: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
            destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
            outline: "text-gray-900 dark:text-white border-gray-300 dark:border-gray-600",
        };
        
        const sizeClasses = {
            default: "px-2.5 py-0.5 text-xs",
            sm: "px-2 py-0.5 text-xs",
            lg: "px-3 py-1 text-sm",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";

export { Badge };


