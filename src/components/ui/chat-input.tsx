import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type your health question here...",
  isLoading = false,
  className
}: ChatInputProps) {
  const [isListening, setIsListening] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality would be implemented here
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleVoiceInput}
            className={cn(
              "h-10 w-10 p-0 rounded-full transition-smooth",
              isListening 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >

          </Button>
          
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
      
      <div className="mt-2 px-2">
        <p className="text-xs text-muted-foreground">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </form>
  );
}