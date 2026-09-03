import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  X,
  Send,
  Gift as GiftIcon,
  Share2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  SwitchCamera,
  Volume2,
  VolumeX,
  Users,
  ShieldAlert,
  Crown,
  Sparkles,
  Info,
  Lock,
  MessageCircle,
  MoreVertical,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GiftTray } from './GiftTray';
import { LiveRoom } from '../types';

interface LiveRoomModalProps {
  room: LiveRoom;
  onClose: () => void;
  onOpenRecharge: () => void;
  onOpenReport: (targetType: 'user' | 'room', targetId: string, targetName: string) => void;
}

export const LiveRoomModal: React.FC<LiveRoomModalProps> = ({
  room,
  onClose,
  onOpenRecharge,
  onOpenReport,
}) => {
  const {
    currentUser,
    isBroadcasting,
    roomMessages,
    roomParticipants,
    sendRoomMessage,
    likeCurrentRoom,
    floatingHearts,
    activeGiftAlert,
    toggleMic,
    toggleCamera,
    switchCameraFacing,
    isMicMuted,
    isCameraOff,
    isFrontCamera,
    localMediaStream,
    followedHostIds,
    toggleFollowHost,
    updateRoomAnnouncement,
    muteParticipant,
    kickParticipant,
    banParticipant,
    addToast,
  } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [showGiftTray, setShowGiftTray] = useState(false);
  const [showModMenu, setShowModMenu] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState(room.announcement);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const isHost = room.hostId === currentUser.id;
  const isModerator = room.moderatorIds.includes(currentUser.id) || currentUser.role === 'admin' || isHost;
  const isFollowing = followedHostIds.includes(room.hostId);

  // Bind local media stream to video element if user is host or streaming
  useEffect(() => {
    if (videoRef.current && localMediaStream && !isCameraOff) {
      videoRef.current.srcObject = localMediaStream;
    }
  }, [localMediaStream, isCameraOff]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [roomMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendRoomMessage(chatInput);
    setChatInput('');
  };

  const handleVideoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    likeCurrentRoom(Math.max(10, Math.min(90, x)));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Room Link Copied', 'Share this live stream with your friends!', 'success');
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col select-none">
      {/* Background / Video Stream */}
      <div
        className="absolute inset-0 z-0 overflow-hidden cursor-pointer"
        onClick={handleVideoTap}
      >
        {isBroadcasting && localMediaStream && !isCameraOff ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isFrontCamera ? '-scale-x-100' : ''}`}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={room.coverImage}
              alt={room.title}
              className="w-full h-full object-cover filter brightness-75 scale-105 transition-transform duration-1000"
            />
            {/* Ambient Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-purple-900/20 via-transparent to-black/60 pointer-events-none" />

            {/* Audio room visualizer animation if audio type */}
            {room.type === 'audio' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl animate-glow-purple">
                    <img src={room.hostAvatar} alt={room.hostName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <span className="px-3 py-0.5 rounded-full bg-purple-600 text-[10px] font-bold tracking-wider uppercase text-white shadow">
                      Audio Live
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-6">
                  {[40, 70, 100, 60, 85, 45, 90, 30].map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-400 rounded-full animate-pulse"
                      style={{
                        height: `${height * 0.35}px`,
                        animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Hearts Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute bottom-28 animate-float-heart"
            style={{ left: `${heart.x}%`, color: heart.color }}
          >
            <Heart className="fill-current drop-shadow-lg" style={{ width: heart.size, height: heart.size }} />
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-30 pt-3 px-3 flex items-center justify-between pointer-events-auto">
        {/* Host Profile Capsule */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full p-1 pr-3 border border-white/10 max-w-[65%]">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-purple-400 shrink-0">
            <img src={room.hostAvatar} alt={room.hostName} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white truncate max-w-[85px]">{room.hostName}</span>
              <span className="text-[9px] px-1 rounded bg-purple-600/80 text-white font-semibold">
                Lv.{room.hostLevel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span className="text-amber-300 font-medium">★ {room.hostCountry}</span>
              <span>•</span>
              <span className="text-rose-400 font-medium">♥ {room.likeCount.toLocaleString()}</span>
            </div>
          </div>

          {!isHost && (
            <button
              onClick={() => toggleFollowHost(room.hostId)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ml-1 transition-all ${
                isFollowing
                  ? 'bg-slate-700/80 text-slate-300'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow hover:brightness-110 active:scale-95'
              }`}
            >
              {isFollowing ? 'Joined' : '+ Follow'}
            </button>
          )}
        </div>

        {/* Right Actions: Viewers, Controls & Exit */}
        <div className="flex items-center gap-1.5">
          {/* Viewers Counter Button */}
          <button
            onClick={() => setShowParticipants(true)}
            className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 text-xs text-white"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{room.viewerCount.toLocaleString()}</span>
          </button>

          {/* Moderator / Settings Dropdown */}
          {isModerator && (
            <button
              onClick={() => setShowModMenu(prev => !prev)}
              className="p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10"
              title="Moderator Controls"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}

          {/* Close Room */}
          <button
            onClick={onClose}
            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10 active:scale-95"
            title="Leave Room"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Room Announcement Banner (if any) */}
      {room.announcement && (
        <div className="relative z-20 mx-3 mt-2">
          <div className="bg-purple-950/60 backdrop-blur-md border border-purple-500/30 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] text-purple-200 truncate">{room.announcement}</span>
          </div>
        </div>
      )}

      {/* Active Gift Banner Alert */}
      <AnimatePresence>
        {activeGiftAlert && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="relative z-30 mx-3 mt-2 self-start"
          >
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/90 via-pink-900/90 to-slate-900/90 border border-pink-500/50 backdrop-blur-md shadow-lg shadow-pink-500/20">
              <img
                src={activeGiftAlert.senderAvatar}
                alt={activeGiftAlert.senderName}
                className="w-7 h-7 rounded-full object-cover border border-amber-400"
              />
              <div className="text-xs">
                <span className="font-bold text-amber-300">{activeGiftAlert.senderName}</span>
                <span className="text-slate-200"> sent </span>
                <span className="font-bold text-pink-300">{activeGiftAlert.gift.name}</span>
              </div>
              <span className="text-2xl filter drop-shadow animate-bounce">
                {activeGiftAlert.gift.icon}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Broadcaster Quick Camera / Mic Controls (if user is broadcaster) */}
      {isBroadcasting && (
        <div className="relative z-30 px-3 pb-2 flex items-center justify-center gap-2 pointer-events-auto">
          <button
            onClick={toggleMic}
            className={`p-2 rounded-full backdrop-blur-md border transition ${
              isMicMuted ? 'bg-rose-600/90 border-rose-400 text-white' : 'bg-black/50 border-white/20 text-white'
            }`}
            title="Toggle Mic"
          >
            {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleCamera}
            className={`p-2 rounded-full backdrop-blur-md border transition ${
              isCameraOff ? 'bg-rose-600/90 border-rose-400 text-white' : 'bg-black/50 border-white/20 text-white'
            }`}
            title="Toggle Camera"
          >
            {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>
          <button
            onClick={switchCameraFacing}
            className="p-2 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10"
            title="Flip Camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSpeakerOn(prev => !prev)}
            className="p-2 rounded-full bg-black/50 border border-white/20 text-white hover:bg-white/10"
            title="Speaker"
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Bottom Chat Overlay */}
      <div className="relative z-30 px-3 pb-2 pointer-events-auto max-w-full">
        {/* Messages Stream */}
        <div
          ref={chatScrollRef}
          className="h-44 overflow-y-auto space-y-1.5 pr-2 mask-gradient mb-2 scrollbar-none flex flex-col justify-end"
        >
          {roomMessages.map(msg => (
            <div key={msg.id} className="flex items-start gap-1.5 text-xs">
              {msg.type === 'system' ? (
                <div className="px-2.5 py-1 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-300 text-[11px] leading-snug">
                  {msg.text}
                </div>
              ) : msg.type === 'join' ? (
                <div className="px-2 py-0.5 rounded-full bg-black/40 text-emerald-400 text-[11px] flex items-center gap-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <span className="text-slate-400">joined</span>
                </div>
              ) : msg.type === 'gift' ? (
                <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-1.5">
                  <span className="font-bold text-amber-300">{msg.senderName}:</span>
                  <span>Sent {msg.giftName}</span>
                  <span className="text-base">{msg.giftIcon}</span>
                </div>
              ) : (
                <div className="px-2.5 py-1 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 text-white max-w-[85%] leading-relaxed flex items-center gap-1.5">
                  <span className="text-[10px] px-1 rounded bg-purple-600/70 font-semibold shrink-0">
                    Lv.{msg.senderLevel}
                  </span>
                  <span className="font-bold text-purple-300 shrink-0">{msg.senderName}:</span>
                  <span className="text-slate-100 break-words">{msg.text}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input and Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Say something friendly..."
              className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 pr-9"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-1.5 p-1 rounded-full bg-purple-600 text-white disabled:opacity-30 disabled:bg-slate-700 active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Gift Tray Button */}
          <button
            onClick={() => setShowGiftTray(true)}
            className="p-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition animate-bounce"
            title="Send Virtual Gift"
          >
            <GiftIcon className="w-4 h-4" />
          </button>

          {/* Like Heart Button */}
          <button
            onClick={() => likeCurrentRoom()}
            className="p-2.5 rounded-full bg-rose-600/90 text-white border border-rose-400/40 shadow-lg active:scale-90 transition"
            title="Send Likes"
          >
            <Heart className="w-4 h-4 fill-current text-white" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/10 active:scale-95"
            title="Share Room"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gift Tray Drawer */}
      <AnimatePresence>
        {showGiftTray && (
          <GiftTray
            onClose={() => setShowGiftTray(false)}
            onOpenRecharge={onOpenRecharge}
          />
        )}
      </AnimatePresence>

      {/* Moderator Controls Modal */}
      <AnimatePresence>
        {showModMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-x-4 top-20 z-50 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Host & Moderator Controls</span>
              </h4>
              <button onClick={() => setShowModMenu(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Room Announcement Notice:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={e => setNewAnnouncement(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      updateRoomAnnouncement(newAnnouncement);
                      setShowModMenu(false);
                    }}
                    className="px-3 py-1 bg-purple-600 rounded-lg text-xs font-bold text-white"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    setShowModMenu(false);
                    onOpenReport('room', room.id, room.title);
                  }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Report Room Infringement
                </button>
                {isHost && (
                  <button
                    onClick={onClose}
                    className="px-3 py-1 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-xs font-bold text-white"
                  >
                    End Live Stream
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Participants List Modal */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-x-0 bottom-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl p-4 max-h-[60vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Live Viewers ({roomParticipants.length})</span>
              </h4>
              <button onClick={() => setShowParticipants(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 space-y-2">
              {roomParticipants.map(participant => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={participant.avatar}
                      alt={participant.username}
                      className="w-8 h-8 rounded-full object-cover border border-purple-400/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{participant.username}</span>
                        {participant.role === 'host' && (
                          <span className="text-[9px] px-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            Host
                          </span>
                        )}
                        {participant.role === 'moderator' && (
                          <span className="text-[9px] px-1.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                            Mod
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Lv.{participant.level} Supporter</span>
                    </div>
                  </div>

                  {isModerator && participant.userId !== currentUser.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => muteParticipant(participant.userId)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-amber-400 text-[10px]"
                        title="Mute user"
                      >
                        Mute
                      </button>
                      <button
                        onClick={() => kickParticipant(participant.userId)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-rose-400 text-[10px]"
                        title="Kick user"
                      >
                        Kick
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
