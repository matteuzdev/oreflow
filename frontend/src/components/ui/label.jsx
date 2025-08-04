import { useContext } from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { ThemeContext } from "../contexts/ThemeContext"
import { cn } from "@/lib/utils"

function Label({ className, required, ...props }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || "#2563eb"

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      style={{
        color: required ? primary : undefined,
      }}
      {...props}
    >
      {props.children}
      {required && <span style={{ color: primary }}>*</span>}
    </LabelPrimitive.Root>
  )
}

export { Label }
