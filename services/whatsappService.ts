
import { Booking, Service } from '../types';
import { BUSINESS_PHONE } from '../constants';

export const sendWhatsAppBooking = (booking: Booking, service: Service) => {
  // Fixed: Property 'name' does not exist on type 'Service', using 'nombre' instead
  const message = `¡Hola Naomi! 👋 

Acabo de reservar un turno a través de la web:

💅 *Servicio:* ${service.nombre}
📅 *Fecha:* ${booking.date}
⏰ *Hora:* ${booking.time}
👤 *Nombre:* ${booking.customerName}

¿Me confirmás si está disponible? 😊`;

  const encodedMessage = encodeURIComponent(message);

  // Usamos el formato oficial wa.me que es el que mejor procesan los celulares
  // para mostrar un aviso de sistema limpio ("¿Abrir en WhatsApp?") en lugar del alerta técnico.
  const url = `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;

  window.location.href = url;
};
