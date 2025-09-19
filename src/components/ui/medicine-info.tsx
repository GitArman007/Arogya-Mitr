import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  Info, 
  Clock, 
  Shield,
  Loader2,
  X,
  WifiOff
} from "lucide-react";
import { getMedicineSuggestions } from "@/lib/gemini-api";
import { offlineDataService } from "@/lib/offline-data";
import { useNetworkStatus } from "@/hooks/use-network-status";

interface MedicineInfoProps {
  language: string;
  apiKey: string;
}

interface MedicineResult {
  diseaseName: string;
  suggestions: string;
  timestamp: string;
}

export function MedicineInfo({ language, apiKey }: MedicineInfoProps) {
  const [diseaseInput, setDiseaseInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [error, setError] = useState("");

  const isHindi = language === "hi";
  const { isOnline, isOffline } = useNetworkStatus();

  const commonDiseases = isHindi 
    ? [
        "खांसी", "सर्दी", "सिरदर्द", "बदन दर्द", "पेट दर्द", 
        "अपच", "बुखार", "गले में खराश", "कब्ज", "दस्त",
        "जी मिचलाना", "मांसपेशियों में दर्द", "जोड़ों का दर्द", 
        "त्वचा में जलन", "नींद न आना", "तनाव"
      ]
    : [
        "cough", "cold", "headache", "body pain", "stomach pain",
        "indigestion", "fever", "sore throat", "constipation", "diarrhea",
        "nausea", "muscle pain", "joint pain", "skin irritation", 
        "sleep issues", "stress"
      ];

  const handleSearch = async () => {
    if (!diseaseInput.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      let suggestions: string;

      if (isOffline) {
        // Use offline medicine data
        suggestions = offlineDataService.generateMedicineResponse(diseaseInput.trim(), language);
        
        // Add offline indicator to the response
        const offlineIndicator = isHindi 
          ? "\n\n(ऑफ़लाइन मोड में प्रतिक्रिया)"
          : "\n\n(Response in offline mode)";
        suggestions += offlineIndicator;
      } else {
        // Use online API
        suggestions = await getMedicineSuggestions({
          diseaseName: diseaseInput.trim(),
          language: language
        }, apiKey);
      }

      const newResult: MedicineResult = {
        diseaseName: diseaseInput.trim(),
        suggestions,
        timestamp: new Date().toLocaleTimeString()
      };

      setResults(prev => [newResult, ...prev]);
      setDiseaseInput("");
    } catch (err) {
      console.error('Medicine search error:', err);
      
      // Fallback to offline data if online fails
      if (isOnline) {
        try {
          const offlineSuggestions = offlineDataService.generateMedicineResponse(diseaseInput.trim(), language);
          const offlineIndicator = isHindi 
            ? "\n\n(ऑफ़लाइन मोड में प्रतिक्रिया - ऑनलाइन सेवा असफल)"
            : "\n\n(Response in offline mode - online service failed)";
          
          const newResult: MedicineResult = {
            diseaseName: diseaseInput.trim(),
            suggestions: offlineSuggestions + offlineIndicator,
            timestamp: new Date().toLocaleTimeString()
          };

          setResults(prev => [newResult, ...prev]);
          setDiseaseInput("");
          setIsLoading(false);
          return;
        } catch (offlineErr) {
          console.error('Offline fallback error:', offlineErr);
        }
      }
      
      setError(err instanceof Error ? err.message : "Failed to get medicine suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiseaseClick = (disease: string) => {
    setDiseaseInput(disease);
  };

  const clearResults = () => {
    setResults([]);
    setError("");
  };

  const formatMedicineResponse = (text: string) => {
    // Split by ** sections and format accordingly
    const sections = text.split(/\*\*(.*?)\*\*/g);
    return sections.map((section, index) => {
      if (index % 2 === 1) {
        // This is a header (between **)
        return (
          <div key={index} className="mt-4 mb-2">
            <h4 className="font-semibold text-foreground text-sm">{section}</h4>
          </div>
        );
      } else {
        // This is content
        const lines = section.split('\n').filter(line => line.trim());
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lineIndex) => {
              if (line.startsWith('•')) {
                return (
                  <div key={lineIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground">{line.substring(1).trim()}</span>
                  </div>
                );
              }
              return line.trim() ? (
                <p key={lineIndex} className="text-sm text-muted-foreground">{line.trim()}</p>
              ) : null;
            })}
          </div>
        );
      }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto card-enhanced">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-medium float-animation">
          <Pill className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-gradient text-xl">
          {isHindi ? "दवा जानकारी" : "Medicine Info"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {isHindi 
            ? "सामान्य बीमारियों के लिए दवा सुझाव प्राप्त करें"
            : "Get medicine suggestions for common ailments"
          }
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Important Notice */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-700">
            {isHindi 
              ? "यह केवल सामान्य, गैर-गंभीर बीमारियों के लिए है। गंभीर लक्षणों के लिए तुरंत डॉक्टर से सलाह लें।"
              : "This is only for common, non-serious ailments. Consult a doctor immediately for serious symptoms."
            }
          </AlertDescription>
        </Alert>

        {/* Offline Status Indicator */}
        {isOffline && (
          <Alert className="border-orange-200 bg-orange-50">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-xs text-orange-700">
              {isHindi 
                ? "ऑफ़लाइन मोड - स्थानीय दवा डेटा का उपयोग कर रहे हैं"
                : "Offline mode - Using local medicine data"
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Search Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="diseaseInput">
              {isHindi ? "बीमारी या लक्षण का नाम" : "Disease or Symptom Name"}
            </Label>
            <div className="flex gap-2">
              <Input
                id="diseaseInput"
                value={diseaseInput}
                onChange={(e) => setDiseaseInput(e.target.value)}
                placeholder={isHindi ? "जैसे: खांसी, सिरदर्द, पेट दर्द..." : "e.g., cough, headache, stomach pain..."}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                disabled={!diseaseInput.trim() || isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Common Diseases */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isHindi ? "सामान्य बीमारियाँ:" : "Common Ailments:"}
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonDiseases.map((disease, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleDiseaseClick(disease)}
                >
                  {disease}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-xs text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {isHindi ? "दवा सुझाव" : "Medicine Suggestions"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResults}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                {isHindi ? "साफ़ करें" : "Clear"}
              </Button>
            </div>

            <ScrollArea className="max-h-96">
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <h4 className="font-medium text-foreground capitalize">
                            {result.diseaseName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {result.timestamp}
                        </div>
                      </div>
                      
                      <Separator className="mb-3" />
                      
                      <div className="space-y-2 text-sm">
                        {formatMedicineResponse(result.suggestions)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Safety Information */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs text-blue-700">
            <div className="space-y-1">
              <p className="font-medium">
                {isHindi ? "सुरक्षा सूचना:" : "Safety Information:"}
              </p>
              <ul className="space-y-1 ml-4">
                <li>• {isHindi ? "ये सुझाव केवल अस्थायी राहत के लिए हैं" : "These suggestions are for temporary relief only"}</li>
                <li>• {isHindi ? "दवा लेने से पहले लेबल पढ़ें" : "Read medicine labels before taking"}</li>
                <li>• {isHindi ? "लक्षण बिगड़ने पर डॉक्टर से मिलें" : "Consult doctor if symptoms worsen"}</li>
                <li>• {isHindi ? "गर्भावस्था या स्तनपान के दौरान सावधानी बरतें" : "Be cautious during pregnancy or breastfeeding"}</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
