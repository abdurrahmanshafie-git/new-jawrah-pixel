import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-sm border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-350",
          isDark 
            ? "border-white/10 bg-brand-navy/50 text-white ring-offset-brand-black placeholder:text-brand-gray/50 focus-visible:ring-brand-blue backdrop-blur-md"
            : "border-[var(--input-border)] bg-[var(--input)] text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] focus-visible:ring-[var(--accent)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-sm border px-3 py-2 text-sm placeholder:text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-350 resize-y",
          isDark
            ? "border-white/10 bg-brand-navy/50 text-white ring-offset-brand-black placeholder:text-brand-gray/50 focus-visible:ring-brand-blue backdrop-blur-md"
            : "border-[var(--input-border)] bg-[var(--input)] text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] focus-visible:ring-[var(--accent)]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Input, Textarea }
