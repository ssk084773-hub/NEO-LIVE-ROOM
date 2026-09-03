import React, { useState } from 'react';
import { Radio, Video, Mic, Search, Lock, Users, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveRoom } from '../types';

interface ExploreLiveScreenProps {
  onSelectRoom: (room: LiveRoom) => void;
  onOpenCreateRoom: () => void;
}

export const ExploreLiveScreen: React.FC<ExploreLiveScreenProps> = ({
  onSelectRoom,
  onOpenCreateRoom,
}) => {
  const { rooms } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'audio'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = rooms.filter(room => {
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    const matchesCat = categoryFilter === 'all' || room.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      room.title.toLowerCase().includes(search.toLowerCase()) ||
      room.hostName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-white scrollbar-none pb-4">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md p-4 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-base font-black text-white leading-tight">Explore Live Rooms</h3>
            <p className="text-[11px] text-slate-400">Discover talents, live chats & gaming</p>
          </div>
          <button
            onClick={onOpenCreateRoom}
            className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white shadow"
          >
            + Stream
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search channels..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Mode Selector (All vs Video vs Audio) */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 py-1 rounded-lg transition ${
              typeFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            All Streams
          </button>
          <button
            onClick={() => setTypeFilter('video')}
            className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
              typeFilter === 'video' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Live</span>
          </button>
          <button
            onClick={() => setTypeFilter('audio')}
            className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
              typeFilter === 'audio' ? 'bg-purple-600 text-white' : 'text-slate-400'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Audio Rooms</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {filtered.map(room => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow hover:border-purple-500/50 transition-all active:scale-[0.98]"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <img
                  src={room.coverImage}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded-md bg-rose-600/90 text-white text-[9px] font-black uppercase flex items-center gap-1">
                    LIVE
                  </span>
                  {room.type === 'audio' && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-600/90 text-white text-[9px] font-bold">
                      Audio
                    </span>
                  )}
                  {room.isPrivate && (
                    <span className="p-1 rounded bg-black/60 text-amber-300">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>{room.viewerCount}</span>
                </div>

                <div className="absolute bottom-2 inset-x-2">
                  <h5 className="font-bold text-xs text-white truncate drop-shadow">
                    {room.title}
                  </h5>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-300">
                    <span className="truncate">@{room.hostName}</span>
                    <span className="text-purple-300 font-semibold">{room.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
