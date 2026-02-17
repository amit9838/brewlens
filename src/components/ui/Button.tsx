import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-green-600 text-white hover:bg-green-700",
        secondary: "bg-white dark:bg-gray-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-green-500",
        ghost: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500",
    };

    return (
        <button
            className={cn("px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50", variants[variant], className)}
            {...props}
        />
    );
};