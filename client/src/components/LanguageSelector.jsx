import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language || 'hi';

  const handleChange = async (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem('kaushal_lang', newLang);

    if (user) {
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/auth/language', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ language: newLang })
        });
      } catch (error) {
        console.error('Failed to update language on server', error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-primary/20 dark:border-slate-700 text-sm font-medium transition-colors hover:bg-primary/5 dark:hover:bg-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
      <Globe className="w-4 h-4 text-primary dark:text-accent opacity-80" />
      <select
        value={currentLang}
        onChange={handleChange}
        className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer appearance-none p-0 pr-4 m-0 font-sans font-medium h-auto min-h-0"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-sans">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
