'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Check, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-bold shadow-2xl backdrop-blur ${
            toast.type === 'success' 
              ? 'bg-emerald-600/92 border-emerald-400/30 text-white'
              : toast.type === 'danger'
              ? 'bg-red-600/92 border-red-400/30 text-white'
              : 'bg-[#061C36]/94 border-white/15 text-white'
          }`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {toast.type === 'success' && <Check size={18} />}
          {toast.type === 'danger' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
