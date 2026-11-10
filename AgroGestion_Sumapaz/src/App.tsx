import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { ModalLogin } from './components/ModalLogin';
import { VistaPublicaMapa } from './components/VistaPublicaMapa';
import { VistaDuenoFinca } from './components/VistaDuenoFinca';
import { VistaEncuestadorAdmin } from './components/VistaEncuestadorAdmin';

const AppContent: React.FC = () => {
  const { rol, currentUser } = useApp();

  // Route Guards
  const puedeVerDueno = currentUser && (currentUser.rol === 'dueno' || currentUser.rol === 'admin');
  const puedeVerEvaluador = currentUser && (currentUser.rol === 'evaluador' || currentUser.rol === 'encuestador' || currentUser.rol === 'admin');
  const puedeVerAdmin = currentUser && currentUser.rol === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#473F37] selection:bg-[#BDD7C4] selection:text-[#244D32]">
      {/* Barra de Navegación Sobria */}
      <Navbar />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {rol === 'publico' && <VistaPublicaMapa />}
        
        {rol === 'dueno' && (
          puedeVerDueno ? <VistaDuenoFinca /> : <VistaPublicaMapa />
        )}

        {(rol === 'evaluador' || rol === 'encuestador') && (
          puedeVerEvaluador ? <VistaEncuestadorAdmin modoSoloCampo={currentUser?.rol === 'evaluador'} /> : <VistaPublicaMapa />
        )}
        
        {rol === 'admin' && (
          puedeVerAdmin ? <VistaEncuestadorAdmin /> : <VistaPublicaMapa />
        )}
      </main>

      {/* Footer Editorial y Académico */}
      <footer className="border-t border-[#E5DFD3] bg-[#FCFAF7] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#736B62]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-[#1C1815]">AgroGestión Sumapaz &bull; Observatorio de Sostenibilidad Agroturística &bull; Sumapaz</span> &bull; 
            Fusagasugá &bull; Pasca &bull; Silvania &bull; Arbeláez
          </div>
          <div className="font-mono text-[11px] text-[#736B62]">
            Arquitectura PWA Offline-First &bull; ISA &bull; TRL-A &bull; SRL-A &bull; GKT-A &bull; 60 Variables Agronómicas
          </div>
        </div>
      </footer>

      {/* Modal de Autenticación y Control de Roles */}
      <ModalLogin />

      {/* Notificaciones Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
