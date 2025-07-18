// components/animated-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type React from "react";
import type { ButtonProps } from "@/components/ui/button";

interface AnimatedButtonProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonProps["variant"]; // Use correct type for variant
}

export default function AnimatedButton({
  children,
  className,
  variant,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-md p-px font-medium transition-all duration-300 ease-in-out group",
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#8B5CF6_0%,#6366F1_50%,#8B5CF6_100%)]" />
      <Button
        variant={variant}
        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-background px-8 py-3 text-sm font-medium text-foreground backdrop-blur-3xl transition-all duration-300 ease-in-out group-hover:bg-primary group-hover:text-primary-foreground"
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
