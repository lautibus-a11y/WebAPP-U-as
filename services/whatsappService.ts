
import { Booking, Service } from '../types';
import { BUSINESS_PHONE } from '../constants';

export const sendWhatsAppBooking = (booking: Booking, service: Service) => {
  // Fixed: Property 'name' does not exist on type 'Service', using 'nombre' instead
  const message = `¡Hola Naomi! 🌟 

Acabo de reservar un turno a través de la web:

✨ *Servicio:* ${service.nombre}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.time}
👤 *Nombre:* ${booking.customerName}

¿Me confirmás si está disponible? 😊`;

  const encodedMessage = encodeURIComponent(message);

  // Usamos el endpoint más estable de la API para evitar errores de codificación
  const url = `https://api.whatsapp.com/send?phone=${BUSINESS_PHONE}&text=${encodedMessage}`;

  window.location.href = url;
};
