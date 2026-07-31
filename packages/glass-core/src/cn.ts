import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; tailwind-merge resolves conflicting utilities (consumer wins). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
