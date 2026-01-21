
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Dynamic Background Gradients instead of Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-stone-900"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="text-amber-400 uppercase tracking-[0.4em] text-sm font-bold mb-2 block drop-shadow-md">
            Sabka Malik Ek • Om Sai Ram
          </span>
          <div className="flex flex-col space-y-1">
            <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-black block">
              Owned & Managed by Gondkar Brothers
            </span>
            <span className="text-amber-500/60 uppercase tracking-[0.3em] text-[9px] font-black block">
              Providing Services Since 2012
            </span>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif mb-8 leading-tight drop-shadow-lg">
          Divine Peace <br /> & Pure Comfort
        </h1>
        <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
          Experience the blissful proximity of Dwarkamai at Hotel Sai Nandadeep. A sanctuary for devotees seeking a clean, humble, and spiritual stay in Shirdi.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="tel:9405562019"
            className="w-full sm:w-auto px-10 py-4 bg-amber-600 text-white rounded-full font-bold text-lg hover:bg-amber-700 transition-all shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            Call Now
          </a>
          <a 
            href="https://wa.me/919405562019"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-500/30 transform hover:-translate-y-1 flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.123.554 4.197 1.607 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.05-5.414 12.053-12.051a11.78 11.78 0 00-3.391-8.526z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
