import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const chatBubbleVariants = cva(
  "max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-soft transition-smooth",
  {
    variants: {
      variant: {
        user: "chat-bubble-user ml-auto rounded-br-md",
        bot: "chat-bubble-bot rounded-bl-md",
        system: "bg-muted text-muted-foreground text-center text-xs py-2 px-3 rounded-full mx-auto",
      },
      size: {
        default: "text-sm",
        sm: "text-xs px-3 py-2",
        lg: "text-base px-5 py-4",
      },
    },
    defaultVariants: {
      variant: "bot",
      size: "default",
    },
  }
);

export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {
  message: string;
  timestamp?: string;
  avatar?: React.ReactNode;
  language?: string;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, size, message, timestamp, avatar, language, ...props }, ref) => {
    const getLanguageFlag = (lang?: string) => {
      const languageMap: Record<string, string> = {
        'en': '🇺🇸',
        'hi': '🇮🇳',
        'bn': '🇧🇩',
        'te': '🇮🇳',
        'mr': '🇮🇳',
        'ta': '🇮🇳',
        'gu': '🇮🇳',
        'kn': '🇮🇳',
        'pa': '🇮🇳',
        'ml': '🇮🇳',
        'or': '🇮🇳',
        'as': '🇮🇳',
      };
      return languageMap[lang || 'en'] || '🇺🇸';
    };

    const getLanguageName = (lang?: string) => {
      const languageMap: Record<string, string> = {
        'en': 'EN',
        'hi': 'HI',
        'bn': 'BN',
        'te': 'TE',
        'mr': 'MR',
        'ta': 'TA',
        'gu': 'GU',
        'kn': 'KN',
        'pa': 'PA',
        'ml': 'ML',
        'or': 'OR',
        'as': 'AS',
      };
      return languageMap[lang || 'en'] || 'EN';
    };

    return (
      <div
        className={cn(
          "flex gap-3 items-end mb-4",
          variant === "user" ? "flex-row-reverse" : "flex-row"
        )}
        ref={ref}
        {...props}
      >
        {avatar && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
            {avatar}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className={cn(chatBubbleVariants({ variant, size }), className)}>
            {message}
          </div>
          <div className={cn(
            "flex items-center gap-2 px-2",
            variant === "user" ? "justify-end" : "justify-start"
          )}>
            {timestamp && (
              <span className="text-xs text-muted-foreground">
                {timestamp}
              </span>
            )}
            {language && language !== 'en' && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="text-[10px]">{getLanguageFlag(language)}</span>
                <span className="font-medium">{getLanguageName(language)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";

export { ChatBubble, chatBubbleVariants };