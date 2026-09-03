import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Maximize2,
  Minimize2,
  Code2,
  Shield,
  Coins,
  Sparkles,
  Layers,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DownloadGuideModal } from './DownloadGuideModal';

interface AndroidFrameProps {
  children: React.ReactNode;
  onOpenCodeExplorer: () => void;
  onOpenAdmin: () => void;
  onOpenWallet: () => void;
  isFrameLocked?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onOpenCodeExplorer,
  onOpenAdmin,
  onOpenWallet,
}) => {
  const { currentUser, switchRole, setCurrentUser, coins, diamonds } = useApp();
  const [usePhoneFrame, setUsePhoneFrame] = useState(true);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleRole = () => {
    if (switchRole) {
      if (currentUser.role === 'user') {
        switchRole('creator');
      } else if (currentUser.role === 'creator') {
        switchRole('admin');
      } else {
        switchRole('user');
      }
    } else if (setCurrentUser) {
      if (currentUser.role === 'user') {
        setCurrentUser(prev => ({ ...prev, role: 'creator', isCreator: true }));
      } else if (currentUser.role === 'creator') {
        setCurrentUser(prev => ({ ...prev, role: 'admin', isCreator: true }));
      } else {
        setCurrentUser(prev => ({ ...prev, role: 'user', isCreator: false }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0B0F19] to-slate-950 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-purple-500 selection:text-white">
      {/* Top Universal Control & Status Deck */}
      <header className="w-full max-w-5xl mb-3 px-3 py-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-purple-500/20 shadow-xl flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-purple-600/30">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">NEO Live Room</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                Android Native
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Live Streaming, Chat & Creator Earning</p>
          </div>
        </div>

        {/* Quick Actions & Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Wallet Button */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition active:scale-95"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{coins.toLocaleString()} Coins</span>
          </button>

          {/* Quick Role Switcher */}
          <button
            onClick={toggleRole}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 ${
              currentUser.role === 'admin'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : currentUser.role === 'creator'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Click to toggle between User, Creator, and Admin roles"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Role: <strong className="capitalize">{currentUser.role}</strong></span>
          </button>

          {/* Admin Panel Button if Admin */}
          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-extrabold shadow hover:brightness-110 active:scale-95 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          {/* Install / Download Guide Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition active:scale-95 shadow-md shadow-purple-600/20"
            title="কেন সরাসরি APK ডাউনলোড হচ্ছে না এবং কীভাবে ফোনে ইনস্টল করবেন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install / ডাউনলোড</span>
          </button>

          {/* Android Code Explorer */}
          <button
            onClick={onOpenCodeExplorer}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 text-xs font-bold transition active:scale-95"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Android Code (Kotlin/Compose)</span>
          </button>

          {/* Viewport Frame Toggle */}
          <button
            onClick={() => setUsePhoneFrame(prev => !prev)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition"
            title={usePhoneFrame ? 'Switch to Expanded View' : 'Switch to Android Phone Bezel'}
          >
            {usePhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex justify-center items-center">
        {usePhoneFrame ? (
          /* Realistic Android Phone Bezel (Pixel 8 / Galaxy S24 Luxury Chassis) */
          <div className="relative w-full max-w-[390px] h-[780px] bg-slate-950 rounded-[44px] p-3 shadow-2xl shadow-purple-950/40 ring-1 ring-slate-800 border-[7px] border-[#1F2432] flex flex-col overflow-hidden">
            {/* Speaker Ear-piece */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-700 rounded-full z-50 pointer-events-none" />

            {/* Android Device Status Bar */}
            <div className="relative h-7 w-full flex items-center justify-between px-5 text-[11px] font-semibold text-slate-300 select-none z-50 bg-black/40 backdrop-blur-sm shrink-0">
              <span className="font-mono tracking-tight">{currentTime}</span>

              {/* Front Camera Punch-Hole Cutout */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#0B0F19] ring-2 ring-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A2234]" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-purple-400">5G</span>
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Screen Viewport */}
            <div className="relative flex-1 w-full bg-slate-950 overflow-hidden flex flex-col rounded-[28px]">
              {children}
            </div>

            {/* Android Bottom Gesture Navigation Pill */}
            <div className="h-5 w-full flex items-center justify-center shrink-0 select-none">
              <div className="w-28 h-1 bg-slate-500 rounded-full opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ) : (
          /* Expanded Full-Window Mode */
          <div className="w-full max-w-4xl h-[780px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {children}
          </div>
        )}
      </main>

      {/* Download & Installation Guide Modal */}
      {isDownloadModalOpen && (
        <DownloadGuideModal
          onClose={() => setIsDownloadModalOpen(false)}
          onOpenCodeExplorer={onOpenCodeExplorer}
        />
      )}
    </div>
  );
};
