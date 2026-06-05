import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('language', nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium text-gray-700"
    >
      <Languages size={18} />
      {i18n.language === 'en' ? 'हिन्दी' : 'English'}
    </button>
  );
};

export default LanguageToggle;
