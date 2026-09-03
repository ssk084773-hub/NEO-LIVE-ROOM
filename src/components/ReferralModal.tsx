import React from 'react';
import { Gift, Copy, Users, Coins, Sparkles, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReferralModalProps {
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ onClose }) => {
  const { currentUser, addToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUser.referralCode);
      setCopied(true);
      addToast('Referral Code Copied', 'Share with friends to earn bonus coins!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Invite & Earn Rewards</h3>
            <p className="text-[11px] text-slate-400">Community Referral Program</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Referral Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-pink-950/30 border border-purple-500/30 text-center space-y-2">
          <span className="text-xs font-semibold text-purple-300">Your Exclusive Invite Code</span>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-black tracking-widest text-amber-300 bg-slate-950/80 px-4 py-2 rounded-xl border border-amber-500/30">
              {currentUser.referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition active:scale-95 shadow"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-300 pt-1">
            Give 100 free coins to new friends. Receive 50 bonus coins when they join!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="text-lg font-black text-white">12</span>
            <span className="text-[10px] text-slate-400 block">Friends Joined</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-lg font-black text-amber-300">600</span>
            <span className="text-[10px] text-slate-400 block">Coins Earned</span>
          </div>
        </div>

        {/* Rules */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
          <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Referral Policy:</span>
          </h5>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
            <li>Bonus coins are credited once your invited friend verifies their mobile number.</li>
            <li>Referral rewards are platform virtual coins for live interactions; no cash exchange.</li>
            <li>Accounts engaging in self-referrals or fraud will be automatically suspended.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
