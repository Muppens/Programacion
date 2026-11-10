import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconos = {
          success: <CheckCircle2 className="w-4 h-4 text-[#244D32] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#C48227] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#2C4F6B] shrink-0" />,
          error: <XCircle className="w-4 h-4 text-[#B8532F] shrink-0" />,
        };

        const bordes = {
          success: 'border-[#BDD7C4] bg-white text-[#1C1815]',
          warning: 'border-[#F4DAAA] bg-white text-[#1C1815]',
          info: 'border-[#B8D0E3] bg-white text-[#1C1815]',
          error: 'border-[#F0C4B4] bg-white text-[#1C1815]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${bordes[toast.tipo]}`}
          >
            {iconos[toast.tipo]}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1C1815] tracking-tight font-sans">{toast.titulo}</h4>
              <p className="text-[11px] text-[#473F37] mt-0.5 leading-relaxed font-sans">{toast.mensaje}</p>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#736B62] hover:text-[#1C1815] p-0.5 rounded transition-colors"
              title="Cerrar notificación"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
