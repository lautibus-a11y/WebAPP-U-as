
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

  // Detect mobile to use the app protocol directly (bypasses browser landing page)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const url = isMobile
    ? `whatsapp://send?phone=${BUSINESS_PHONE}&text=${encodedMessage}`
    : `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;

  window.location.href = url;
};
