import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Image as ImageIcon,
  MoreVertical,
  CheckCheck,
  ChevronLeft,
  X,
  Smile,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DirectConversation } from '../types';

interface MessagesModalProps {
  onClose: () => void;
  onOpenReport: (targetType: 'user', targetId: string, targetName: string) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({ onClose, onOpenReport }) => {
  const {
    directConversations,
    directMessages,
    sendDirectMessage,
    currentUser,
    blockUser,
  } = useApp();

  const [activeConv, setActiveConv] = useState<DirectConversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConvs = directConversations.filter(c =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessages = activeConv ? directMessages[activeConv.participantId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    sendDirectMessage(activeConv.participantId, inputText.trim());
    setInputText('');

    // Simulate friend typing and responding
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sendDirectMessage(
        activeConv.participantId,
        'Got your message! See you in the next live stream 🌟'
      );
    }, 2800);
  };

  const handleSendImage = () => {
    if (!activeConv) return;
    const sampleImages = [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    ];
    const picked = sampleImages[Math.floor(Math.random() * sampleImages.length)];
    sendDirectMessage(activeConv.participantId, '', picked);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* If conversation is open */}
      {activeConv ? (
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveConv(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-purple-500/40">
                <img src={activeConv.participantAvatar} alt={activeConv.participantName} className="w-full h-full object-cover" />
                {activeConv.participantOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">{activeConv.participantName}</h4>
                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenReport('user', activeConv.participantId, activeConv.participantName)}
                className="text-[10px] px-2 py-1 bg-slate-800 text-amber-400 rounded-lg hover:bg-slate-700"
              >
                Report
              </button>
              <button
                onClick={() => {
                  blockUser(activeConv.participantId);
                  setActiveConv(null);
                }}
                className="text-[10px] px-2 py-1 bg-slate-800 text-rose-400 rounded-lg hover:bg-slate-700"
              >
                Block
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="attachment"
                        className="rounded-xl mt-1 max-h-48 object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="text-[11px] text-purple-400 italic flex items-center gap-1">
                <span>{activeConv.participantName} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2">
            <button
              type="button"
              onClick={handleSendImage}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              title="Share photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-purple-600 text-white disabled:opacity-30 active:scale-95 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Direct Messages</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {filteredConvs.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className="w-full p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-purple-500/40 shrink-0">
                    <img src={conv.participantAvatar} alt={conv.participantName} className="w-full h-full object-cover" />
                    {conv.participantOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{conv.participantName}</h5>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">{conv.lastTimestamp}</span>
                  {conv.unreadCount > 0 && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-[10px] font-bold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
