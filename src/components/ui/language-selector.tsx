import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Check } from "lucide-react";

const languages = [
  { code: "hi", name: "हिंदी", nativeName: "Hindi" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "bn", name: "বাংলা", nativeName: "Bengali" },
  { code: "te", name: "తెలుగు", nativeName: "Telugu" },
  { code: "mr", name: "मराठी", nativeName: "Marathi" },
  { code: "ta", name: "தமிழ்", nativeName: "Tamil" },
  { code: "gu", name: "ગુજરાતી", nativeName: "Gujarati" },
  { code: "kn", name: "ಕನ್ನಡ", nativeName: "Kannada" },
  { code: "pa", name: "ਪੰਜਾਬੀ", nativeName: "Punjabi" },
  { code: "ml", name: "മലയാളം", nativeName: "Malayalam" },
  { code: "or", name: "ଓଡ଼ିଆ", nativeName: "Odia" },
  { code: "as", name: "অসমীয়া", nativeName: "Assamese" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  variant?: "default" | "compact";
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  variant = "default"
}: LanguageSelectorProps) {
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={variant === "compact" ? "sm" : "default"}
          className={cn(
            "gap-2 bg-background hover:bg-muted border-border",
            variant === "compact" && "h-8 px-2"
          )}
        >
          <Languages className="h-4 w-4" />
          <span className="font-medium">
            {variant === "compact" ? currentLanguage.code.toUpperCase() : currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-muted"
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.name}</span>
              <span className="text-xs text-muted-foreground">{language.nativeName}</span>
            </div>
            {selectedLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}