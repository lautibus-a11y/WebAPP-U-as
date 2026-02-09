
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase.ts';

interface LoginProps {
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (authError) {
      console.error(authError);
      setError(authError.message === 'Invalid login credentials' ? 'Credenciales incorrectas' : authError.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F9] px-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-[#FBCACA]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FBCACA]/10 rounded-bl-[100px]"></div>

        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-[#FBCACA]/20 rounded-3xl mb-6">
            <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-[#1A1A1A]">Administración</h1>
          <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold">Acceso Exclusivo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Email Corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#C5A059] focus:outline-none transition-all text-sm font-medium"
              placeholder="admin@bellezza.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#C5A059] focus:outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 rounded-2xl text-red-500 text-[11px] text-center font-bold border border-red-100 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
           <button 
             onClick={onBack}
             className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#C5A059] transition-colors"
           >
             ← Volver al sitio público
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
