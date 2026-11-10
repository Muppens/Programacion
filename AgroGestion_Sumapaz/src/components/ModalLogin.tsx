import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  Key, 
  X, 
  Coffee, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Compass, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';

export const ModalLogin: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, loginDemo } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);
    if (!email || !password) {
      setErrorLocal('Por favor completa todos los campos.');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setErrorLocal('Credenciales inválidas. Revisa correo o contraseña.');
    }
  };

  const handleQuickLogin = (role: 'publico' | 'dueno' | 'evaluador' | 'admin') => {
    setErrorLocal(null);
    loginDemo(role);
  };

  return (
    <>
      {/* Fondo oscuro Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm animate-fadeIn" 
        onClick={() => setIsLoginModalOpen(false)}
      />

      {/* Contenedor de la tarjeta del Modal */}
      <div className="fixed z-[9999] inset-0 m-auto flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative z-[9999] pointer-events-auto w-full max-w-md bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#1C1815] overflow-hidden animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow de acento superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#244D32] via-[#C48227] to-[#B8532F]" />

          {/* Encabezado y Botón Cerrar */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center text-[#244D32] shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1815] tracking-tight">
                  Control de Acceso &amp; Roles (RBAC)
                </h3>
                <p className="text-xs text-[#736B62]">
                  Observatorio Agroturístico Sumapaz
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="p-1 rounded-lg text-[#736B62] hover:text-[#1C1815] hover:bg-[#F3EFE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuentas Demo de Acceso Rápido */}
          <div className="mb-6 p-3.5 bg-[#F3EFE6] rounded-xl border border-[#E5DFD3]">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C48227]" />
              <span className="text-[11px] font-semibold text-[#1C1815] uppercase tracking-wider font-mono">
                Acceso Rápido Demo (Sustentación)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('publico')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E5DFD3] hover:border-[#736B62] text-left transition-all text-xs group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#736B62] group-hover:text-[#1C1815]" />
                  <div>
                    <div className="font-semibold text-[#1C1815]">Ingresar como Público</div>
                    <div className="text-[10px] text-[#736B62]">Sin credenciales &bull; Solo lectura territorial</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F3EFE6] text-[#736B62] border border-[#E5DFD3]">Libre</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('dueno')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E5DFD3] hover:border-[#B8532F] text-left transition-all text-xs group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Coffee className="w-4 h-4 text-[#B8532F]" />
                  <div>
                    <div className="font-semibold text-[#1C1815]">Ingresar como Dueño (Don Gonzalo)</div>
                    <div className="text-[10px] text-[#736B62]">Hacienda La Colina &bull; coloma@agro.co</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FBEFEA] text-[#B8532F] border border-[#F0C4B4]">Dueño</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('evaluador')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E5DFD3] hover:border-[#2C4F6B] text-left transition-all text-xs group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#2C4F6B]" />
                  <div>
                    <div className="font-semibold text-[#1C1815]">Ingresar como Evaluador de Campo</div>
                    <div className="text-[10px] text-[#736B62]">Ing. Juan Camilo &bull; evaluador@sumapaz.udea.co</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECF2F7] text-[#2C4F6B] border border-[#B8D0E3]">Campo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-[#E5DFD3] hover:border-[#244D32] text-left transition-all text-xs group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#244D32]" />
                  <div>
                    <div className="font-semibold text-[#1C1815]">Ingresar como Super Administrador</div>
                    <div className="text-[10px] text-[#736B62]">Dra. Elena Valenzuela &bull; admin@sumapaz.udea.co</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">Admin</span>
              </button>
            </div>
          </div>

          {/* Separador */}
          <div className="relative flex py-1 items-center mb-4">
            <div className="flex-grow border-t border-[#E5DFD3]" />
            <span className="flex-shrink mx-3 text-[10px] font-mono uppercase text-[#736B62]">o ingresa tus credenciales</span>
            <div className="flex-grow border-t border-[#E5DFD3]" />
          </div>

          {/* Formulario Manual */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorLocal && (
              <div className="p-2.5 rounded-lg bg-[#FBEFEA] border border-[#F0C4B4] text-[#B8532F] text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8532F]" />
                {errorLocal}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#473F37] mb-1 font-sans">
                Correo Institucional o de Productor
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B62]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej: coloma@agro.co"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5DFD3] rounded-lg text-xs text-[#1C1815] placeholder:text-[#736B62]/50 focus:outline-none focus:border-[#244D32] focus:ring-1 focus:ring-[#244D32] font-mono transition-colors shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#473F37] mb-1 font-sans">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#736B62]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-white border border-[#E5DFD3] rounded-lg text-xs text-[#1C1815] placeholder:text-[#736B62]/50 focus:outline-none focus:border-[#244D32] focus:ring-1 focus:ring-[#244D32] font-mono transition-colors shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#736B62] hover:text-[#1C1815]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#244D32]/20 active:scale-[0.98]"
            >
              <UserCheck className="w-4 h-4" />
              <span>Validar y Entrar</span>
            </button>
          </form>

          <p className="mt-4 text-[10px] text-center text-[#736B62] font-mono">
            Autenticación segura PWA con almacenamiento local cifrado.
          </p>
        </div>
      </div>
    </>
  );
};
