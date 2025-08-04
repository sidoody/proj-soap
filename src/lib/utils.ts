import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "classnames";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 