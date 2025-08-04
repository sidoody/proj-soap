import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white shadow-sm dark:bg-zinc-900 p-6",
        className
      )}
    >
      {children}
    </div>
  );
} 