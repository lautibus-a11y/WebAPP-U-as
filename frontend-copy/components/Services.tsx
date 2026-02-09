
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase.ts';
import { Service } from '../types.ts';
import { SERVICES as FALLBACK_SERVICES } from '../constants.ts';

const CATEGORIES = ['Todos', 'Manicuria', 'Podoestética', 'Cejas y Pestañas'];

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('servicios')
          .select('*')
          .order('id', { ascending: true });
          
        if (supabaseError) throw supabaseError;
        
        if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(FALLBACK_SERVICES);
        }
      } catch (err: any) {
        console.warn("Base de datos no disponible, usando catálogo local:", err.message);
        setDbError(err.message);
        setServices(FALLBACK_SERVICES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Ocultar el indicador cuando el usuario scrollea las categorías
  const handleCategoryScroll = () => {
    if (scrollContainerRef.current) {
      if (scrollContainerRef.current.scrollLeft > 20) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    }
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServices = useMemo(() => {
    let result = services;
    if (selectedCategory !== 'Todos') {
      result = result.filter(s => s.categoria === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.nombre.toLowerCase().includes(term) || 
        (s.descripcion && s.descripcion.toLowerCase().includes(term))
      );
    }
    return result;
  }, [searchTerm, selectedCategory, services]);

  const displayedServices = useMemo(() => {
    if (isExpanded || searchTerm.trim()) {
      return filteredServices;
    }
    return filteredServices.slice(0, 4);
  }, [filteredServices, isExpanded, searchTerm]);

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return services.filter(s => 
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, services]);

  const handleSelectService = (serviceId: string | number) => {
    setSearchTerm('');
    setShowSuggestions(false);
    setIsExpanded(true);
    setTimeout(() => {
      const element = document.getElementById(`service-${serviceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-[#C5A059]/30', 'scale-[1.02]');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-[#C5A059]/30', 'scale-[1.02]');
        }, 2000);
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="py-32 bg-white flex justify-center">
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section id="servicios" className="py-24 md:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <div className="text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-4">Servicios de calidad</div>
            <h2 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] leading-tight">Todos mis servicios</h2>
          </div>
          <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0 font-light italic">
            Descubrí el arte de la belleza avanzada para manos, pies y mirada en un solo lugar.
          </p>
        </div>

        <div className="space-y-6 md:space-y-10 mb-16 md:mb-20">
          <div className="relative z-30 max-w-xl mx-auto md:mx-0" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscá tu tratamiento favorito..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-14 pr-6 py-4 md:py-5 bg-[#FFF9F9] border-2 border-transparent focus:border-[#C5A059]/20 focus:bg-white rounded-[20px] md:rounded-[25px] outline-none transition-all duration-300 text-sm font-medium shadow-sm"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectService(s.id)}
                    className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#FBCACA]/10 transition-colors group border-b border-gray-50 last:border-0"
                  >
                    <img src={s.imagen_url} alt={s.nombre} className="w-10 h-10 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#C5A059]">{s.nombre}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">{s.categoria}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categoría Selector con Indicador de Slide */}
          <div className="relative -mx-6 md:mx-0 group/categories">
            <div 
              ref={scrollContainerRef}
              onScroll={handleCategoryScroll}
              className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 px-6 md:px-0 pb-4 md:pb-0 scroll-smooth touch-pan-x"
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-6 md:px-8 py-3 md:py-3.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] transition-all duration-500 border whitespace-nowrap ${
                    selectedCategory === cat 
                    ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20 translate-y-[-2px]' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-[#FBCACA] hover:text-[#1A1A1A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Indicador de "Deslizar para más" (Flecha) */}
            <div className={`md:hidden absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none flex items-center justify-end pr-4 transition-opacity duration-500 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-8 h-8 bg-white border border-[#FBCACA] rounded-full flex items-center justify-center text-[#C5A059] shadow-sm animate-bounce-x">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="py-20 text-center animate-in fade-in duration-500">
            <p className="text-gray-400 font-serif italic text-xl">No hay servicios en esta categoría todavía.</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
              {displayedServices.map((service) => (
                <div 
                  key={service.id} 
                  id={`service-${service.id}`}
                  className="group relative bg-white rounded-[30px] md:rounded-[35px] p-3 border border-gray-100 hover:border-[#FBCACA] hover:shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:rounded-[28px] mb-5 md:mb-6">
                    <img 
                      src={service.imagen_url} 
                      alt={service.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-[#C5A059] font-bold text-[8px] uppercase tracking-widest">{service.duracion}</span>
                    </div>
                  </div>
                  
                  <div className="px-4 md:px-5 pb-5 md:pb-6">
                    <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#C5A059] mb-2">{service.categoria}</div>
                    <h3 className="font-serif text-xl md:text-2xl text-[#1A1A1A] mb-2 md:mb-3 group-hover:text-[#C5A059] transition-colors">{service.nombre}</h3>
                    <p className="text-gray-500 text-[11px] md:text-xs leading-relaxed line-clamp-2 mb-6 min-h-[32px]">
                      {service.descripcion}
                    </p>
                    <button 
                      onClick={() => document.getElementById('turnos')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-4 rounded-2xl bg-[#FFF9F9] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-widest border border-transparent group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500"
                    >
                      Agendar Turno
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!searchTerm.trim() && filteredServices.length > 4 && (
              <div className="flex justify-center">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="group flex flex-col items-center gap-3 py-4 transition-all"
                >
                  <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">
                    {isExpanded ? 'Ver Menos' : 'Ver Todos los Servicios'}
                  </span>
                  <div className={`w-10 h-10 rounded-full border border-[#FBCACA] flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-white transition-all duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Services;
