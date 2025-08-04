import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-md border border-gray-300 bg-transparent p-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-gray-400",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea"; 