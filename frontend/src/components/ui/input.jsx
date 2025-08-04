import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || "#2563eb"

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      style={{
        borderColor: primary,
        boxShadow: props["aria-invalid"] ? "0 0 0 2px #ef4444" : undefined,
      }}
      {...props}
      onFocus={e => {
        e.target.style.boxShadow = `0 0 0 3px ${primary}44`
        if (props.onFocus) props.onFocus(e)
      }}
      onBlur={e => {
        e.target.style.boxShadow = ""
        if (props.onBlur) props.onBlur(e)
      }}
    />
  )
}

export { Input }
