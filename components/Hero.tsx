
import React from 'react';
import MobileParticles from './MobileParticles.tsx';

const Hero: React.FC = () => {
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#FBCACA]">
      <MobileParticles />

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10 md:gap-16 z-10 relative py-20 md:py-0">
        <div className="space-y-8 md:space-y-10 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
            </span>
            <span className="text-[#1A1A1A] font-bold tracking-[0.2em] uppercase text-[9px]">Disponible hoy</span>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-serif leading-[1] md:leading-[0.9] text-[#1A1A1A]">
              Elegancia <br />
              <span className="italic font-normal text-[#C5A059] md:ml-12">Total</span>
            </h1>
            <p className="text-[#1A1A1A]/70 text-base md:text-xl max-w-md leading-relaxed font-light">
              Descubrí el arte de la belleza avanzada. Diseños exclusivos y cuidado premium para uñas, pestañas y cejas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full">
            <a
              href="#galeria"
              onClick={(e) => scrollTo(e, 'galeria')}
              className="btn-premium-gold w-full sm:w-auto text-center px-12 py-5 rounded-full font-bold uppercase text-[10px] tracking-[0.25em] active:scale-95 transition-all"
            >
              Ver Trabajos
            </a>

            <a
              href="#servicios"
              onClick={(e) => scrollTo(e, 'servicios')}
              className="group btn-outline-gold w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-full text-[#1A1A1A] font-bold uppercase text-[10px] tracking-[0.25em] active:scale-95 transition-all"
            >
              Servicios
              <svg className="w-4 h-4 text-[#C5A059] group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="relative hidden md:block group">
          <div className="relative z-10 rounded-[40px] rounded-tr-[180px] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000&auto=format&fit=crop"
              alt="Manicura Profesional"
              className="w-full object-cover h-[550px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent"></div>
          </div>

          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl z-20 animate-float hidden lg:block border border-[#FBCACA]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FBCACA] flex items-center justify-center text-[#C5A059]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calificación</p>
                <p className="text-lg font-serif text-[#1A1A1A]">5.0 Estrellas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
