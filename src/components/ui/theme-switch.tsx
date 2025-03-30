
import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCurrentTheme, applyTheme, type Theme } from "@/lib/utils";

export function ThemeSwitch() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    const theme = getCurrentTheme();
    setCurrentTheme(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);
  
  const themes: { value: Theme; label: string; icon: JSX.Element }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="h-5 w-5" />
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="h-5 w-5" />
    },
    {
      value: 'system',
      label: 'System',
      icon: <Laptop className="h-5 w-5" />
    }
  ];
  
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };
  
  const currentThemeIcon = themes.find(t => t.value === currentTheme)?.icon || themes[0].icon;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground">
          {currentThemeIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(theme => (
          <DropdownMenuItem
            key={theme.value}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleThemeChange(theme.value)}
          >
            {theme.icon}
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
