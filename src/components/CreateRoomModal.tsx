import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Video, Mic, Lock, Globe, Sparkles, X, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveRoom } from '../types';

interface CreateRoomModalProps {
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose }) => {
  const { createLiveRoom, currentUser } = useApp();

  const [title, setTitle] = useState(`${currentUser.displayName}'s Live Studio 🚀`);
  const [category, setCategory] = useState<LiveRoom['category']>('Music');
  const [type, setType] = useState<'video' | 'audio'>('video');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const categories: LiveRoom['category'][] = [
    'Music',
    'Gaming',
    'Chat',
    'Dancing',
    'Talent',
    'PK Battle',
    'Education',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createLiveRoom({
      title: title.trim(),
      category,
      type,
      isPrivate,
      password: isPrivate ? password : undefined,
    });

    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">Start Live Broadcast</h3>
            <p className="text-[11px] text-slate-400">Reach viewers worldwide on NEO</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Stream Title */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Live Stream Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chill Beats, Late Night Q&A..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Room Type: Video vs Audio */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Broadcast Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('video')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                type === 'video'
                  ? 'bg-purple-950/40 border-purple-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Video className="w-4 h-4 text-purple-400" />
              <div className="text-left">
                <span className="text-xs font-bold block">Video Live</span>
                <span className="text-[10px] text-slate-400">HD Camera & Mic</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('audio')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition ${
                type === 'audio'
                  ? 'bg-purple-950/40 border-purple-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Mic className="w-4 h-4 text-pink-400" />
              <div className="text-left">
                <span className="text-xs font-bold block">Audio Room</span>
                <span className="text-[10px] text-slate-400">Voice-Only Chat</span>
              </div>
            </button>
          </div>
        </div>

        {/* Category selection */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  category === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy: Public vs Private with Password */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">
            Access Privacy
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                !isPrivate
                  ? 'bg-purple-950/40 border-purple-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">Public (Open)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`p-3 rounded-xl border flex items-center gap-2 transition ${
                isPrivate
                  ? 'bg-purple-950/40 border-purple-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">Private (Password)</span>
            </button>
          </div>

          {isPrivate && (
            <div className="mt-2.5">
              <input
                type="password"
                required={isPrivate}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter 4-digit room entry PIN / password"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Go Live Now</span>
          </button>
        </div>
      </form>
    </div>
  );
};
