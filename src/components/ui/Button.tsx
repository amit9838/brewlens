import * as React from "react";
import { Slot } from "@radix-ui/react-slot"; // Install via: npm install @radix-ui/react-slot
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react"; // Or any spinner icon

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link' | 'black' | 'white' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    asChild?: boolean;
    isLoading?: boolean;
    isPill?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', asChild = false, isLoading = false, isPill = false, children, ...props }, ref) => {

        // Using a Component variable to handle the 'asChild' logic
        const Comp = asChild ? Slot : "button";

        const variants = {
            primary: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800 dark:active:bg-green-900 shadow-sm border border-transparent",
            destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 dark:active:bg-red-900 shadow-sm border border-transparent",
            secondary: "bg-zinc-200/70 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600 border border-transparent",
            black: "bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 border border-transparent",
            white: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:active:bg-zinc-600",
            outline: "bg-transparent border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
            ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 border border-transparent",
            glass: "flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-xs font-medium border border-white/10  backdrop-blur-xs",
            link: "bg-transparent text-green-600 underline-offset-4 hover:underline p-0 h-auto border-none dark:text-green-500",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs gap-1.5",
            md: "h-10 px-4 text-sm gap-2",
            lg: "h-12 px-8 text-base font-semibold gap-2.5",
            icon: "h-9 w-9 flex items-center justify-center p-0",
        };

        return (
            <Comp
                className={cn(
                    "cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
                    (isPill || variant === 'glass') ? "rounded-full" : "rounded-md",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && children}
            </Comp>
        );
    }
);

Button.displayName = "Button";

export { Button };