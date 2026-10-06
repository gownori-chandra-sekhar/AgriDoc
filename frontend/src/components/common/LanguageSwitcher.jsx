import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
];

export default function LanguageSwitcher({ variant = 'select', className = '' }) {
  const { i18n } = useTranslation();

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('agridoc_language', langCode);
  };

  const currentLang = i18n.language || 'en';

  if (variant === 'pills') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${className}`}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900">{lang.native}</div>
                  <div className="text-[10px] text-slate-500">{lang.label}</div>
                </div>
              </div>
              {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Default dropdown select
  return (
    <div className={`relative flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-3 py-2 text-slate-800 hover:border-emerald-400 transition-colors shadow-sm ${className}`}>
      <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        aria-label="Select Interface Language"
        className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-slate-900 py-1">
            {lang.flag} {lang.native} ({lang.label})
          </option>
        ))}
      </select>
    </div>
  );
}
