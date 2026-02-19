import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Laptop, Palette, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Clean, bright interface",
    },
    {
      value: "dark", 
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      value: "system",
      label: "System",
      icon: Laptop,
      description: "Follow system preference",
    },
  ];

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Theme Preference</h3>
        </div>
        
        <div className="space-y-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.value;
            
            return (
              <Button
                key={themeOption.value}
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start h-auto p-3"
                onClick={() => setTheme(themeOption.value as any)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Icon className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{themeOption.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {themeOption.description}
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Current theme:</span>
            <span className="font-medium capitalize">
              {theme === "system" ? `System (${actualTheme})` : theme}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CompactThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const nextTheme = () => {
    const sequence = ["light", "dark", "system"];
    const currentIndex = sequence.indexOf(theme);
    const nextIndex = (currentIndex + 1) % sequence.length;
    setTheme(sequence[nextIndex] as any);
  };

  const getIcon = () => {
    switch (actualTheme) {
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "light":
        return <Sun className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={nextTheme}
      className="flex items-center space-x-2"
      title={`Current: ${theme === "system" ? `System (${actualTheme})` : theme}. Click to change.`}
    >
      {getIcon()}
      <span className="text-xs">
        {theme === "system" ? "Auto" : theme}
      </span>
    </Button>
  );
}
