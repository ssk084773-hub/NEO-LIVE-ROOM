import React, { useState } from 'react';
import {
  User as UserIcon,
  Coins,
  Gem,
  Award,
  Sparkles,
  ShieldCheck,
  Gift,
  Share2,
  FileText,
  Trash2,
  LogOut,
  ChevronRight,
  Edit3,
  Globe,
  Settings,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileScreenProps {
  onOpenWallet: () => void;
  onOpenHostApp: () => void;
  onOpenReferral: () => void;
  onOpenPolicies: (tab?: 'terms' | 'privacy' | 'guidelines' | 'deletion') => void;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenWallet,
  onOpenHostApp,
  onOpenReferral,
  onOpenPolicies,
  onOpenAuth,
  onOpenLeaderboard,
}) => {
  const {
    currentUser,
    coins,
    diamonds,
    followedHostIds,
    logoutUser,
  } = useApp();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(currentUser.bio);

  const earningsUsd = (diamonds / 100).toFixed(2);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-white scrollbar-none pb-6">
      {/* Header Profile Banner */}
      <div className="relative bg-gradient-to-b from-purple-900/60 via-slate-900 to-slate-950 p-4 pt-6 border-b border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full object-cover rounded-full border-2 border-slate-950"
              />
              {currentUser.isCreator && (
                <span className="absolute bottom-0 right-0 p-1 rounded-full bg-purple-600 text-white shadow ring-2 ring-slate-950" title="Verified Creator">
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
              )}
            </div>

            {/* Name & ID */}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{currentUser.displayName}</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-600/80 text-white font-bold">
                  Lv.{currentUser.level}
                </span>
              </div>
              <p className="text-[11px] text-purple-300">@{currentUser.username}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span>ID: {currentUser.id.slice(0, 10)}</span>
                <span>•</span>
                <span>{currentUser.country}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            title="Account switch / login"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Bio */}
        <div className="mt-3 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
          <p className="leading-relaxed">{currentUser.bio}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-sm font-black text-white">{followedHostIds.length}</span>
            <span className="text-[10px] text-slate-400 block">Following</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-sm font-black text-white">4.8k</span>
            <span className="text-[10px] text-slate-400 block">Followers</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-sm font-black text-amber-400">Lv.{currentUser.level}</span>
            <span className="text-[10px] text-slate-400 block">Supporter</span>
          </div>
        </div>
      </div>

      {/* Wallet Card Quick Access */}
      <div className="p-4 pb-2">
        <div
          onClick={onOpenWallet}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-pink-950/50 border border-purple-500/30 cursor-pointer hover:border-purple-400/60 transition shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">My Coins & Earnings</div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm font-black text-amber-400">
                  {coins.toLocaleString()} <span className="text-[10px] text-amber-300/80">Coins</span>
                </span>
                <span className="text-sm font-black text-purple-300">
                  ${earningsUsd} <span className="text-[10px] text-purple-300/80">USD</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-purple-400">
            <span>Recharge</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Action Menu List */}
      <div className="p-4 space-y-2">
        {/* Creator Application */}
        <button
          onClick={onOpenHostApp}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/15 text-pink-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Host & Creator Center</span>
              <span className="text-[10px] text-slate-400">
                {currentUser.isCreator ? 'Verified Creator Status' : 'Apply for Live Broadcasting & Monetization'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Hall of Fame / Leaderboard */}
        <button
          onClick={onOpenLeaderboard}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Leaderboard & Hall of Fame</span>
              <span className="text-[10px] text-slate-400">Top Hosts and Top Supporters</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Referral System */}
        <button
          onClick={onOpenReferral}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Invite Friends & Earn Rewards</span>
              <span className="text-[10px] text-slate-400">Code: {currentUser.referralCode} (+100 Coins)</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Privacy & Legal */}
        <button
          onClick={() => onOpenPolicies('privacy')}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Privacy & Security Policies</span>
              <span className="text-[10px] text-slate-400">Encrypted RTC, Data Protection</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Terms of Service & Rules */}
        <button
          onClick={() => onOpenPolicies('terms')}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/15 text-teal-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Terms of Service & Rules</span>
              <span className="text-[10px] text-slate-400">Community standards and creator rules</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Account Deletion */}
        <button
          onClick={() => onOpenPolicies('deletion')}
          className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 flex items-center justify-between text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 block">Delete Account (GDPR)</span>
              <span className="text-[10px] text-slate-400">Permanently remove profile and data</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Logout / Switch Account */}
      <div className="px-4 pt-2">
        <button
          onClick={logoutUser}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>
    </div>
  );
};
