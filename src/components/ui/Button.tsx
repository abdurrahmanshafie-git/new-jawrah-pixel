import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-[0_0_15px_rgba(0,71,255,0.4)] hover:shadow-[0_0_25px_rgba(0,71,255,0.6)] border border-brand-blue/50",
      secondary: "bg-white text-brand-black hover:bg-white/90",
      outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white",
      ghost: "hover:bg-white/5 text-white",
    }
    
    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-14 px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:pointer-events-none disabled:opacity-50 tracking-wide font-display",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
