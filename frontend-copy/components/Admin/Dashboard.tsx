
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Service, GalleryItem, AppointmentDB } from '../../types.ts';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'servicios' | 'gallery' | 'bookings'>('bookings');
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [bookings, setBookings] = useState<AppointmentDB[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
      fetchData();
    };
    init();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await (activeTab === 'bookings' 
        ? supabase.from('appointments').select('*').order('appointment_date', { ascending: true }).order('appointment_time', { ascending: true })
        : activeTab === 'servicios'
        ? supabase.from('servicios').select('*').order('id', { ascending: true })
        : supabase.from('gallery').select('*').order('created_at', { ascending: false }));

      if (error) throw error;
      
      if (activeTab === 'bookings') setBookings(data || []);
      else if (activeTab === 'servicios') setServices(data || []);
      else setGallery(data || []);
      
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table: string, id: string | number) => {
    if (!window.confirm('¿Confirmás que querés borrar este registro permanentemente?')) return;

    setLoading(true);
    try {
      console.log(`[DELETE_ACTION] Table: ${table}, ID: ${id}`);
      
      // Attempt deletion. eq() handles type conversion in PostgREST generally.
      const { error, status } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error("[DB_ERROR]", error);
        throw error;
      }

      console.log(`[DELETE_SUCCESS] Status: ${status}`);

      // Update local state immediately
      const idStr = String(id);
      if (table === 'appointments') {
        setBookings(prev => prev.filter(b => String(b.id) !== idStr));
      } else if (table === 'servicios') {
        setServices(prev => prev.filter(s => String(s.id) !== idStr));
      } else if (table === 'gallery') {
        setGallery(prev => prev.filter(g => String(g.id) !== idStr));
      }

    } catch (err: any) {
      console.error("[CRASH_ON_DELETE]", err);
      alert(`No se pudo borrar: ${err.message || 'Error desconocido'}\n\nRevisá la consola para más detalles.`);
    } finally {
      setLoading(false);
      // Synchronize data
      fetchData();
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${activeTab}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error("Upload error:", err);
      return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800';
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploading) return;
    setUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];
    
    try {
      let imagen_url = editingItem?.imagen_url || editingItem?.image_url || 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800';
      if (file) imagen_url = await uploadImage(file);

      if (activeTab === 'servicios') {
        const payload = {
          nombre: formData.get('nombre') as string,
          descripcion: formData.get('descripcion') as string,
          duracion: formData.get('duracion') as string,
          categoria: formData.get('categoria') as string,
          imagen_url,
          editable: true
        };
        const { error } = editingItem?.id 
          ? await supabase.from('servicios').update(payload).eq('id', editingItem.id)
          : await supabase.from('servicios').insert([payload]);
        if (error) throw error;
      } else {
        const payload = {
          image_url: imagen_url,
          category: formData.get('category') as string || 'General'
        };
        const { error } = editingItem?.id
          ? await supabase.from('gallery').update(payload).eq('id', editingItem.id)
          : await supabase.from('gallery').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`Error al guardar: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-[#FBCACA]/20 hidden lg:flex flex-col p-8 fixed h-full z-20">
        <div className="mb-12">
          <div className="text-3xl font-serif text-[#C5A059]">Bellezza</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-1">Admin Dashboard</div>
        </div>
        
        <nav className="flex-1 space-y-3">
          {[
            { id: 'bookings', label: 'Turnos', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 002-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z' },
            { id: 'servicios', label: 'Catálogo', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
            { id: 'gallery', label: 'Galería', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#C5A059] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-gray-100">
          <p className="text-[9px] text-gray-400 mb-4 px-2 truncate font-mono">{userEmail}</p>
          <button onClick={onLogout} className="w-full py-4 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-8 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-serif text-[#1A1A1A]">{activeTab === 'bookings' ? 'Gestión de Citas' : activeTab === 'servicios' ? 'Servicios' : 'Galería'}</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 font-bold">Administrá tu negocio en tiempo real</p>
            </div>
            {activeTab !== 'bookings' && (
              <button 
                onClick={() => { setEditingItem(null); setPreviewUrl(null); setIsModalOpen(true); }} 
                className="bg-[#C5A059] text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-[#C5A059]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Añadir Nuevo
              </button>
            )}
          </div>

          {loading && (bookings.length === 0 && services.length === 0 && gallery.length === 0) ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-300">
              <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              {activeTab === 'bookings' && (
                <div className="grid gap-4">
                  {bookings.map(b => (
                    <div key={String(b.id)} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-gray-900 text-lg">{b.customer_name}</div>
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === 'confirmed' ? 'bg-green-100 text-green-600' : b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#C5A059] font-medium mt-1 uppercase tracking-wider">
                          {b.service_name} • {b.appointment_date} <span className="text-gray-400 mx-1">|</span> {b.appointment_time} - {b.end_time || '...'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <select 
                          value={b.status} 
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase p-2.5 px-4 rounded-xl border outline-none cursor-pointer transition-colors ${b.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : b.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmar</option>
                          <option value="cancelled">Cancelar</option>
                        </select>
                        <button 
                          onClick={() => handleDelete('appointments', b.id)} 
                          className="text-gray-300 hover:text-red-500 transition-colors p-3 hover:bg-red-50 rounded-xl"
                          title="Eliminar registro"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && !loading && (
                    <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                      <p className="text-gray-300 font-serif italic text-xl">Aún no hay turnos registrados.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'servicios' && (
                <div className="grid md:grid-cols-2 gap-8">
                  {services.map(s => (
                    <div key={String(s.id)} className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all duration-500">
                      <div className="aspect-video rounded-[24px] overflow-hidden mb-6 bg-gray-50">
                        <img src={s.imagen_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={s.nombre} />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-2xl text-[#1A1A1A]">{s.nombre}</h3>
                        <span className="text-[10px] font-bold uppercase text-[#C5A059] tracking-widest">{s.categoria}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-6 flex-1 line-clamp-2 leading-relaxed">{s.descripcion || 'Sin descripción detallada'}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{s.duracion}</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(s); setPreviewUrl(s.imagen_url); setIsModalOpen(true); }} className="px-4 py-2 text-[10px] font-bold uppercase text-gray-400 hover:text-[#C5A059] transition-colors">Editar</button>
                          <button onClick={() => handleDelete('servicios', s.id)} className="px-4 py-2 text-[10px] font-bold uppercase text-red-300 hover:text-red-500 transition-colors">Borrar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map(item => (
                    <div key={String(item.id)} className="relative aspect-square rounded-[24px] overflow-hidden group shadow-sm border border-gray-100">
                      <img src={item.image_url} className="w-full h-full object-cover" alt="Galería" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest mb-4">{item.category}</span>
                        <button onClick={() => handleDelete('gallery', item.id)} className="p-3 bg-white/20 hover:bg-red-500 text-white rounded-2xl transition-all scale-90 group-hover:scale-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif text-[#1A1A1A]">{editingItem ? 'Editar' : 'Nuevo'} {activeTab === 'servicios' ? 'Servicio' : 'Ítem de Galería'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              {activeTab === 'servicios' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Nombre del servicio</label>
                    <input name="nombre" defaultValue={editingItem?.nombre} placeholder="Ej: Soft Gel" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Descripción</label>
                    <textarea name="descripcion" defaultValue={editingItem?.descripcion} placeholder="Breve descripción..." className="w-full p-5 bg-gray-50 rounded-2xl outline-none resize-none focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 transition-all min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Categoría</label>
                      <select name="categoria" defaultValue={editingItem?.categoria || 'Manicuria'} className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 font-bold appearance-none">
                        <option value="Manicuria">Manicuria</option>
                        <option value="Podoestética">Podoestética</option>
                        <option value="Cejas y Pestañas">Cejas y Pestañas</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Duración</label>
                      <input name="duracion" defaultValue={editingItem?.duracion} placeholder="1h 30min" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 font-bold" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Categoría / Etiqueta</label>
                  <input name="category" defaultValue={editingItem?.category} placeholder="Ej: Semi, Arte, Esculpidas" required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#C5A059]/20 font-medium" />
                </div>
              )}
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">Imagen</label>
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-[#C5A059] transition-colors"
                >
                  {(previewUrl || editingItem?.imagen_url || editingItem?.image_url) ? (
                    <img src={previewUrl || editingItem?.imagen_url || editingItem?.image_url} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Click para seleccionar</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold uppercase transition-opacity">Cambiar</div>
                </div>
                <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) setPreviewUrl(URL.createObjectURL(f)); }} accept="image/*" className="hidden" />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-bold uppercase text-gray-400 hover:text-gray-900 transition-colors tracking-widest">Cancelar</button>
                <button 
                  type="submit" 
                  disabled={uploading} 
                  className="bg-[#C5A059] text-white flex-[2] py-5 rounded-2xl font-bold uppercase text-[11px] tracking-widest disabled:opacity-50 shadow-lg hover:brightness-110 transition-all"
                >
                  {uploading ? 'Guardando...' : editingItem ? 'Actualizar Cambios' : 'Crear Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
