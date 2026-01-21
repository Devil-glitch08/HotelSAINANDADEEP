
import React, { useState, useEffect, useRef } from 'react';

const languages = [
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'HI', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'MR', name: 'मराठी', flag: '🇮🇳' }
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLangSelect = (lang: typeof languages[0]) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
    // Future implementation: logic to change application locale
    console.log(`Language changed to: ${lang.code}`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className={`text-xl md:text-2xl font-serif font-bold tracking-tight transition-colors ${
          isScrolled ? 'text-amber-700' : 'text-white'
        }`}>
          HOTEL SAI NANDADEEP
        </div>
        
        <div className={`hidden lg:flex space-x-8 font-medium transition-colors ${
          isScrolled ? 'text-slate-600' : 'text-white/90'
        }`}>
          <a href="/#explore" className="hover:text-amber-600 transition-colors">Explore Shirdi</a>
          <a href="/#about" className="hover:text-amber-600 transition-colors">About Us</a>
          <a href="/#rooms" className="hover:text-amber-600 transition-colors">Rooms</a>
          <a href="/#contact" className="hover:text-amber-600 transition-colors">Contact</a>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all font-bold border ${
                isScrolled 
                  ? 'text-slate-700 border-stone-200 hover:bg-stone-50' 
                  : 'text-white border-white/20 hover:bg-white/10'
              }`}
              aria-expanded={isLangOpen}
              aria-haspopup="true"
            >
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-xs tracking-widest">{selectedLang.code}</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangOpen && (
              <div className={`absolute right-0 mt-3 w-40 rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                isScrolled ? 'bg-white border-stone-100' : 'bg-slate-900/90 backdrop-blur-xl border-white/10'
              }`}>
                <div className="p-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${
                        selectedLang.code === lang.code 
                          ? (isScrolled ? 'bg-amber-50 text-amber-700' : 'bg-amber-600/20 text-amber-400')
                          : (isScrolled ? 'text-slate-600 hover:bg-stone-50' : 'text-white/70 hover:bg-white/5 hover:text-white')
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-base">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </div>
                      {selectedLang.code === lang.code && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Number */}
          <a 
            href="tel:9405562019" 
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all font-bold shadow-sm active:scale-95 ${
              isScrolled 
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200/50' 
                : 'text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/20'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            <span className="text-sm md:text-base tracking-tight hidden sm:inline">9405562019</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
