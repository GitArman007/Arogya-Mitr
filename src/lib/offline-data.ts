import diseasesData from '@/data/diseases.json';

export interface Disease {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  symptoms: string[];
  symptomsHindi: string[];
  prevention: string[];
  preventionHindi: string[];
  treatment: string[];
  treatmentHindi: string[];
  emergency: {
    immediateAction: string;
    immediateActionHindi: string;
    whatNotToDo: string;
    whatNotToDoHindi: string;
    redFlags: string;
    redFlagsHindi: string;
    emergencyHelp: string;
    emergencyHelpHindi: string;
  };
}

export interface DiseasesData {
  diseases: Disease[];
}

class OfflineDataService {
  private diseases: Disease[] = diseasesData.diseases;

  // Check if we're online
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Search for diseases by name or symptoms
  searchDiseases(query: string, language: string = 'en'): Disease[] {
    const lowerQuery = query.toLowerCase();
    
    return this.diseases.filter(disease => {
      const nameMatch = language === 'hi' 
        ? disease.nameHindi.toLowerCase().includes(lowerQuery)
        : disease.name.toLowerCase().includes(lowerQuery);
      
      const symptomsMatch = language === 'hi'
        ? disease.symptomsHindi.some(symptom => symptom.toLowerCase().includes(lowerQuery))
        : disease.symptoms.some(symptom => symptom.toLowerCase().includes(lowerQuery));
      
      return nameMatch || symptomsMatch;
    });
  }

  // Get disease by ID
  getDiseaseById(id: string): Disease | undefined {
    return this.diseases.find(disease => disease.id === id);
  }

  // Get disease by name
  getDiseaseByName(name: string, language: string = 'en'): Disease | undefined {
    return this.diseases.find(disease => {
      if (language === 'hi') {
        return disease.nameHindi.toLowerCase() === name.toLowerCase();
      }
      return disease.name.toLowerCase() === name.toLowerCase();
    });
  }

  // Get all diseases
  getAllDiseases(): Disease[] {
    return this.diseases;
  }

  // Get diseases by category
  getDiseasesByCategory(category: string): Disease[] {
    return this.diseases.filter(disease => disease.category === category);
  }

  // Generate emergency response in the required format
  generateEmergencyResponse(disease: Disease, language: string = 'en'): string {
    const emergency = disease.emergency;
    
    if (language === 'hi') {
      return `[Immediate Action] → ${emergency.immediateActionHindi}\n[What NOT to Do] → ${emergency.whatNotToDoHindi}\n[Red Flags] → ${emergency.redFlagsHindi}\n[Emergency Help] → ${emergency.emergencyHelpHindi}`;
    }
    
    return `[Immediate Action] → ${emergency.immediateAction}\n[What NOT to Do] → ${emergency.whatNotToDo}\n[Red Flags] → ${emergency.redFlags}\n[Emergency Help] → ${emergency.emergencyHelp}`;
  }

  // Generate general disease information response
  generateDiseaseInfoResponse(disease: Disease, language: string = 'en'): string {
    if (language === 'hi') {
      return `${disease.nameHindi} के बारे में जानकारी:

लक्षण:
${disease.symptomsHindi.map(symptom => `• ${symptom}`).join('\n')}

बचाव:
${disease.preventionHindi.map(prevention => `• ${prevention}`).join('\n')}

उपचार:
${disease.treatmentHindi.map(treatment => `• ${treatment}`).join('\n')}

यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। गंभीर लक्षणों के लिए तुरंत चिकित्सकीय सहायता लें।`;
    }

    return `Information about ${disease.name}:

Symptoms:
${disease.symptoms.map(symptom => `• ${symptom}`).join('\n')}

Prevention:
${disease.prevention.map(prevention => `• ${prevention}`).join('\n')}

Treatment:
${disease.treatment.map(treatment => `• ${treatment}`).join('\n')}

This information is for educational purposes only. Seek immediate medical attention for serious symptoms.`;
  }

  // Process user query and return appropriate response
  processOfflineQuery(query: string, language: string = 'en', isEmergencyMode: boolean = false): string {
    const lowerQuery = query.toLowerCase();
    
    // Emergency keywords detection
    const emergencyKeywords = [
      'emergency', 'urgent', 'critical', 'heart attack', 'stroke', 'bleeding',
      'unconscious', 'seizure', 'choking', 'poison', 'burn', 'fracture',
      'breathing', 'chest pain', 'severe', 'acute', 'trauma', 'accident',
      'अत्यावश्यक', 'आपातकाल', 'दिल का दौरा', 'स्ट्रोक', 'खून बहना',
      'बेहोशी', 'दौरा', 'दम घुटना', 'जहर', 'जलना', 'फ्रैक्चर',
      'सांस लेने में', 'छाती में दर्द', 'गंभीर', 'तीव्र', 'चोट', 'दुर्घटना'
    ];

    const isEmergencyQuery = emergencyKeywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()));

    // Search for matching diseases
    const matchingDiseases = this.searchDiseases(query, language);

    if (matchingDiseases.length === 0) {
      return language === 'hi' 
        ? 'क्षमा करें, मैं इस बीमारी के बारे में जानकारी नहीं ढूंढ सका। कृपया विशिष्ट बीमारी का नाम या लक्षण बताएं।'
        : 'Sorry, I could not find information about this disease. Please provide the specific disease name or symptoms.';
    }

    const disease = matchingDiseases[0];

    // Return emergency response if in emergency mode or emergency query detected
    if (isEmergencyMode || isEmergencyQuery) {
      return this.generateEmergencyResponse(disease, language);
    }

    // Return general information
    return this.generateDiseaseInfoResponse(disease, language);
  }
}

export const offlineDataService = new OfflineDataService();

