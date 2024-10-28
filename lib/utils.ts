import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;

  const ELLIPSIS = "...";

  const truncationLength = maxLength - ELLIPSIS.length;

  return str.slice(0, truncationLength) + ELLIPSIS;
}
