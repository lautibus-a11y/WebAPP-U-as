
import { Booking, Service } from '../types';
import { BUSINESS_PHONE } from '../constants';

export const sendWhatsAppBooking = (booking: Booking, service: Service, appointmentId?: string) => {
  const idText = appointmentId ? `\n🆔 *Reserva ID:* ${appointmentId}` : '';

  // Fixed: Property 'name' does not exist on type 'Service', using 'nombre' instead
  const message = `¡Hola Bellezza! 👋 
  
Acabo de reservar un turno a través de la web:
  
✨ *Servicio:* ${service.nombre}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.time}
👤 *Nombre:* ${booking.customerName}${idText}

¿Me confirman si está todo ok? 😊`;

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;

  // Use location.href for better mobile compatibility (avoids popup blockers)
  window.location.href = url;
};
