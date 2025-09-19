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
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", isDefault: true },
  { code: "hi", name: "हिंदी", nativeName: "Hindi", flag: "🇮🇳" },
  { code: "bn", name: "বাংলা", nativeName: "Bengali", flag: "🇧🇩" },
  { code: "te", name: "తెలుగు", nativeName: "Telugu", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", nativeName: "Marathi", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", nativeName: "Tamil", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", nativeName: "Gujarati", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", nativeName: "Kannada", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", nativeName: "Punjabi", flag: "🇮🇳" },
  { code: "ml", name: "മലയാളം", nativeName: "Malayalam", flag: "🇮🇳" },
  { code: "or", name: "ଓଡ଼ିଆ", nativeName: "Odia", flag: "🇮🇳" },
  { code: "as", name: "অসমীয়া", nativeName: "Assamese", flag: "🇮🇳" },
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
            "gap-2 bg-background hover:bg-muted border-border transition-all duration-200",
            variant === "compact" && "h-8 px-2"
          )}
        >
          <Languages className="h-4 w-4" />
          {variant === "compact" ? (
            <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="font-medium">{currentLanguage.name}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-border mb-1">
          {currentLanguage.code === "en" ? "Select Language" : "भाषा चुनें"}
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={cn(
              "flex items-center justify-between cursor-pointer hover:bg-muted transition-colors",
              selectedLanguage === language.code && "bg-primary/10"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-muted-foreground">{language.nativeName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {language.isDefault && (
                <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] font-medium">
                  DEFAULT
                </span>
              )}
              {selectedLanguage === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border mt-1">
          {currentLanguage.code === "en" 
            ? "Language preference is saved automatically" 
            : "भाषा की पसंद स्वचालित रूप से सहेजी जाती है"
          }
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}