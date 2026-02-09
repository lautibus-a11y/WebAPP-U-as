
import React from 'react';

const Footer: React.FC = () => {
  const scrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const goToAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = 'admin';
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="space-y-4 md:col-span-1">
          <div className="flex flex-col items-start group">
            <span className="text-3xl font-serif tracking-tighter text-[#C5A059] leading-none">Bellezza</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold mt-1">byNaomi</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs mt-6">
            Tu santuario de belleza para manos y pies en el corazón de Palermo. El arte de cuidar tus manos con elegancia.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navegación</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#inicio" onClick={(e) => scrollTo(e, 'inicio')} className="hover:text-[#C5A059] transition-colors">Inicio</a></li>
            <li><a href="#servicios" onClick={(e) => scrollTo(e, 'servicios')} className="hover:text-[#C5A059] transition-colors">Servicios</a></li>
            <li><a href="#galeria" onClick={(e) => scrollTo(e, 'galeria')} className="hover:text-[#C5A059] transition-colors">Galería</a></li>
            <li><a href="#turnos" onClick={(e) => scrollTo(e, 'turnos')} className="hover:text-[#C5A059] transition-colors">Reservar</a></li>
            <li className="pt-2 border-t border-gray-800">
              <a 
                href="#admin" 
                onClick={goToAdmin}
                className="hover:text-[#C5A059] transition-colors flex items-center gap-2 text-gray-500 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:text-[#C5A059] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Acceso Administrativo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              +54 9 11 6154-6312
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C5A059]" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
              Palermo, Buenos Aires
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Horarios</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex justify-between"><span>Lunes - Viernes:</span> <span>09:00 - 20:00</span></li>
            <li className="flex justify-between"><span>Sábados:</span> <span>10:00 - 18:00</span></li>
            <li className="flex justify-between text-[#C5A059]"><span>Domingos:</span> <span>Cerrado</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-[10px] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="uppercase tracking-[0.1em] font-medium text-gray-500">
          Copyright © 2025 Bellezza byNaomi. Diseñado y desarrollado por <span className="text-white font-bold">BroadcastWeb</span>
        </p>
        <div className="flex gap-6">
          <a href="#admin" onClick={goToAdmin} className="text-gray-600 hover:text-[#C5A059] transition-colors">Gestión del Sitio</a>
          <span className="text-gray-800">|</span>
          <span className="text-gray-600 italic font-serif">Luxury Nail Experience</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
