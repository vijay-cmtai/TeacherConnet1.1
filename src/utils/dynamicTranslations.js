
// Helper function to handle dynamic content translations
export const translateDynamicContent = (t, key, content, fallback = content) => {
  // First try to get translation using the content as key
  const translated = t(`dynamic.${key}.${content}`, { defaultValue: null });
  
  // If no translation found, return the original content or fallback
  return translated || fallback || content;
};

// Job title translations mapping
export const jobTitleTranslations = {
  en: {
    "TGT Geography": "TGT Geography",
    "PGT Physics": "PGT Physics", 
    "Primary School Teacher": "Primary School Teacher",
    "PGT Chemistry": "PGT Chemistry",
    "Software Engineer": "Software Engineer",
    "Mathematics Teacher": "Mathematics Teacher"
  },
  hi: {
    "TGT Geography": "TGT भूगोल",
    "PGT Physics": "PGT भौतिकी",
    "Primary School Teacher": "प्राथमिक विद्यालय शिक्षक", 
    "PGT Chemistry": "PGT रसायन विज्ञान",
    "Software Engineer": "सॉफ्टवेयर इंजीनियर",
    "Mathematics Teacher": "गणित शिक्षक"
  }
};

// School name translations mapping
export const schoolTranslations = {
  en: {
    "City Children's Academy": "City Children's Academy",
    "Delhi Public School": "Delhi Public School",
    "St. Mary's Convent School": "St. Mary's Convent School"
  },
  hi: {
    "City Children's Academy": "सिटी चिल्ड्रन्स एकेडमी",
    "Delhi Public School": "दिल्ली पब्लिक स्कूल", 
    "St. Mary's Convent School": "सेंट मैरी कान्वेंट स्कूल"
  }
};

// Generic function to translate any dynamic content
export const getDynamicTranslation = (i18n, content, translationMap) => {
  const currentLanguage = i18n.language === 'hi' ? 'hi' : 'en';
  return translationMap[currentLanguage]?.[content] || content;
};
