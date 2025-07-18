import React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold text-nowrap rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-2 border-purple-600 text-purple-600 bg-transparent hover:bg-purple-600 hover:text-white",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        glass: "glass text-gray-900 hover:shadow-lg",
        light: "text-purple-600 border-purple-600 border-2 bg-transparent hover:bg-purple-600 hover:text-white",
        dark: "bg-gray-900 text-white hover:bg-gray-800",
        white: "bg-white text-gray-900 hover:bg-gray-50 shadow-md",
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm",
        default: "h-11 px-6 py-3",
        lg: "h-12 px-8 py-4 text-lg",
        xl: "h-14 px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, disabled, loading, type = "button", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
