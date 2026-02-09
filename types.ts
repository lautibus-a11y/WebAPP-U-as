
export interface Service {
  id: string | number;
  nombre: string;
  descripcion: string;
  duracion: string;
  categoria: string;
  imagen_url: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  category: string;
}

export interface Booking {
  serviceId: string | number;
  date: string;
  time: string;
  customerName: string;
}

export interface AppointmentDB {
  id: string;
  service_id: string | number;
  service_name: string;
  customer_name: string;
  appointment_date: string;
  appointment_time: string; // Actúa como hora_inicio
  end_time: string;          // hora_fin calculada
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
}
