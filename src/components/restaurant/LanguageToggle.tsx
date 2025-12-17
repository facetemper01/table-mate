import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "no" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="w-8 h-6 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border"
      title={language === "en" ? "Bytt til norsk" : "Switch to English"}
    >
      {language === "en" ? (
        // Norwegian flag
        <svg viewBox="0 0 22 16" className="w-full h-full">
          <rect width="22" height="16" fill="#BA0C2F" />
          <rect x="6" width="4" height="16" fill="#FFFFFF" />
          <rect y="6" width="22" height="4" fill="#FFFFFF" />
          <rect x="7" width="2" height="16" fill="#00205B" />
          <rect y="7" width="22" height="2" fill="#00205B" />
        </svg>
      ) : (
        // UK flag
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <clipPath id="ukClip">
            <rect width="60" height="30" />
          </clipPath>
          <g clipPath="url(#ukClip)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#ukClip)" />
            <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
            <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      )}
    </button>
  );
}
