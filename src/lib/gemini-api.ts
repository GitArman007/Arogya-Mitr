interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface ChatContext {
  userMessage: string;
  language: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  isEmergencyMode?: boolean;
}

const getLanguageName = (code: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'hi': 'Hindi (हिंदी)',
    'bn': 'Bengali (বাংলা)',
    'te': 'Telugu (తెలుగు)',
    'mr': 'Marathi (मराठी)',
    'ta': 'Tamil (தமிழ்)',
    'gu': 'Gujarati (ગુજરાતી)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'ml': 'Malayalam (മലയാളം)',
    'or': 'Odia (ଓଡ଼ିଆ)',
    'as': 'Assamese (অসমীয়া)',
  };
  return languageMap[code] || 'English';
};

const createEmergencyCarePrompt = (context: ChatContext): string => {
  const languageName = getLanguageName(context.language);
  
  return `You are an emergency health assistant for rural and semi-urban users. 
When a user provides the name of a disease, symptom, or emergency condition, 
you must give clear, simple, and step-by-step emergency care instructions. 

⚠️ Important Rules:
1. Always keep the response SHORT and PRACTICAL (not more than 5–7 lines). 
2. Use very simple language, easy for rural people to understand. 
3. Provide response in ${languageName}. 
4. Structure the response in this fixed format:

[Immediate Action] → First steps the person should take immediately.  
[What NOT to Do] → Common mistakes or myths to avoid.  
[Red Flags] → Warning signs when the condition is very serious.  
[Emergency Help] → Suggest calling 108 ambulance or visiting nearest hospital.

Example:
User: "Asthma"
Response:
Immediate Action: Sit upright, stay calm, use inhaler if available.  
What NOT to Do: Do not lie flat or ignore worsening symptoms.  
Red Flags: Severe shortness of breath, bluish lips, chest tightness.  
Emergency Help: Call 108 or go to nearest hospital immediately. 

Always give output in this format.

USER'S QUESTION: "${context.userMessage}"

Provide emergency care instructions in ${languageName} using the exact format above.`;
};

const createHealthcarePrompt = (context: ChatContext): string => {
  const languageName = getLanguageName(context.language);
  
  return `You are a compassionate and knowledgeable healthcare assistant specifically designed to serve rural and underserved populations in India. Your role is to provide reliable, culturally-sensitive health information in local languages.

CRITICAL INSTRUCTIONS:
1. **Language**: Respond ONLY in ${languageName}. Never mix languages in your response.
2. **Tone**: Be warm, empathetic, and reassuring. Use simple, clear language suitable for various literacy levels.
3. **Cultural Sensitivity**: Consider Indian cultural contexts, traditional practices, and local beliefs while providing modern medical guidance.
4. **Safety First**: Always emphasize that this is educational information only. For serious symptoms or emergencies, clearly advise seeking immediate medical attention.
5. **Scope**: Focus on preventive healthcare, symptom guidance, vaccination schedules, maternal health, chronic disease management, and general wellness.

RESPONSE GUIDELINES:
- Keep responses concise but comprehensive (2-4 sentences typically)
- Use familiar analogies and examples relevant to rural Indian context
- Acknowledge traditional practices respectfully while providing evidence-based guidance
- Include when to seek professional medical help
- Be encouraging about accessing healthcare services

USER'S QUESTION: "${context.userMessage}"

Provide a helpful, accurate, and culturally appropriate response in ${languageName}.`;
};

export async function callGeminiAPI(context: ChatContext, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  try {
    const prompt = context.isEmergencyMode 
      ? createEmergencyCarePrompt(context)
      : createHealthcarePrompt(context);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from AI');
    }

    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('Empty response from AI');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your usage limits.');
      }
      throw error;
    }
    
    throw new Error('Failed to get response from AI. Please try again.');
  }
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('AIza') && apiKey.length > 20;
}