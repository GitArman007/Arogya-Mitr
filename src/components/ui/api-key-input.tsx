import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, Shield, AlertTriangle } from "lucide-react";

interface ApiKeyInputProps {
  onGovApiKeySet?: (govApiKey: string) => void;
  existingGovApiKey?: string;
}

export function ApiKeyInput({ onGovApiKeySet, existingGovApiKey }: ApiKeyInputProps) {
  const [govApiKey, setGovApiKey] = useState(existingGovApiKey || "");
  const [showGovApiKey, setShowGovApiKey] = useState(false);
  const [isValidatingGov, setIsValidatingGov] = useState(false);

  // Gemini key input removed; Gemini key is hardcoded internally

  const handleGovApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!govApiKey.trim()) return;

    setIsValidatingGov(true);
    
    // Basic validation for GOV API key
    if (govApiKey.length > 10) {
      localStorage.setItem('gov_health_dataset_api_key', govApiKey);
      onGovApiKeySet?.(govApiKey);
    } else {
      alert('Please enter a valid GOV Health Dataset API key');
    }
    
    setIsValidatingGov(false);
  };

  const handleGovApiKeyClear = () => {
    setGovApiKey("");
    localStorage.removeItem('gov_health_dataset_api_key');
    onGovApiKeySet?.("");
  };

  return (
    <Card className="w-full max-w-md mx-auto card-enhanced">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-medium float-animation">
          <Key className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-gradient text-xl">API Configuration</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Configure your GOV Health Dataset API key for real-time alerts and data
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Your GOV key is stored locally in your browser and never sent to our servers.
          </AlertDescription>
        </Alert>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">GOV Health Dataset</span>
          </div>
        </div>

        {/* GOV Health Dataset API Form */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">GOV Health Dataset API</h3>
            <p className="text-sm text-muted-foreground">
              Access real-time government health data and alerts
            </p>
          </div>

          <form onSubmit={handleGovApiKeySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="govApiKey">GOV Health Dataset API Key</Label>
              <div className="relative">
                <Input
                  id="govApiKey"
                  type={showGovApiKey ? "text" : "password"}
                  value={govApiKey}
                  onChange={(e) => setGovApiKey(e.target.value)}
                  placeholder="Enter your GOV API key..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowGovApiKey(!showGovApiKey)}
                >
                  {showGovApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={!govApiKey.trim() || isValidatingGov}
                className="flex-1"
              >
                {isValidatingGov ? "Validating..." : existingGovApiKey ? "Update GOV Key" : "Save GOV API Key"}
              </Button>
              {existingGovApiKey && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGovApiKeyClear}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Get your GOV Health Dataset API key from{" "}
              <a 
                href="https://data.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Government Health Portal
              </a>
            </AlertDescription>
          </Alert>
        </div>

      </CardContent>
    </Card>
  );
}