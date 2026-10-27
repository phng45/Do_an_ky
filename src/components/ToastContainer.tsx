import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let colorClasses = 'bg-zinc-900 border-zinc-700 text-zinc-100';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-red-950/95 border-red-800 text-red-200';
        } else if (toast.type === 'info') {
          Icon = Info;
          colorClasses = 'bg-zinc-900 border-zinc-700 text-zinc-200';
        } else {
          colorClasses = 'bg-zinc-900/95 border-amber-500/40 text-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all text-xs font-medium animate-slide-up ${colorClasses}`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 text-zinc-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
