import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { LanguageSelector } from "@/components/ui/language-selector";
import { HealthCategories } from "@/components/ui/health-categories";
import { ChatInput } from "@/components/ui/chat-input";
import { ApiKeyInput } from "@/components/ui/api-key-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { callGeminiAPI, validateApiKey } from "@/lib/gemini-api";
import { offlineDataService } from "@/lib/offline-data";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { 
  Bot, 
  User, 
  Heart,
  Menu,
  X,
  Shield,
  Info,
  Settings,
  AlertTriangle,
  Wifi,
  WifiOff
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot" | "system";
  timestamp: string;
  language?: string;
}

const botResponses = {
  en: {
    welcome: "Hello! I'm your healthcare assistant. I can help you with health information, symptoms, vaccination schedules, and preventive care. How can I assist you today?",
    symptoms: "I understand you have some symptoms you'd like to check. Please describe what you're experiencing, including when it started and any other relevant details. Remember, this is for informational purposes only.",
    vaccination: "I can help you with vaccination schedules for children and adults. Are you looking for information about a specific age group or particular vaccines?",
    maternal: "Maternal health is very important. I can provide information about pregnancy care, nutrition during pregnancy, newborn care, and postpartum health. What specific area would you like to know about?",
    chronic: "Chronic diseases like diabetes, hypertension, and heart conditions require ongoing care. I can share information about management, lifestyle changes, and when to seek medical help. Which condition are you interested in?",
    preventive: "Prevention is better than cure! I can share tips about healthy eating, exercise, regular check-ups, and lifestyle habits that promote good health. What aspect of preventive care interests you?",
    emergency: "For medical emergencies, please call emergency services immediately. I can provide first aid information and help you recognize urgent symptoms that require immediate medical attention.",
    default: "I'm here to help with your health questions. Could you please tell me more about what you'd like to know?"
  },
  hi: {
    welcome: "नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। मैं स्वास्थ्य जानकारी, लक्षण, टीकाकरण कार्यक्रम और निवारक देखभाल में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    symptoms: "मैं समझता हूं कि आपके कुछ लक्षण हैं जिन्हें आप जांचना चाहते हैं। कृपया बताएं कि आप क्या अनुभव कर रहे हैं, यह कब शुरू हुआ और कोई अन्य प्रासंगिक विवरण। याद रखें, यह केवल जानकारी के लिए है।",
    vaccination: "मैं बच्चों और वयस्कों के लिए टीकाकरण कार्यक्रम में आपकी मदद कर सकता हूं। क्या आप किसी विशिष्ट आयु समूह या विशेष टीकों के बारे में जानकारी चाहते हैं?",
    maternal: "मातृ स्वास्थ्य बहुत महत्वपूर्ण है। मैं गर्भावस्था की देखभाल, गर्भावस्था के दौरान पोषण, नवजात देखभाल और प्रसवोत्तर स्वास्थ्य के बारे में जानकारी प्रदान कर सकता हूं।",
    chronic: "मधुमेह, उच्च रक्तचाप और हृदय की स्थिति जैसी दीर्घकालिक बीमारियों के लिए निरंतर देखभाल की आवश्यकता होती है। मैं प्रबंधन, जीवनशैली में बदलाव के बारे में जानकारी साझा कर सकता हूं।",
    preventive: "रोकथाम इलाज से बेहतर है! मैं स्वस्थ भोजन, व्यायाम, नियमित जांच और स्वास्थ्य को बढ़ावा देने वाली जीवनशैली की आदतों के बारे में सुझाव साझा कर सकता हूं।",
    emergency: "चिकित्सा आपातकाल के लिए, कृपया तुरंत आपातकालीन सेवाओं को कॉल करें। मैं प्राथमिक चिकित्सा जानकारी प्रदान कर सकता हूं।",
    default: "मैं आपके स्वास्थ्य प्रश्नों में मदद के लिए यहां हूं। कृपया मुझे बताएं कि आप क्या जानना चाहते हैं?"
  }
};

