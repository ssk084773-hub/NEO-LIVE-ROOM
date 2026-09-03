import React from 'react';
import { Home, Radio, MessageCircle, User, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationBarProps {
  activeTab: 'home' | 'live' | 'messages' | 'profile';
  onTabChange: (tab: 'home' | 'live' | 'messages' | 'profile') => void;
  onOpenCreateRoom: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeTab,
  onTabChange,
  onOpenCreateRoom,
}) => {
  const { directConversations, currentUser } = useApp();

  const totalUnreadMessages = directConversations.reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );

  return (
    <div className="relative h-16 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 flex items-center justify-between select-none z-40 shrink-0">
      {/* Home Tab */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
          activeTab === 'home' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>

      {/* Live Feed Tab */}
      <button
        onClick={() => onTabChange('live')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
          activeTab === 'live' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Explore</span>
      </button>

      {/* Center "+ Live" Pill Button */}
      <div className="flex-1 flex justify-center -mt-5">
        <button
          onClick={onOpenCreateRoom}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition"
          title="Go Live"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Messages Tab */}
      <button
        onClick={() => onTabChange('messages')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 relative transition-colors ${
          activeTab === 'messages' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[9px] font-bold px-1 rounded-full ring-2 ring-slate-950">
              {totalUnreadMessages}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold">Chat</span>
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
          activeTab === 'profile' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-purple-400">
          <img src={currentUser.avatar} alt="Me" className="w-full h-full object-cover" />
        </div>
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </div>
  );
};
