import * as React from "react"
import { cn } from "@/lib/utils"
import Magnetic from "./Magnetic"
import { useTheme } from "@/contexts/ThemeContext"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
  magnetic?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", magnetic = true, ...props }, ref) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    
    const styles = {
      primary: `
        ${isDark ? (
          "bg-white text-black hover:bg-zinc-50 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
        ) : (
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_20px_60px_rgba(16,185,129,0.25)]"
        )}
        before:absolute before:inset-0 before:bg-brand-blue/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
        after:absolute after:inset-0 after:ring-1 after:ring-brand-blue/0 hover:after:ring-brand-blue/30 after:transition-all after:duration-500
      `,
      secondary: `
        ${isDark ? (
          "bg-white/[0.03] text-white border border-white/5 backdrop-blur-md hover:bg-white/[0.06] hover:border-brand-blue/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
        ) : (
          "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--card-hover)]"
        )}
        transition-all duration-500
      `,
      outline: `
        ${isDark ? (
          "border border-white/5 bg-transparent hover:bg-white/[0.03] hover:border-white/20 text-white"
        ) : (
          "border border-[var(--border)] bg-transparent hover:bg-[var(--card-hover)] text-[var(--text-primary)]"
        )}
        transition-all duration-500
      `,
      ghost: `
        ${isDark ? (
          "hover:bg-white/[0.03] text-zinc-400 hover:text-white"
        ) : (
          "hover:bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        )}
        transition-all duration-500
      `,
    }
    
    const variants = {
      primary: cn(styles.primary),
      secondary: cn(styles.secondary),
      outline: cn(styles.outline),
      ghost: cn(styles.ghost),
    }
    
    const sizes = {
      sm: "h-10 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-[50px] md:h-14 px-8 md:px-10 text-[13px] md:text-base uppercase tracking-[0.12em] md:tracking-[0.2em]",
      icon: "h-11 w-11",
    }

    const button = (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-none font-medium transition-all duration-500 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 font-display overflow-hidden group",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{props.children}</span>
        {variant !== "ghost" && (
          <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
        )}
      </button>
    )

    if (magnetic && size !== 'sm' && variant !== 'ghost') {
      return <Magnetic>{button}</Magnetic>
    }

    return button
  }
)
Button.displayName = "Button"

export { Button }
