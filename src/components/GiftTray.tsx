import React from 'react';
import { motion } from 'motion/react';
import { Coins, Plus, Sparkles, X } from 'lucide-react';
import { INITIAL_GIFTS } from '../data/mockData';
import { Gift } from '../types';
import { useApp } from '../context/AppContext';

interface GiftTrayProps {
  onClose: () => void;
  onOpenRecharge: () => void;
}

export const GiftTray: React.FC<GiftTrayProps> = ({ onClose, onOpenRecharge }) => {
  const { coins, sendGiftToHost } = useApp();

  const handleSend = (gift: Gift) => {
    const success = sendGiftToHost(gift);
    if (success && gift.cost >= 500) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-purple-500/20 rounded-t-3xl p-4 shadow-2xl"
    >
      {/* Header with Coin Balance */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300">{coins.toLocaleString()}</span>
          </div>
          <button
            onClick={onOpenRecharge}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm hover:brightness-110 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Recharge</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 active:scale-95 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
        {INITIAL_GIFTS.map(gift => {
          const canAfford = coins >= gift.cost;
          return (
            <button
              key={gift.id}
              onClick={() => handleSend(gift)}
              className={`group flex flex-col items-center justify-between p-2.5 rounded-2xl border transition-all text-center relative overflow-hidden ${
                canAfford
                  ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20 active:scale-95'
                  : 'bg-slate-900/40 border-slate-800/50 opacity-60'
              }`}
            >
              {gift.cost >= 500 && (
                <span className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-pink-500 text-slate-950">
                  VIP
                </span>
              )}
              <span className="text-3xl mb-1 filter drop-shadow group-hover:scale-110 transition-transform">
                {gift.icon}
              </span>
              <span className="text-xs font-medium text-slate-200 truncate w-full">{gift.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <Coins className="w-3 h-3 text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400">{gift.cost}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-pink-400" />
        <span>Gifts support the creator and boost your Community Supporter rank</span>
      </div>
    </motion.div>
  );
};
