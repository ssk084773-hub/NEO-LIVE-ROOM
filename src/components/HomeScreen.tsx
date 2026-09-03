import React, { useState } from 'react';
import {
  Search,
  Flame,
  Sparkles,
  Users,
  Trophy,
  Bell,
  Radio,
  Lock,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveRoom } from '../types';

interface HomeScreenProps {
  onSelectRoom: (room: LiveRoom) => void;
  onOpenLeaderboard: () => void;
  onOpenCreateRoom: () => void;
  onOpenAuth: () => void;
  onOpenWallet: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectRoom,
  onOpenLeaderboard,
  onOpenCreateRoom,
  onOpenAuth,
  onOpenWallet,
}) => {
  const { rooms, followedHostIds, currentUser } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFeedTab, setActiveFeedTab] = useState<'recommended' | 'popular' | 'following'>('recommended');

  const categories = ['All', 'Music', 'Gaming', 'Chat', 'Dancing', 'Talent', 'PK Battle', 'Education'];

  // Filtered rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.hostName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'All' || room.category === activeCategory;

    if (!matchesSearch || !matchesCategory) return false;

    if (activeFeedTab === 'following') {
      return followedHostIds.includes(room.hostId);
    }
    return true;
  });

  const popularRooms = [...rooms].sort((a, b) => b.viewerCount - a.viewerCount);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-white scrollbar-none pb-4">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-4 pt-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-base font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent tracking-wider">
              NEO LIVE
            </span>
          </div>

          {/* Quick Icons: Leaderboard & Auth/User */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLeaderboard}
              className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800 transition"
              title="Hall of Fame Leaderboard"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAuth}
              className="relative w-7 h-7 rounded-full overflow-hidden border border-purple-500"
              title="Account Settings"
            >
              <img src={currentUser.avatar} alt={currentUser.displayName} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-2.5 relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search streamers, topics, or games..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Home Feed Sub-Tabs */}
        <div className="flex items-center gap-6 mt-3 text-xs font-bold border-b border-slate-900">
          <button
            onClick={() => setActiveFeedTab('recommended')}
            className={`pb-1.5 relative transition ${
              activeFeedTab === 'recommended'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Recommended
            {activeFeedTab === 'recommended' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveFeedTab('popular')}
            className={`pb-1.5 relative transition ${
              activeFeedTab === 'popular' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Popular 🔥
            {activeFeedTab === 'popular' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveFeedTab('following')}
            className={`pb-1.5 relative transition ${
              activeFeedTab === 'following'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Following ({followedHostIds.length})
            {activeFeedTab === 'following' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Banner / Promotion */}
      <div className="p-4 pb-2">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-950 to-pink-900 p-4 border border-purple-500/30 shadow-lg">
          <div className="relative z-10 max-w-[70%]">
            <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-extrabold text-[9px] uppercase tracking-wider border border-pink-500/30">
              Creator Gala 2026
            </span>
            <h3 className="font-black text-sm text-white mt-1 leading-tight">
              NEO Super Star Streamers Battle
            </h3>
            <p className="text-[10px] text-purple-200 mt-1">
              Top 10 broadcasters receive verified badge & bonus rewards!
            </p>
          </div>
          <button
            onClick={onOpenCreateRoom}
            className="absolute right-3 bottom-3 z-10 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-extrabold text-[11px] shadow hover:bg-slate-100 active:scale-95 transition"
          >
            Go Live
          </button>
          <div className="absolute right-0 top-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              activeCategory === cat
                ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Online Streamers Avatar Strip */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300">Live Broadcasters</span>
          <span className="text-[10px] text-purple-400 flex items-center gap-0.5">
            <Radio className="w-3 h-3 animate-pulse text-rose-400" />
            <span>{rooms.length} Broadcasting</span>
          </span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="flex flex-col items-center gap-1 shrink-0 group"
            >
              <div className="relative w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 group-hover:scale-105 transition-transform">
                <img
                  src={room.hostAvatar}
                  alt={room.hostName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-950"
                />
                <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-rose-600 text-white text-[8px] font-extrabold rounded-full uppercase">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-300 truncate max-w-[56px]">
                {room.hostName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Rooms 2-Column Grid */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{activeCategory === 'All' ? 'Hot Live Rooms' : `${activeCategory} Streams`}</span>
          </h4>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60 my-2">
            <Radio className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-300">No active streams found</p>
            <p className="text-[11px] text-slate-500 mt-1">Be the first to start a live stream!</p>
            <button
              onClick={onOpenCreateRoom}
              className="mt-3 px-4 py-1.5 rounded-xl bg-purple-600 font-bold text-xs text-white"
            >
              Start Streaming
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer shadow hover:border-purple-500/50 transition-all active:scale-[0.98]"
              >
                {/* Cover Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={room.coverImage}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-rose-600/90 text-white text-[9px] font-black uppercase flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </span>
                    {room.type === 'audio' && (
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-600/90 text-white text-[9px] font-bold">
                        Audio
                      </span>
                    )}
                    {room.isPrivate && (
                      <span className="p-1 rounded-md bg-black/60 text-amber-300">
                        <Lock className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Top Right Viewers */}
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-cyan-400" />
                    <span>{room.viewerCount.toLocaleString()}</span>
                  </div>

                  {/* Bottom Room Info */}
                  <div className="absolute bottom-2 inset-x-2">
                    <h5 className="font-bold text-xs text-white truncate drop-shadow">
                      {room.title}
                    </h5>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-300">
                      <div className="flex items-center gap-1 truncate">
                        <span className="truncate">@{room.hostName}</span>
                        <span className="text-[8px] px-1 bg-purple-600/80 rounded font-bold">
                          Lv.{room.hostLevel}
                        </span>
                      </div>
                      <span className="text-rose-400 font-bold flex items-center gap-0.5 shrink-0">
                        ♥ {room.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
