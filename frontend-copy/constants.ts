
import { Service, GalleryItem } from './types';

export const BUSINESS_NAME = 'Bellezza byNaomi';
export const BUSINESS_PHONE = '541161546312';

export const SERVICES: Service[] = [
  // Manicuria
  { id: 'm1', nombre: 'Uñas Esculpidas', descripcion: 'Arquitectura y extensión artesanal para manos que buscan perfección.', duracion: '2h', categoria: 'Manicuria', imagen_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800' },
  { id: 'm2', nombre: 'Soft Gel', descripcion: 'Sistema de tips de gel para una extensión liviana y natural.', duracion: '2h', categoria: 'Manicuria', imagen_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800' },
  { id: 'm3', nombre: 'Capping', descripcion: 'Escudo protector de gel sobre tu uña natural para fortalecer.', duracion: '1h 30min', categoria: 'Manicuria', imagen_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800' },
  { id: 'm4', nombre: 'Semi Permanente', descripcion: 'Color impecable y brillo espejo con secado inmediato.', duracion: '1h', categoria: 'Manicuria', imagen_url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800' },
  { id: 'm5', nombre: 'Nivelación de Uñas', descripcion: 'Alineación de la placa ungueal para un acabado perfecto.', duracion: '1h 30min', categoria: 'Manicuria', imagen_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800' },
  // Podoestética
  { id: 'p1', nombre: 'Spa de Pies', descripcion: 'Ritual de hidratación profunda y relax absoluto.', duracion: '30min', categoria: 'Podoestética', imagen_url: 'https://images.unsplash.com/photo-1519415510236-855906a2b558?q=80&w=800' },
  { id: 'p2', nombre: 'Podoestética', descripcion: 'Tratamiento integral de salud y estética podal.', duracion: '1h', categoria: 'Podoestética', imagen_url: 'https://images.unsplash.com/photo-1516238840914-94dfc0c873ae?q=80&w=800' },
  { id: 'p3', nombre: 'Reconstrucción de Uñas de Pies', descripcion: 'Restauración avanzada para uñas dañadas.', duracion: '2h', categoria: 'Podoestética', imagen_url: 'https://images.unsplash.com/photo-1510530733502-0949ec36479b?q=80&w=800' },
  // Cejas y Pestañas
  { id: 'cp1', nombre: 'Diseño y Depilación', descripcion: 'Perfilado estratégico que realza tu expresión.', duracion: '15min', categoria: 'Cejas y Pestañas', imagen_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800' },
  { id: 'cp2', nombre: 'Laminado de Cejas', descripcion: 'Efecto de cejas peinadas y con volumen extra.', duracion: '1h', categoria: 'Cejas y Pestañas', imagen_url: 'https://images.unsplash.com/photo-1595475243692-3925209f029a?q=80&w=800' },
  { id: 'cp3', nombre: 'Lifting de Pestañas', descripcion: 'Elevación y curvatura natural para una mirada radiante.', duracion: '1h', categoria: 'Cejas y Pestañas', imagen_url: 'https://images.unsplash.com/photo-1583001931036-6433bc83b4b1?q=80&w=800' },
  { id: 'cp4', nombre: 'Pestañas pelo a pelo', descripcion: 'Largo sofisticado y volumen natural inigualable.', duracion: '2h', categoria: 'Cejas y Pestañas', imagen_url: 'https://images.unsplash.com/photo-1441512673622-3eaa1c37ba2d?q=80&w=800' }
];

export const GALLERY: GalleryItem[] = [
  { id: 'g1', image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800', category: 'Soft Gel' },
  { id: 'g2', image_url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800', category: 'Esculpidas' },
  { id: 'g3', image_url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?q=80&w=800', category: 'Nail Art' },
  { id: 'g4', image_url: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800', category: 'Mirada' },
  { id: 'g5', image_url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800', category: 'Kapping' },
  { id: 'g6', image_url: 'https://images.unsplash.com/photo-1516238840914-94dfc0c873ae?q=80&w=800', category: 'Podoestética' },
  { id: 'g7', image_url: 'https://images.unsplash.com/photo-1583001931036-6433bc83b4b1?q=80&w=800', category: 'Lifting' },
  { id: 'g8', image_url: 'https://images.unsplash.com/photo-1510530733502-0949ec36479b?q=80&w=800', category: 'Spa de Pies' },
  { id: 'g9', image_url: 'https://images.unsplash.com/photo-1519415510236-855906a2b558?q=80&w=800', category: 'Pedicuría' },
  { id: 'g10', image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800', category: 'Diseño' },
  { id: 'g11', image_url: 'https://images.unsplash.com/photo-1595475243692-3925209f029a?q=80&w=800', category: 'Cejas' },
  { id: 'g12', image_url: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=800', category: 'Lashes' }
];

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];
