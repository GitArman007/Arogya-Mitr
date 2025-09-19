import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff, AlertCircle } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  language?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type your health question here...",
  isLoading = false,
  className,
  language = 'en-US'
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // Map language codes to speech recognition language codes
  const getSpeechLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-BD',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'pa': 'pa-IN',
      'ml': 'ml-IN',
      'or': 'or-IN',
      'as': 'as-IN',
    };
    return languageMap[lang] || 'en-US';
  };

  const {
    isListening,
    transcript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition(getSpeechLanguage(language));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Update input value when transcript changes
  React.useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-end gap-3 p-4 bg-background border border-border rounded-xl shadow-soft">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[50px] max-h-32 resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-2">
          {isSupported && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-200",
                isListening 
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={!value.trim() || isLoading}
            size="sm"
            className="h-10 w-10 p-0 rounded-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 px-2 space-y-1">
        <p className="text-xs text-muted-foreground">
          Press Enter to send • Shift + Enter for new line
          {isSupported && " • Click mic for voice input"}
        </p>
        
        {/* Voice input status */}
        {isListening && (
          <div className="flex items-center gap-2 text-xs text-red-600 animate-pulse">
            <Mic className="h-3 w-3" />
            <span>Listening... Speak now</span>
          </div>
        )}
        
        {/* Speech recognition error */}
        {speechError && (
          <div className="flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>{speechError}</span>
          </div>
        )}
        
        {/* Browser support notice */}
        {!isSupported && (
          <div className="flex items-center gap-2 text-xs text-amber-600">
            <AlertCircle className="h-3 w-3" />
            <span>Voice input not supported in this browser</span>
          </div>
        )}
      </div>
    </form>
  );
}