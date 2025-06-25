
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const toggleLanguage = async () => {
    setIsChanging(true);
    const newLanguage = i18n.language === 'en' ? 'hi' : 'en';
    
    try {
      await i18n.changeLanguage(newLanguage);
      // Language will be persisted automatically by i18next-browser-languagedetector
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const currentLanguage = i18n.language === 'hi' ? 'hi' : 'en';
  const buttonText = currentLanguage === 'en' 
    ? t('header.languageToggle.switchToHindi')
    : t('header.languageToggle.switchToEnglish');

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={isChanging}
      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {isChanging ? (currentLanguage === 'en' ? 'Switching...' : 'बदला जा रहा है...') : buttonText}
      </span>
    </Button>
  );
};

export default LanguageToggle;