export function HealthcareChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [govApiKey, setGovApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { isOnline, isOffline } = useNetworkStatus();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey && validateApiKey(savedApiKey)) {
      setApiKey(savedApiKey);
    }
    
    const savedGovApiKey = localStorage.getItem('gov_health_dataset_api_key');
    if (savedGovApiKey) {
      setGovApiKey(savedGovApiKey);
    }
  }, []);

  // Update welcome message based on language and API key status
  useEffect(() => {
    const getWelcomeMessage = () => {
      if (!apiKey) {
        return selectedLanguage === "hi" 
          ? "नमस्ते! कृपया AI सुविधा के लिए अपनी Gemini API key सेट करें।"
          : "Hello! Please set up your Gemini API key to enable AI-powered responses.";
      }
      
      return selectedLanguage === "hi"
        ? "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं स्वास्थ्य जानकारी, लक्षण, टीकाकरण कार्यक्रम और निवारक देखभाल में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?"
        : "Hello! I'm your AI-powered healthcare assistant. I can help you with health information, symptoms, vaccination schedules, and preventive care in your preferred language. How can I assist you today?";
    };

    const welcomeMessage: Message = {
      id: "welcome",
      content: getWelcomeMessage(),
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
      language: selectedLanguage
    };
    setMessages([welcomeMessage]);
    setConversationHistory([]);
  }, [selectedLanguage, apiKey]);

  const isEmergencyQuery = (message: string): boolean => {
    const emergencyKeywords = [
      'emergency', 'urgent', 'critical', 'heart attack', 'stroke', 'bleeding',
      'unconscious', 'seizure', 'choking', 'poison', 'burn', 'fracture',
      'breathing', 'chest pain', 'severe', 'acute', 'trauma', 'accident',
      'अत्यावश्यक', 'आपातकाल', 'दिल का दौरा', 'स्ट्रोक', 'खून बहना',
      'बेहोशी', 'दौरा', 'दम घुटना', 'जहर', 'जलना', 'फ्रैक्चर',
      'सांस लेने में', 'छाती में दर्द', 'गंभीर', 'तीव्र', 'चोट', 'दुर्घटना'
    ];
    
    const lowerMessage = message.toLowerCase();
    return emergencyKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Check if this is an emergency query
    const isEmergency = isEmergencyQuery(userMessage) || isEmergencyMode;
    
    // If offline, use offline data service
    if (isOffline) {
      return offlineDataService.processOfflineQuery(userMessage, selectedLanguage, isEmergency);
    }
    
    // If online but no API key, try offline service as fallback
    if (!apiKey) {
      const offlineResponse = offlineDataService.processOfflineQuery(userMessage, selectedLanguage, isEmergency);
      if (offlineResponse.includes('क्षमा करें') || offlineResponse.includes('Sorry')) {
        return selectedLanguage === "hi"
          ? "कृपया पहले अपनी Gemini API key सेट करें या नेटवर्क कनेक्शन की जांच करें।"
          : "Please set up your Gemini API key first or check your network connection.";
      }
      return offlineResponse;
    }
    
    try {
      const response = await callGeminiAPI({
        userMessage,
        language: selectedLanguage,
        conversationHistory,
        isEmergencyMode: isEmergency
      }, apiKey);
      
      return response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to offline data service if API fails
      const offlineResponse = offlineDataService.processOfflineQuery(userMessage, selectedLanguage, isEmergency);
      if (!offlineResponse.includes('क्षमा करें') && !offlineResponse.includes('Sorry')) {
        return offlineResponse + (selectedLanguage === "hi" 
          ? "\n\n(ऑफ़लाइन मोड में प्रतिक्रिया)"
          : "\n\n(Response in offline mode)");
      }
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      if (selectedLanguage === "hi") {
        return `खुशी से मदद करना चाहता हूं, लेकिन तकनीकी समस्या हो रही है: ${errorMessage}। कृपया फिर से कोशिश करें।`;
      } else {
        return `I'd be happy to help, but I'm experiencing a technical issue: ${errorMessage}. Please try again.`;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setShowCategories(false);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update conversation history
    const newHistory = [...conversationHistory, { role: 'user' as const, content: inputValue }];
    setConversationHistory(newHistory);
    
    const currentInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const botResponseContent = await generateBotResponse(currentInput);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseContent,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        language: selectedLanguage
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Update conversation history with bot response
      setConversationHistory(prev => [...prev, { role: 'assistant' as const, content: botResponseContent }]);
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: selectedLanguage === "hi" 
          ? "क्षमा करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें।"
          : "Sorry, something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (query: string, categoryId?: string) => {
    setInputValue(query);
    
    // Check if emergency care category is selected
    if (categoryId === "emergency") {
      setIsEmergencyMode(true);
    } else {
      setIsEmergencyMode(false);
    }
    
    setTimeout(() => handleSendMessage(), 100);
  };

  const resetChat = () => {
    setMessages([]);
    setShowCategories(true);
    setInputValue("");
    setConversationHistory([]);
    setIsEmergencyMode(false);
    // Re-add welcome message
    setTimeout(() => {
      const getWelcomeMessage = () => {
        if (!apiKey) {
          return selectedLanguage === "hi" 
            ? "नमस्ते! कृपया AI सुविधा के लिए अपनी Gemini API key सेट करें।"
            : "Hello! Please set up your Gemini API key to enable AI-powered responses.";
        }
        
        return selectedLanguage === "hi"
          ? "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?"
          : "Hello! I'm your AI-powered healthcare assistant. How can I assist you today?";
      };

      const welcomeMessage: Message = {
        id: "welcome-reset",
        content: getWelcomeMessage(),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
        language: selectedLanguage
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeyInput(false);
    if (newApiKey) {
      resetChat();
    }
  };

  const handleGovApiKeySet = (newGovApiKey: string) => {
    setGovApiKey(newGovApiKey);
  };

  // Show API key input if no API key is set
  if (showApiKeyInput || !apiKey) {
    return (
      <div className="flex h-screen bg-gradient-bg items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ApiKeyInput
            onApiKeySet={handleApiKeySet}
            existingApiKey={apiKey}
            onGovApiKeySet={handleGovApiKeySet}
            existingGovApiKey={govApiKey}
          />
          {apiKey && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowApiKeyInput(false)}
                className="text-sm"
              >
                Continue with current setup
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-bg">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed lg:relative z-50 lg:z-0 h-full w-80 sidebar-enhanced transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-medium float-animation">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">Arogya Mitr</h1>
              <p className="text-xs text-muted-foreground">Your Health Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <div className="px-6 space-y-4">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={resetChat}
            >
              <Bot className="h-4 w-4" />
              New Conversation
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => setShowApiKeyInput(true)}
            >
              <Settings className="h-4 w-4" />
              API Settings
            </Button>
          </div>

          {!apiKey && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Set up your Gemini API key to enable AI responses
              </AlertDescription>
            </Alert>
          )}

          {isOffline && (
            <Alert className="border-orange-200 bg-orange-50">
              <WifiOff className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-xs text-orange-700">
                {selectedLanguage === "hi" 
                  ? "ऑफ़लाइन मोड - स्थानीय रोग डेटा का उपयोग कर रहे हैं"
                  : "Offline mode - Using local disease data"
                }
              </AlertDescription>
            </Alert>
          )}

          {govApiKey && (
            <Alert className="border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-xs text-green-700">
                GOV Health Dataset API connected - Real-time data enabled
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Health Information</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Medically verified content
              </p>
              <p className="flex items-center gap-2">
                <Info className="h-3 w-3" />
                Educational purposes only
              </p>
            </div>
          </div>

          <Badge variant="outline" className="w-full justify-center py-2">
            Available 24/7
          </Badge>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-3 h-3 rounded-full transition-smooth",
              apiKey && isOnline ? "status-online animate-pulse" : 
              isOffline ? "status-offline" : "status-warning"
            )} />
            <span className="text-sm font-medium">
              {isOffline 
                ? (selectedLanguage === "hi" ? "ऑफ़लाइन मोड" : "Offline Mode")
                : apiKey 
                  ? (selectedLanguage === "hi" ? "AI सहायक ऑनलाइन" : "AI Assistant Online")
                  : (selectedLanguage === "hi" ? "API Key आवश्यक" : "API Key Required")
              }
            </span>
            <div className="flex items-center gap-1">
              {isOffline ? (
                <WifiOff className="h-3 w-3 text-muted-foreground" />
              ) : (
                <Wifi className="h-3 w-3 text-success" />
              )}
            </div>
          </div>
          </div>
          
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            variant="compact"
          />
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {showCategories && messages.length <= 1 && (
              <HealthCategories onCategorySelect={handleCategorySelect} />
            )}
            
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.sender === "user" ? "user" : message.sender === "system" ? "system" : "bot"}
                message={message.content}
                timestamp={message.timestamp}
                avatar={
                  message.sender === "user" ? (
                    <div className="w-8 h-8 bg-chat-user rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-chat-user-foreground" />
                    </div>
                  ) : message.sender === "bot" ? (
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ) : null
                }
              />
            ))}
            
            {isLoading && (
              <ChatBubble
                variant="bot"
                message="Typing..."
                avatar={
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground animate-pulse" />
                  </div>
                }
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
              placeholder={
                selectedLanguage === "hi" 
                  ? "अपना स्वास्थ्य प्रश्न यहाँ लिखें..."
                  : "Type your health question here..."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}