import React from 'react';
import { useApp } from '../context/AppContext';
import { RolUsuario } from '../types';
import { 
  Compass, 
  Coffee, 
  ClipboardCheck, 
  RefreshCw,
  Trees,
  LogIn,
  LogOut,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser,
    rol, 
    setRol, 
    logout,
    setIsLoginModalOpen,
    pendientesCount, 
    sincronizarCola 
  } = useApp();

  const handleRoleClick = (targetRole: RolUsuario) => {
    setRol(targetRole);
  };

  const getRoleLabel = (r: RolUsuario) => {
    switch (r) {
      case 'admin':
        return 'Administrador del Sistema';
      case 'evaluador':
      case 'encuestador':
        return 'Técnico Evaluador';
      case 'dueno':
        return 'Productor Cafetero';
      default:
        return 'Portal Territorial';
    }
  };

  const roleLabel = getRoleLabel(currentUser ? currentUser.rol : 'publico');

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#E5DFD3] shadow-sm">
      <div className="w-full px-4 sm:px-6 min-h-[72px] flex items-center justify-between gap-4 sm:gap-6 overflow-x-auto py-2">
        
        {/* ========================================================= */}
        {/* 1. ZONA IZQUIERDA: IDENTIDAD DE MARCA OFICIAL              */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#F8F5EE] border border-[#E5DFD3] flex items-center justify-center shadow-xs shrink-0">
            <Trees className="w-5 h-5 text-[#244D32]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#1C1815] font-sans">
                AgroGestión <span className="text-[#C48227] font-serif italic">Sumapaz</span>
              </span>
            </div>
            <p className="text-[11px] text-[#736B62] hidden sm:block font-sans">
              Observatorio de Sostenibilidad Agroturística &bull; Sumapaz
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. ZONA CENTRAL: SEGMENTED CONTROL UNIFICADO              */}
        {/* ========================================================= */}
        <nav className="hidden md:flex items-center bg-[#F3EFE6] p-1.5 rounded-2xl border border-[#E5DFD3] gap-1 shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => handleRoleClick('publico')}
            className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#244D32] active:scale-[0.98] ${
              rol === 'publico'
                ? 'bg-white text-[#1C1815] shadow-xs border border-[#E5DFD3] font-semibold px-3.5 py-1.5 text-xs rounded-xl'
                : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/60 px-3.5 py-1.5 text-xs rounded-xl'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Portal Territorial</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleClick('dueno')}
            className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#244D32] active:scale-[0.98] ${
              rol === 'dueno'
                ? 'bg-white text-[#1C1815] shadow-xs border border-[#E5DFD3] font-semibold px-3.5 py-1.5 text-xs rounded-xl'
                : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/60 px-3.5 py-1.5 text-xs rounded-xl'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-[#C48227]" />
            <span>Productor Cafetero</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleClick('evaluador')}
            className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#244D32] active:scale-[0.98] ${
              rol === 'evaluador' || rol === 'encuestador'
                ? 'bg-white text-[#1C1815] shadow-xs border border-[#E5DFD3] font-semibold px-3.5 py-1.5 text-xs rounded-xl'
                : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/60 px-3.5 py-1.5 text-xs rounded-xl'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-[#2C4F6B]" />
            <span>Evaluación en Campo</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleClick('admin')}
            className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#244D32] active:scale-[0.98] ${
              rol === 'admin'
                ? 'bg-white text-[#1C1815] shadow-xs border border-[#E5DFD3] font-semibold px-3.5 py-1.5 text-xs rounded-xl'
                : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/60 px-3.5 py-1.5 text-xs rounded-xl'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#244D32]" />
            <span>Administración</span>
          </button>
        </nav>

        {/* ========================================================= */}
        {/* 3. ZONA DERECHA: TELEMETRÍA + USER CARD INTEGRADA          */}
        {/* ========================================================= */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Pill de Sincronización Cola (si hay encuestas pendientes) */}
          {pendientesCount > 0 && (
            <button
              type="button"
              onClick={sincronizarCola}
              className="px-3 py-1.5 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-mono font-medium bg-[#FBEFEA] hover:bg-[#FBEFEA]/80 text-[#B8532F] border border-[#F0C4B4] shadow-xs active:scale-[0.98] transition-all"
              title="Sincronizar encuestas capturadas en campo"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Cola ({pendientesCount})</span>
            </button>
          )}

          {/* Tarjeta de Usuario sin textos recortados */}
          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 border-l border-[#E5DFD3]">
              <div className="w-8 h-8 rounded-full bg-[#244D32] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {currentUser.avatar || currentUser.nombre.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#1C1815] leading-tight whitespace-nowrap">
                  {currentUser.nombre}
                </span>
                <span className="text-[10px] font-mono text-[#244D32] font-medium leading-none">
                  {roleLabel}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Cerrar Sesión"
                className="p-1.5 text-[#736B62] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4 text-[#B8532F]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-3 border-l border-[#E5DFD3]">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-1.5 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] border border-[#244D32]/20 shadow-sm transition-all duration-150 active:scale-[0.98]"
              >
                <LogIn className="w-3.5 h-3.5 text-[#F8F5EE]" />
                <span>Iniciar Sesión</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Barra Móvil: Segmented Control en pantallas pequeñas */}
      <div className="md:hidden px-4 py-2 bg-[#F3EFE6] border-t border-[#E5DFD3]">
        <nav className="flex items-center gap-1 justify-between">
          <button
            type="button"
            onClick={() => handleRoleClick('publico')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
              rol === 'publico' ? 'bg-white text-[#1C1815] font-semibold shadow-xs' : 'text-[#736B62]'
            }`}
          >
            Público
          </button>
          <button
            type="button"
            onClick={() => handleRoleClick('dueno')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
              rol === 'dueno' ? 'bg-white text-[#1C1815] font-semibold shadow-xs' : 'text-[#736B62]'
            }`}
          >
            Dueño
          </button>
          <button
            type="button"
            onClick={() => handleRoleClick('evaluador')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
              rol === 'evaluador' || rol === 'encuestador' ? 'bg-white text-[#1C1815] font-semibold shadow-xs' : 'text-[#736B62]'
            }`}
          >
            Evaluación
          </button>
          <button
            type="button"
            onClick={() => handleRoleClick('admin')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium text-center transition-colors ${
              rol === 'admin' ? 'bg-white text-[#1C1815] font-semibold shadow-xs' : 'text-[#736B62]'
            }`}
          >
            Administración
          </button>
        </nav>
      </div>
    </header>
  );
};
