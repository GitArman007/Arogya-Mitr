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

export interface Medicine {
  id: string;
  name: string;
  nameHindi: string;
  dosage: string;
  dosageHindi: string;
  whenToTake: string;
  whenToTakeHindi: string;
  category: string;
}

export interface MedicineData {
  medicines: Medicine[];
}

export interface DiseasesData {
  diseases: Disease[];
}

class OfflineDataService {
  private diseases: Disease[] = diseasesData.diseases;
  
  // Offline medicine data for common ailments
  private medicines: Medicine[] = [
    // Cough & Cold
    { id: 'cough-1', name: 'Cough Syrup (Dextromethorphan)', nameHindi: 'खांसी की सिरप (डेक्सट्रोमेथोरफान)', dosage: '5-10ml every 4-6 hours', dosageHindi: 'हर 4-6 घंटे में 5-10ml', whenToTake: 'After meals', whenToTakeHindi: 'भोजन के बाद', category: 'cough' },
    { id: 'cough-2', name: 'Honey & Lemon', nameHindi: 'शहद और नींबू', dosage: '1-2 teaspoons', dosageHindi: '1-2 चम्मच', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'cough' },
    
    // Headache
    { id: 'headache-1', name: 'Paracetamol', nameHindi: 'पैरासिटामोल', dosage: '500mg every 6-8 hours', dosageHindi: 'हर 6-8 घंटे में 500mg', whenToTake: 'With or after food', whenToTakeHindi: 'भोजन के साथ या बाद', category: 'headache' },
    { id: 'headache-2', name: 'Ibuprofen', nameHindi: 'आइबुप्रोफेन', dosage: '200-400mg every 6-8 hours', dosageHindi: 'हर 6-8 घंटे में 200-400mg', whenToTake: 'With food', whenToTakeHindi: 'भोजन के साथ', category: 'headache' },
    
    // Body Pain
    { id: 'bodypain-1', name: 'Paracetamol', nameHindi: 'पैरासिटामोल', dosage: '500mg every 6-8 hours', dosageHindi: 'हर 6-8 घंटे में 500mg', whenToTake: 'With food', whenToTakeHindi: 'भोजन के साथ', category: 'bodypain' },
    { id: 'bodypain-2', name: 'Ibuprofen Gel', nameHindi: 'आइबुप्रोफेन जेल', dosage: 'Apply 3-4 times daily', dosageHindi: 'दिन में 3-4 बार लगाएं', whenToTake: 'On affected area', whenToTakeHindi: 'प्रभावित जगह पर', category: 'bodypain' },
    
    // Stomach Pain
    { id: 'stomach-1', name: 'Antacid (Calcium Carbonate)', nameHindi: 'एंटासिड (कैल्शियम कार्बोनेट)', dosage: '1-2 tablets as needed', dosageHindi: 'जरूरत के अनुसार 1-2 गोली', whenToTake: 'After meals', whenToTakeHindi: 'भोजन के बाद', category: 'stomach' },
    { id: 'stomach-2', name: 'Peppermint Tea', nameHindi: 'पुदीना की चाय', dosage: '1 cup', dosageHindi: '1 कप', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'stomach' },
    
    // Indigestion
    { id: 'indigestion-1', name: 'Digestive Enzymes', nameHindi: 'पाचन एंजाइम', dosage: '1-2 tablets with meals', dosageHindi: 'भोजन के साथ 1-2 गोली', whenToTake: 'With meals', whenToTakeHindi: 'भोजन के साथ', category: 'indigestion' },
    { id: 'indigestion-2', name: 'Ginger Tea', nameHindi: 'अदरक की चाय', dosage: '1 cup', dosageHindi: '1 कप', whenToTake: 'After meals', whenToTakeHindi: 'भोजन के बाद', category: 'indigestion' },
    
    // Fever (Mild)
    { id: 'fever-1', name: 'Paracetamol', nameHindi: 'पैरासिटामोल', dosage: '500mg every 6-8 hours', dosageHindi: 'हर 6-8 घंटे में 500mg', whenToTake: 'With food', whenToTakeHindi: 'भोजन के साथ', category: 'fever' },
    { id: 'fever-2', name: 'Cool Compress', nameHindi: 'ठंडा सेक', dosage: 'Apply for 10-15 minutes', dosageHindi: '10-15 मिनट तक लगाएं', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'fever' },
    
    // Sore Throat
    { id: 'throat-1', name: 'Throat Lozenges', nameHindi: 'गले की गोली', dosage: '1 lozenge every 2-3 hours', dosageHindi: 'हर 2-3 घंटे में 1 गोली', whenToTake: 'Dissolve slowly', whenToTakeHindi: 'धीरे-धीरे घुलने दें', category: 'throat' },
    { id: 'throat-2', name: 'Salt Water Gargle', nameHindi: 'नमक के पानी से गरारे', dosage: '3-4 times daily', dosageHindi: 'दिन में 3-4 बार', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'throat' },
    
    // Constipation
    { id: 'constipation-1', name: 'Psyllium Husk', nameHindi: 'इसबगोल', dosage: '1-2 teaspoons with water', dosageHindi: 'पानी के साथ 1-2 चम्मच', whenToTake: 'Before bedtime', whenToTakeHindi: 'सोने से पहले', category: 'constipation' },
    { id: 'constipation-2', name: 'Prune Juice', nameHindi: 'सूखे आलूबुखारे का जूस', dosage: '1 glass', dosageHindi: '1 गिलास', whenToTake: 'Morning', whenToTakeHindi: 'सुबह', category: 'constipation' },
    
    // Diarrhea (Mild)
    { id: 'diarrhea-1', name: 'ORS (Oral Rehydration Solution)', nameHindi: 'ओआरएस (मौखिक पुनर्जलीकरण घोल)', dosage: 'As directed on packet', dosageHindi: 'पैकेट पर दिए निर्देशानुसार', whenToTake: 'Throughout the day', whenToTakeHindi: 'पूरे दिन', category: 'diarrhea' },
    { id: 'diarrhea-2', name: 'Banana & Rice', nameHindi: 'केला और चावल', dosage: 'Small portions', dosageHindi: 'छोटे हिस्से', whenToTake: 'As tolerated', whenToTakeHindi: 'सहन करने योग्य', category: 'diarrhea' },
    
    // Nausea
    { id: 'nausea-1', name: 'Ginger Capsules', nameHindi: 'अदरक की गोली', dosage: '1-2 capsules', dosageHindi: '1-2 गोली', whenToTake: 'Before meals', whenToTakeHindi: 'भोजन से पहले', category: 'nausea' },
    { id: 'nausea-2', name: 'Peppermint Oil', nameHindi: 'पुदीना का तेल', dosage: 'Inhale gently', dosageHindi: 'धीरे से सूंघें', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'nausea' },
    
    // Muscle Pain
    { id: 'muscle-1', name: 'Ibuprofen Gel', nameHindi: 'आइबुप्रोफेन जेल', dosage: 'Apply 3-4 times daily', dosageHindi: 'दिन में 3-4 बार लगाएं', whenToTake: 'On affected area', whenToTakeHindi: 'प्रभावित जगह पर', category: 'muscle' },
    { id: 'muscle-2', name: 'Hot/Cold Compress', nameHindi: 'गर्म/ठंडा सेक', dosage: '15-20 minutes', dosageHindi: '15-20 मिनट', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'muscle' },
    
    // Joint Pain
    { id: 'joint-1', name: 'Glucosamine', nameHindi: 'ग्लूकोसामाइन', dosage: 'As directed', dosageHindi: 'निर्देशानुसार', whenToTake: 'With meals', whenToTakeHindi: 'भोजन के साथ', category: 'joint' },
    { id: 'joint-2', name: 'Turmeric Milk', nameHindi: 'हल्दी वाला दूध', dosage: '1 cup', dosageHindi: '1 कप', whenToTake: 'Before bedtime', whenToTakeHindi: 'सोने से पहले', category: 'joint' },
    
    // Skin Irritation
    { id: 'skin-1', name: 'Calamine Lotion', nameHindi: 'कैलामाइन लोशन', dosage: 'Apply as needed', dosageHindi: 'जरूरत के अनुसार लगाएं', whenToTake: 'On affected area', whenToTakeHindi: 'प्रभावित जगह पर', category: 'skin' },
    { id: 'skin-2', name: 'Aloe Vera Gel', nameHindi: 'एलोवेरा जेल', dosage: 'Apply 2-3 times daily', dosageHindi: 'दिन में 2-3 बार लगाएं', whenToTake: 'On affected area', whenToTakeHindi: 'प्रभावित जगह पर', category: 'skin' },
    
    // Sleep Issues
    { id: 'sleep-1', name: 'Melatonin', nameHindi: 'मेलाटोनिन', dosage: '3-5mg', dosageHindi: '3-5mg', whenToTake: '30 minutes before bed', whenToTakeHindi: 'सोने से 30 मिनट पहले', category: 'sleep' },
    { id: 'sleep-2', name: 'Chamomile Tea', nameHindi: 'कैमोमाइल चाय', dosage: '1 cup', dosageHindi: '1 कप', whenToTake: 'Before bedtime', whenToTakeHindi: 'सोने से पहले', category: 'sleep' },
    
    // Stress (Mild)
    { id: 'stress-1', name: 'Deep Breathing', nameHindi: 'गहरी सांस लेना', dosage: '5-10 minutes', dosageHindi: '5-10 मिनट', whenToTake: 'As needed', whenToTakeHindi: 'जरूरत के अनुसार', category: 'stress' },
    { id: 'stress-2', name: 'Meditation', nameHindi: 'ध्यान', dosage: '10-15 minutes', dosageHindi: '10-15 मिनट', whenToTake: 'Daily', whenToTakeHindi: 'रोजाना', category: 'stress' }
  ];

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

