
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Gallery from './components/Gallery.tsx';
import BookingForm from './components/BookingForm.tsx';
import Footer from './components/Footer.tsx';
import Login from './components/Admin/Login.tsx';
import Dashboard from './components/Admin/Dashboard.tsx';
import { supabase } from './lib/supabase.ts';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(window.location.hash.includes('admin'));
  const [session, setSession] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(isAdminMode);

  useEffect(() => {
    if (isAdminMode) {
      setIsCheckingAuth(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setIsCheckingAuth(false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (isAdminMode) setIsCheckingAuth(false);
    });

    const handleHashChange = () => {
      const isNowAdmin = window.location.hash.includes('admin');
      setIsAdminMode(isNowAdmin);
      if (isNowAdmin) setIsCheckingAuth(true);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      subscription.unsubscribe();
    };
  }, [isAdminMode]);

  if (isAdminMode && isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBCACA]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif text-[#C5A059] italic tracking-widest">Verificando Acceso...</p>
        </div>
      </div>
    );
  }

  if (isAdminMode) {
    return !session ? (
      <Login
        onBack={() => { window.location.hash = ''; }}
      />
    ) : (
      <Dashboard
        onLogout={async () => {
          await supabase.auth.signOut();
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F9] selection:bg-[#FBCACA] selection:text-[#1A1A1A]">
      <Navbar />
      <main className="animate-in fade-in duration-700">
        <Hero />
        <Services />
        <Gallery />
        <BookingForm />
      </main>
      <Footer />

      <div
        onClick={() => (window.location.hash = 'admin')}
        className="fixed bottom-0 right-0 w-8 h-8 cursor-default z-0 opacity-0"
        aria-hidden
      />
    </div>
  );
};

export default App;
