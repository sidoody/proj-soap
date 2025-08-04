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
        "rounded-xl bg-white shadow-lg dark:bg-zinc-900 p-6",
        className
      )}
    >
      {children}
    </div>
  );
} 