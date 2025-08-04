import * as React from "react"
import { useContext } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { ThemeContext } from "../../contexts/ThemeContext"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 shadow-xs disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "", // Não coloca cor fixa, vamos aplicar do ThemeContext
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        outline: "border bg-background hover:bg-accent dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline bg-transparent shadow-none",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  const { theme } = useContext(ThemeContext)

  // Para botões default, aplicar cor primária dinamicamente
  const primaryStyle =
    variant === "default"
      ? {
          backgroundColor: theme?.primaryColor || "#2563eb",
          color: "#fff",
          border: "none",
          boxShadow: "0 2px 6px 0 rgba(37,99,235,.10)",
        }
      : {}

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={primaryStyle}
      {...props}
    />
  )
}

export { Button, buttonVariants }
