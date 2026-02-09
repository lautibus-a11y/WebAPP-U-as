
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { TIME_SLOTS, SERVICES as FALLBACK_SERVICES } from '../constants.ts';
import { sendWhatsAppBooking } from '../services/whatsappService.ts';
import { Booking, Service } from '../types.ts';

const BookingForm: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  const [formData, setFormData] = useState<Booking>({
    serviceId: '',
    date: '',
    time: '',
    customerName: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const { data, error: dbError } = await supabase.from('servicios').select('*');
        if (dbError) throw dbError;
        setServices(data && data.length > 0 ? data : FALLBACK_SERVICES);
      } catch (e) {
        setServices(FALLBACK_SERVICES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.date) return;
      setIsLoadingSlots(true);
      try {
        const { data, error: dbError } = await supabase
          .from('appointments')
          .select('appointment_time')
          .eq('appointment_date', formData.date)
          .neq('status', 'cancelled');

        if (dbError) throw dbError;
        
        const normalized = (data || []).map(app => {
          const t = app.appointment_time;
          return t.split(':').slice(0, 2).join(':'); 
        });
        
        setBookedSlots(normalized);
      } catch (err) {
        console.error("Error consultando disponibilidad:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchAvailability();
  }, [formData.date]);

  const handleNext = () => {
    setError(null);
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrev = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const calculateEndTime = (startTime: string, durationStr: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let durationMinutes = 60; 
    if (durationStr.includes('h')) {
      const parts = durationStr.split('h');
      durationMinutes = Number(parts[0]) * 60;
      if (parts[1] && parts[1].includes('min')) {
        durationMinutes += Number(parts[1].replace('min', '').trim());
      }
    } else if (durationStr.includes('min')) {
      durationMinutes = Number(durationStr.replace('min', '').trim());
    }
    
    const date = new Date();
    date.setHours(hours, minutes + durationMinutes);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const service = services.find(s => String(s.id) === String(formData.serviceId));
    if (!service) {
      setError("Por favor, seleccioná un servicio válido.");
      return;
    }

    if (!formData.customerName.trim()) {
      setError("Por favor, ingresá tu nombre.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data: existing, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', formData.date)
        .eq('appointment_time', `${formData.time}:00`) 
        .neq('status', 'cancelled');

      if (checkError) throw checkError;
      if (existing && existing.length > 0) {
        setError("Lo sentimos, este horario acaba de ser reservado. Por favor, elegí otro.");
        setBookedSlots(prev => [...prev, formData.time]);
        setIsSubmitting(false);
        return;
      }

      const appointmentId = crypto.randomUUID();
      const endTime = calculateEndTime(formData.time, service.duracion);
      
      const { error: dbError } = await supabase
        .from('appointments')
        .insert([{
          id: appointmentId,
          service_id: formData.serviceId,
          service_name: service.nombre,
          customer_name: formData.customerName,
          appointment_date: formData.date,
          appointment_time: `${formData.time}:00`,
          end_time: endTime,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      setSuccess(true);
      
      setTimeout(() => {
        sendWhatsAppBooking(formData, service, appointmentId);
        setStep(1);
        setFormData({ serviceId: '', date: '', time: '', customerName: '' });
        setSuccess(false);
      }, 1800);

    } catch (err: any) {
      console.error("Database error:", err);
      setError(`Error: ${err.message}. IMPORTANTE: Copiá y ejecutá el código SQL de 'database_setup.sql' en el editor SQL de Supabase para corregir la base de datos.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section className="py-32 bg-[#FBCACA] flex items-center justify-center min-h-[600px]">
        <div className="bg-white rounded-[40px] p-12 text-center shadow-2xl animate-in zoom-in duration-500 max-w-md mx-6">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-serif text-[#1A1A1A] mb-4">¡Turno Solicitado!</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Tu reserva ha sido procesada con éxito.
          </p>
          <div className="flex items-center justify-center gap-2 text-[#C5A059] font-bold text-[10px] uppercase tracking-widest">
            <div className="w-4 h-4 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
            Abriendo WhatsApp...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="turnos" className="py-32 bg-[#FBCACA] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-16 border border-white/40 backdrop-blur-sm">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-[#FBCACA]/20 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-[#C5A059] mb-4">Reserva Online</div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-8">Elegí tu Turno</h2>
            
            <div className="flex justify-center items-center gap-4">
              {[1, 2, 3].map(i => (
                <React.Fragment key={i}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 text-[10px] font-bold ${step >= i ? 'bg-[#C5A059] border-[#C5A059] text-white' : 'border-gray-100 text-gray-300'}`}>
                    {i}
                  </div>
                  {i < 3 && <div className={`h-px w-8 transition-all duration-500 ${step > i ? 'bg-[#C5A059]' : 'bg-gray-100'}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="min-h-[400px] flex flex-col justify-between">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">¿Qué servicio te gustaría?</p>
                <div className="grid gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="py-20 text-center text-gray-200 uppercase text-[10px] font-bold tracking-widest">Buscando servicios...</div>
                  ) : (
                    services.map(service => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, serviceId: service.id });
                          handleNext();
                        }}
                        className={`group flex justify-between items-center p-6 rounded-2xl border-2 transition-all ${
                          String(formData.serviceId) === String(service.id) ? 'border-[#C5A059] bg-[#FBCACA]/5' : 'border-gray-50 hover:border-[#FBCACA] hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-bold text-[#1A1A1A] tracking-tight text-lg group-hover:text-[#C5A059] transition-colors">{service.nombre}</div>
                          <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-medium">{service.duracion}</div>
                        </div>
                        <div className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest opacity-60">{service.categoria}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Seleccioná Fecha y Hora</p>
                <div className="space-y-8">
                  <div className="relative">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400 absolute top-2 left-5 z-10">Día</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pt-8 pb-4 px-5 rounded-2xl border-2 border-gray-100 bg-white focus:border-[#C5A059] focus:outline-none transition-all font-bold text-[#1A1A1A]"
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      value={formData.date}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Horarios disponibles</label>
                      {isLoadingSlots && <div className="w-3 h-3 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked || isLoadingSlots}
                            onClick={() => setFormData({ ...formData, time: slot })}
                            className={`p-4 rounded-xl text-xs font-bold border-2 transition-all ${
                              formData.time === slot 
                                ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-lg shadow-[#C5A059]/20' 
                                : isBooked
                                  ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                                  : 'bg-white border-gray-50 hover:border-[#FBCACA] text-gray-500'
                            }`}
                          >
                            {isBooked ? 'Ocupado' : slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handlePrev} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A]">Atrás</button>
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    disabled={!formData.date || !formData.time || isLoadingSlots}
                    className="btn-premium-gold flex-[2] py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tus Datos</p>
                <div className="space-y-5">
                  <div className="relative">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400 absolute top-2 left-5 z-10">Nombre Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Lucía Pérez"
                      required
                      className="w-full pt-8 pb-4 px-5 rounded-2xl border-2 border-gray-100 bg-white focus:border-[#C5A059] focus:outline-none transition-all font-medium text-[#1A1A1A]"
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      value={formData.customerName}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-[10px] font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={handlePrev} className="flex-1 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1A1A1A]">Atrás</button>
                  <button 
                    type="submit" 
                    disabled={!formData.customerName || isSubmitting}
                    className="btn-premium-gold flex-[2] py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Confirmando...' : 'Confirmar en WhatsApp'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
