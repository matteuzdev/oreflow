import { useContext } from "react"
import { ThemeContext } from "../contexts/ThemeContext"
import { cn } from "@/lib/utils"

function Card({ className, ...props }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || "#2563eb"
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-white text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm transition hover:shadow-lg",
        className
      )}
      style={{ borderColor: primary, borderWidth: 2 }}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pb-4 border-b",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  const { theme } = useContext(ThemeContext)
  const primary = theme?.primaryColor || "#2563eb"
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-bold text-2xl", className)}
      style={{ color: primary }}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-gray-500 text-base", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pt-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pt-4 border-t", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
