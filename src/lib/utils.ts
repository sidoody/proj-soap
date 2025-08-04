import { twMerge } from "tailwind-merge";
import clsx from "classnames";

type ClassValue = string | number | boolean | undefined | null | Record<string, boolean | undefined | null> | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 