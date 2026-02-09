
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['inicio', 'servicios', 'galeria', 'turnos'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Servicios', id: 'servicios' },
    { name: 'Galería', id: 'galeria' },
    { name: 'Turnos', id: 'turnos' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[#1A1A1A]">
        <a
          href="#inicio"
          onClick={(e) => handleNavClick(e, 'inicio')}
          className="flex flex-col items-start group"
        >
          <span className="text-2xl font-serif tracking-tighter text-[#C5A059] leading-none">Bellezza</span>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold mt-1">byNaomi</span>
        </a>

        <div className="hidden md:flex gap-10 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-600">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`hover:text-[#C5A059] transition-all relative py-2 ${activeSection === link.id ? 'text-[#C5A059]' : ''}`}
            >
              {link.name}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-px bg-[#C5A059] animate-in fade-in zoom-in duration-500"></span>
              )}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Button */}
          <button
            onClick={() => {
              const el = document.getElementById('turnos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden md:block btn-nav-minimal px-8 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] active:scale-95 transition-all"
          >
            Reservar Cita
          </button>

          {/* Mobile Elegant Button */}
          <button
            onClick={() => {
              const el = document.getElementById('turnos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="md:hidden btn-premium-gold px-6 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] active:scale-95 transition-all shadow-md shadow-[#C5A059]/10"
          >
            Agendar Cita
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
