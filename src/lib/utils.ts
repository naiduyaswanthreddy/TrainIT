
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme utilities
export type Theme = 'dark' | 'light' | 'system';

export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    return storedTheme;
  }
  
  return 'dark';
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
  document.documentElement.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(systemTheme);
  } else {
    document.documentElement.classList.add(theme);
  }
}