  // Medicine-related methods
  searchMedicines(query: string, language: string = 'en'): Medicine[] {
    const lowerQuery = query.toLowerCase();
    
    return this.medicines.filter(medicine => {
      const nameMatch = language === 'hi' 
        ? medicine.nameHindi.toLowerCase().includes(lowerQuery)
        : medicine.name.toLowerCase().includes(lowerQuery);
      
      const categoryMatch = medicine.category.toLowerCase().includes(lowerQuery);
      
      return nameMatch || categoryMatch;
    });
  }

  getMedicinesByCategory(category: string): Medicine[] {
    return this.medicines.filter(medicine => medicine.category === category);
  }

  getAllMedicines(): Medicine[] {
    return this.medicines;
  }

  // Generate medicine suggestions response
  generateMedicineResponse(diseaseName: string, language: string = 'en'): string {
    const lowerDiseaseName = diseaseName.toLowerCase();
    
    // Map disease names to categories
    const diseaseCategoryMap: Record<string, string> = {
      'cough': 'cough',
      'cold': 'cough',
      'खांसी': 'cough',
      'सर्दी': 'cough',
      
      'headache': 'headache',
      'सिरदर्द': 'headache',
      
      'body pain': 'bodypain',
      'body ache': 'bodypain',
      'बदन दर्द': 'bodypain',
      
      'stomach pain': 'stomach',
      'पेट दर्द': 'stomach',
      
      'indigestion': 'indigestion',
      'अपच': 'indigestion',
      
      'fever': 'fever',
      'बुखार': 'fever',
      
      'sore throat': 'throat',
      'गले में खराश': 'throat',
      
      'constipation': 'constipation',
      'कब्ज': 'constipation',
      
      'diarrhea': 'diarrhea',
      'दस्त': 'diarrhea',
      
      'nausea': 'nausea',
      'जी मिचलाना': 'nausea',
      
      'muscle pain': 'muscle',
      'मांसपेशियों में दर्द': 'muscle',
      
      'joint pain': 'joint',
      'जोड़ों का दर्द': 'joint',
      
      'skin irritation': 'skin',
      'त्वचा में जलन': 'skin',
      
      'sleep issues': 'sleep',
      'नींद न आना': 'sleep',
      
      'stress': 'stress',
      'तनाव': 'stress'
    };

    const category = diseaseCategoryMap[lowerDiseaseName];
    if (!category) {
      return language === 'hi' 
        ? 'क्षमा करें, इस बीमारी के लिए दवा सुझाव उपलब्ध नहीं है। कृपया सामान्य बीमारियों के नाम का उपयोग करें।'
        : 'Sorry, medicine suggestions are not available for this condition. Please use common ailment names.';
    }

    const medicines = this.getMedicinesByCategory(category);
    
    if (medicines.length === 0) {
      return language === 'hi' 
        ? 'इस बीमारी के लिए दवा सुझाव उपलब्ध नहीं है।'
        : 'No medicine suggestions available for this condition.';
    }

    if (language === 'hi') {
      return `**सुझाई गई दवाएं:**
${medicines.map(medicine => `• ${medicine.nameHindi} - ${medicine.dosageHindi} - ${medicine.whenToTakeHindi}`).join('\n')}

**महत्वपूर्ण नोट:**
• ये केवल अस्थायी राहत के लिए हैं
• लक्षण 3 दिन से अधिक बने रहें तो डॉक्टर से सलाह लें
• दवा लेने से पहले लेबल पढ़ें
• अनुशंसित मात्रा से अधिक न लें

**डॉक्टर से कब मिलें:**
• लक्षण बिगड़ने या बने रहने पर
• किसी दवा से एलर्जी हो तो
• 12 साल से कम उम्र के बच्चों के लिए
• गर्भावस्था या स्तनपान के दौरान`;
    }

    return `**Suggested Medicines:**
${medicines.map(medicine => `• ${medicine.name} - ${medicine.dosage} - ${medicine.whenToTake}`).join('\n')}

**Important Notes:**
• These are for temporary relief only
• Consult a doctor if symptoms persist for more than 3 days
• Read medicine labels carefully before use
• Do not exceed recommended dosage

**When to See a Doctor:**
• If symptoms worsen or persist
• If you have allergies to any medicines
• For children under 12 years
• During pregnancy or breastfeeding`;
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

