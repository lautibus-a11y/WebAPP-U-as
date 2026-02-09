
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase.ts';
import { GalleryItem } from '../types.ts';
import { GALLERY as FALLBACK_GALLERY } from '../constants.ts';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeftStart] = useState(0);
  const autoScrollRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(FALLBACK_GALLERY);
        }
      } catch (err: any) {
        setItems(FALLBACK_GALLERY);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Triplicamos para permitir scroll infinito en ambas direcciones
  const marqueeItems = useMemo(() => [...items, ...items, ...items], [items]);

  // Manejador de Scroll para el efecto "Loop Infinito"
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;

    const singleSetWidth = container.scrollWidth / 3;

    // Si llegamos al final del tercer set, saltamos al inicio del segundo
    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft = singleSetWidth;
    } 
    // Si llegamos al inicio del primer set, saltamos al inicio del tercero
    else if (container.scrollLeft <= 0) {
      container.scrollLeft = singleSetWidth;
    }
  };

  // Auto-scroll suave que se pausa al interactuar
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;

    const startAutoScroll = () => {
      if (autoScrollRef.current) return;
      const step = () => {
        if (!isInteracting && !isDragging && container) {
          container.scrollLeft += 0.8; // Velocidad lenta y elegante
        }
        autoScrollRef.current = requestAnimationFrame(step);
      };
      autoScrollRef.current = requestAnimationFrame(step);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };

    startAutoScroll();
    
    // Posicionamiento inicial en el set central
    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    return () => stopAutoScroll();
  }, [items, isInteracting, isDragging]);

  // Handlers para Drag con Mouse (Escritorio)
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsInteracting(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftStart(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Velocidad de arrastre
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsDragging(false);
    setTimeout(() => setIsInteracting(false), 2000); // Reanuda auto-scroll tras 2s
  };

  if (items.length === 0 && !loading) return null;

  return (
    <section id="galeria" className="py-32 bg-[#FFF9F9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <div className="text-[#C5A059] font-bold tracking-[0.4em] uppercase text-[10px] mb-4">Inspiración Diaria</div>
        <h2 className="text-5xl font-serif text-[#1A1A1A] mb-6">Mis Trabajos</h2>
        <div className="w-12 h-px bg-[#C5A059] mx-auto mb-6"></div>
        <p className="text-gray-400 text-sm max-w-sm mx-auto font-light leading-relaxed">
          Deslizá libremente hacia cualquier lado para explorar nuestra colección artística.
        </p>
      </div>
      
      {/* Contenedor Híbrido: Auto-scroll + Drag + Touch */}
      <div className="relative w-full group">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2000)}
          className="flex overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing py-6 select-none"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: isDragging ? 'auto' : 'smooth'
          }}
        >
          {marqueeItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="relative w-[280px] md:w-[480px] aspect-[4/5] flex-shrink-0 px-3 md:px-5"
            >
              <div className="w-full h-full overflow-hidden rounded-[40px] md:rounded-[70px] bg-white border border-gray-100 shadow-sm transition-transform duration-500 group-hover:scale-[0.98] pointer-events-none">
                <img 
                  src={item.image_url} 
                  alt={`Trabajo ${item.category}`} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="inline-block bg-white/95 backdrop-blur-sm px-6 py-2.5 rounded-full shadow-xl">
                    <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.35em]">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Máscaras de degradado premium */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-64 bg-gradient-to-r from-[#FFF9F9] via-[#FFF9F9]/40 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 md:w-64 bg-gradient-to-l from-[#FFF9F9] via-[#FFF9F9]/40 to-transparent pointer-events-none z-10"></div>
      </div>
      
      <div className="mt-24 text-center px-6">
        <a 
          href="https://www.instagram.com/bellezzabynaomi/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="instagram-btn group relative inline-flex items-center gap-6 px-14 py-6 rounded-[60px] text-[11px] font-bold text-[#1A1A1A] uppercase tracking-[0.4em] border border-[#FBCACA] bg-white hover:bg-[#C5A059] hover:text-white transition-all duration-700 active:scale-95 shadow-2xl"
        >
          <span className="relative flex items-center gap-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Inspirate en Instagram
          </span>
        </a>
      </div>
    </section>
  );
};

export default Gallery;
