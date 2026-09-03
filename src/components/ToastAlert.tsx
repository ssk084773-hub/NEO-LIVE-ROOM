import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastAlert: React.FC = () => {
  const { activeToast } = useApp();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-11/12 max-w-sm pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl shadow-purple-950/40 pointer-events-auto flex items-start gap-3"
        >
          <div className="p-2 rounded-xl bg-slate-800/80 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{activeToast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeToast.message}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
