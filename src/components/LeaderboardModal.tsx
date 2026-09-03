import React, { useState } from 'react';
import { Trophy, Crown, Flame, Globe, Sparkles, X } from 'lucide-react';
import { TOP_HOSTS_LEADERBOARD, TOP_GIFTERS_LEADERBOARD } from '../data/mockData';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'hosts' | 'gifters'>('hosts');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const list = tab === 'hosts' ? TOP_HOSTS_LEADERBOARD : TOP_GIFTERS_LEADERBOARD;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">NEO Hall of Fame</h3>
            <p className="text-[11px] text-slate-400">Top Creators & VIP Supporters</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Switcher */}
      <div className="px-4 pt-3 flex gap-2">
        <button
          onClick={() => setTab('hosts')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
            tab === 'hosts'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          Top Hosts 🎙️
        </button>
        <button
          onClick={() => setTab('gifters')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
            tab === 'gifters'
              ? 'bg-gradient-to-r from-amber-500 to-rose-500 border-amber-400 text-slate-950 shadow'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          Top Gifters 💎
        </button>
      </div>

      {/* Time Filter */}
      <div className="px-4 py-2 flex items-center justify-center gap-2 text-xs">
        {(['daily', 'weekly', 'monthly'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded-full capitalize font-semibold transition ${
              period === p
                ? 'bg-slate-800 text-purple-300 border border-purple-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {list.map((item, index) => {
          const isTop3 = index < 3;
          const rankColor =
            index === 0
              ? 'from-amber-400 to-yellow-600 text-slate-950'
              : index === 1
              ? 'from-slate-300 to-slate-400 text-slate-950'
              : index === 2
              ? 'from-amber-700 to-amber-900 text-white'
              : 'bg-slate-800 text-slate-400';

          return (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                isTop3
                  ? 'bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    isTop3 ? `bg-gradient-to-br ${rankColor} shadow-md` : rankColor
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-purple-500/40 shrink-0">
                  <img src={item.avatar} alt={item.username} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 fill-current filter drop-shadow" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{item.username}</span>
                    <span className="text-[9px] px-1 rounded bg-purple-600/60 text-white font-semibold">
                      Lv.{item.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span>{item.country}</span>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xs font-black text-amber-300">
                  {item.score.toLocaleString()}
                </div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                  {tab === 'hosts' ? 'Diamonds' : 'Coins Sent'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
