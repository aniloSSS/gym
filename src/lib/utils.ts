import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function progressValue(value: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / target) * 100));
}
