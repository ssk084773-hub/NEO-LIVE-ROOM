import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  LiveRoom,
  ChatMessage,
  Gift,
  Transaction,
  WithdrawalRequest,
  CreatorApplication,
  NotificationItem,
  ReportRecord,
  RoomParticipant,
  DirectConversation,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ROOMS,
  INITIAL_GIFTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { soundFx } from '../utils/audio';

export interface FloatingHeart {
  id: string;
  x: number;
  color: string;
  size: number;
}

export interface FloatingGiftAlert {
  id: string;
  senderName: string;
  senderAvatar: string;
  gift: Gift;
}

interface AppContextType {
  // Auth & User
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  registerUser: (data: Partial<User>) => Promise<boolean>;
  logout: () => void;
  logoutUser: () => void;
  updateProfile: (data: Partial<User>) => void;
  switchRole: (role: 'user' | 'creator' | 'admin') => void;
  requestAccountDeletion: () => void;

  // Live Rooms
  rooms: LiveRoom[];
  activeRoom: LiveRoom | null;
  currentRoom: LiveRoom | null;
  setCurrentRoom: (room: LiveRoom | null) => void;
  isBroadcasting: boolean;
  joinRoom: (room: LiveRoom, password?: string) => boolean;
  leaveRoom: () => void;
  createLiveRoom: (roomData: {
    title: string;
    category: LiveRoom['category'];
    type: 'video' | 'audio';
    isPrivate: boolean;
    password?: string;
    coverImage?: string;
  }) => LiveRoom;
  endLiveBroadcast: () => void;

  // Room Interactions
  roomMessages: ChatMessage[];
  roomParticipants: RoomParticipant[];
  sendRoomMessage: (text: string, image?: string) => void;
  sendGiftToHost: (gift: Gift) => boolean;
  likeCurrentRoom: (x?: number) => void;
  floatingHearts: FloatingHeart[];
  activeGiftAlert: FloatingGiftAlert | null;

  // Host / Mod Controls
  toggleMic: () => void;
  toggleCamera: () => void;
  switchCameraFacing: () => void;
  isMicMuted: boolean;
  isCameraOff: boolean;
  isFrontCamera: boolean;
  localMediaStream: MediaStream | null;
  updateRoomAnnouncement: (announcement: string) => void;
  muteParticipant: (userId: string) => void;
  kickParticipant: (userId: string) => void;
  banParticipant: (userId: string) => void;

  // Follow & Social
  followedHostIds: string[];
  toggleFollowHost: (hostId: string) => void;

  // Wallet & Monetization
  coins: number;
  diamonds: number;
  transactions: Transaction[];
  rechargeCoins: (packageId: string, coins: number, priceUsd: number) => Promise<boolean>;
  requestWithdrawal: (amountUsd: number, method: WithdrawalRequest['method'], accountDetails: string) => Promise<boolean>;
  withdrawalRequests: WithdrawalRequest[];

  // 1-on-1 Messages
  directConversations: DirectConversation[];
  directMessages: Record<string, ChatMessage[]>;
  sendDirectMessage: (participantId: string, text: string, imageUrl?: string) => void;

  // Creator Application
  creatorApplications: CreatorApplication[];
  submitCreatorApplication: (app: Omit<CreatorApplication, 'id' | 'status' | 'submittedAt'>) => void;

  // Moderation & Safety
  reports: ReportRecord[];
  blockedUserIds: string[];
  reportEntity: (targetType: ReportRecord['targetType'], targetId: string, targetName: string, reason: string, details: string) => void;
  submitReport: (targetType: ReportRecord['targetType'], targetId: string, targetName: string, reason: string, details: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning') => void;
  activeToast: { title: string; message: string; type: string } | null;

  // Admin Actions
  adminApproveCreator: (appId: string) => void;
  adminRejectCreator: (appId: string) => void;
  adminApproveWithdrawal: (withdrawalId: string) => void;
  adminRejectWithdrawal: (withdrawalId: string, reason: string) => void;
  adminBanUser: (userId: string) => void;
  adminUnbanUser: (userId: string) => void;
  adminForceEndRoom: (roomId: string) => void;
  adminBroadcast: (title: string, message: string) => void;

  // Device Simulator Mode
  isAndroidFrame: boolean;
  toggleAndroidFrame: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [rooms, setRooms] = useState<LiveRoom[]>(INITIAL_ROOMS);
  const [activeRoom, setActiveRoom] = useState<LiveRoom | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  // Local media stream for real camera/mic preview during live broadcasting or watching
  const [localMediaStream, setLocalMediaStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(true);

  // Room state
  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [roomParticipants, setRoomParticipants] = useState<RoomParticipant[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [activeGiftAlert, setActiveGiftAlert] = useState<FloatingGiftAlert | null>(null);
  const [followedHostIds, setFollowedHostIds] = useState<string[]>(['host-101', 'host-102']);

  // Wallet
  const [coins, setCoins] = useState<number>(INITIAL_USER.coins);
  const [diamonds, setDiamonds] = useState<number>(INITIAL_USER.earningsDiamonds);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: 'wth-demo-1',
      userId: INITIAL_USER.id,
      username: INITIAL_USER.username,
      amountUsd: 50,
      diamondsDeducted: 5000,
      method: 'PayPal',
      accountDetails: 'alex.rider.pay@email.com',
      status: 'paid',
      createdAt: '2026-08-28T14:22:00Z',
      processedAt: '2026-08-28T16:00:00Z',
    },
  ]);

  // Messages & Moderation
  const [directConversations, setDirectConversations] = useState<DirectConversation[]>([
    {
      id: 'conv-1',
      participantId: 'host-101',
      participantName: 'Elena_Vibes',
      participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      participantOnline: true,
      lastMessage: 'Thanks so much for the Imperial Crown earlier! 👑',
      lastTimestamp: '10m ago',
      unreadCount: 1,
    },
    {
      id: 'conv-2',
      participantId: 'host-102',
      participantName: 'CyberKai_Pro',
      participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      participantOnline: true,
      lastMessage: 'Ready for our PK battle stream tomorrow?',
      lastTimestamp: '2h ago',
      unreadCount: 0,
    },
  ]);

  const [directMessages, setDirectMessages] = useState<Record<string, ChatMessage[]>>({
    'host-101': [
      {
        id: 'dm-1',
        senderId: 'host-101',
        senderName: 'Elena_Vibes',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        senderLevel: 28,
        text: 'Hey Alex! Loved your new remix! Will play it in tonight stream 🎶',
        timestamp: '11:15 AM',
        type: 'text',
      },
      {
        id: 'dm-2',
        senderId: 'usr-neo-777',
        senderName: 'AlexRider_Live',
        senderAvatar: INITIAL_USER.avatar,
        senderLevel: 14,
        text: 'Awesome, Elena! Sending you the high-bitrate master track now.',
        timestamp: '11:18 AM',
        type: 'text',
      },
      {
        id: 'dm-3',
        senderId: 'host-101',
        senderName: 'Elena_Vibes',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        senderLevel: 28,
        text: 'Thanks so much for the Imperial Crown earlier! 👑',
        timestamp: '11:45 AM',
        type: 'text',
      },
    ],
  });

  const [creatorApplications, setCreatorApplications] = useState<CreatorApplication[]>([
    {
      id: 'app-991',
      userId: 'usr-applicant-1',
      username: 'Sarah_Vocalist',
      fullName: 'Sarah Jenkins',
      governmentIdType: 'Passport',
      idNumber: 'P98421092',
      socialLinks: 'instagram.com/sarahsing',
      bio: 'Professional jazz and acoustic singer with 5 years live performance experience.',
      talentCategory: 'Music',
      status: 'pending',
      submittedAt: '2026-09-02T14:30:00Z',
    },
  ]);

  const [reports, setReports] = useState<ReportRecord[]>([
    {
      id: 'rep-1',
      reporterId: 'usr-102',
      targetType: 'user',
      targetId: 'troll-bot-99',
      targetName: 'SuspiciousUser44',
      reason: 'Spam / Advertising',
      details: 'Spamming external casino links in Elena chat room repeatedly.',
      status: 'pending',
      timestamp: '2026-09-03T10:00:00Z',
    },
  ]);

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: string } | null>(null);
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(true);

  const addToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setActiveToast({ title, message, type });
    soundFx.playNotify();
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  }, []);

  // Quick switch role for testing
  const switchRole = useCallback((role: 'user' | 'creator' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(prev => ({ ...prev, role: 'admin', isCreator: true, isVerified: true, creatorLevel: 50 }));
      addToast('Role Switched', 'You are now an Administrator with full moderating permissions.', 'info');
    } else if (role === 'creator') {
      setCurrentUser(prev => ({ ...prev, role: 'creator', isCreator: true, isVerified: true, creatorLevel: 14 }));
      addToast('Role Switched', 'You are now a Creator / Host with live broadcasting rights.', 'info');
    } else {
      setCurrentUser(prev => ({ ...prev, role: 'user', isCreator: false, creatorLevel: 1 }));
      addToast('Role Switched', 'You are now a standard Viewer / Community member.', 'info');
    }
  }, [addToast]);

  // Auth methods
  const loginWithEmail = async (email: string, _pass: string) => {
    setCurrentUser(prev => ({ ...prev, email, isOnline: true }));
    setIsAuthenticated(true);
    addToast('Welcome Back!', `Signed in as ${email}`, 'success');
    return true;
  };

  const loginWithPhone = async (phone: string, _otp: string) => {
    setCurrentUser(prev => ({ ...prev, phone, isOnline: true }));
    setIsAuthenticated(true);
    addToast('Phone Verified!', `Signed in with ${phone}`, 'success');
    return true;
  };

  const loginWithGoogle = async () => {
    setCurrentUser(prev => ({ ...prev, isOnline: true }));
    setIsAuthenticated(true);
    addToast('Google Sign-In', 'Successfully signed in via Google Account', 'success');
    return true;
  };

  const registerUser = async (data: Partial<User>) => {
    setCurrentUser(prev => ({
      ...prev,
      ...data,
      id: `usr-${Date.now()}`,
      coins: 100, // Welcome bonus
      earningsDiamonds: 0,
      referralCode: `NEO${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    }));
    setIsAuthenticated(true);
    addToast('Welcome to NEO!', 'Account created with 100 free bonus coins!', 'success');
    return true;
  };

  // Leave Room
  const leaveRoom = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getTracks().forEach(track => track.stop());
      setLocalMediaStream(null);
    }
    setActiveRoom(null);
    setIsBroadcasting(false);
    setRoomMessages([]);
    setRoomParticipants([]);
    setFloatingHearts([]);
  }, [localMediaStream]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    leaveRoom();
    addToast('Signed Out', 'You have been safely signed out.', 'info');
  }, [leaveRoom, addToast]);

  const logoutUser = useCallback(() => {
    logout();
  }, [logout]);

  const requestAccountDeletion = useCallback(() => {
    logout();
    addToast('Account Deletion Queued', 'Your request has been queued. Personal data and profile will be permanently deleted within 30 days per GDPR.', 'info');
  }, [logout, addToast]);

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    addToast('Profile Updated', 'Your profile changes have been saved.', 'success');
  };

  // Join Room
  const joinRoom = useCallback((room: LiveRoom, password?: string): boolean => {
    if (room.isPrivate && room.password && room.password !== password) {
      addToast('Access Denied', 'Incorrect room password', 'warning');
      return false;
    }

    setActiveRoom(room);
    setIsBroadcasting(false);

    // Initial messages for this room
    setRoomMessages([
      {
        id: `sys-${Date.now()}`,
        roomId: room.id,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        senderLevel: 99,
        text: `Welcome to ${room.title}! Please adhere to Community Guidelines.`,
        timestamp: 'Just now',
        type: 'system',
      },
      {
        id: `join-${Date.now()}`,
        roomId: room.id,
        senderId: currentUser.id,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.avatar,
        senderLevel: currentUser.creatorLevel || 5,
        text: 'joined the room',
        timestamp: 'Just now',
        type: 'join',
      },
    ]);

    // Initial participants
    setRoomParticipants([
      {
        id: `part-${room.hostId}`,
        userId: room.hostId,
        username: room.hostName,
        avatar: room.hostAvatar,
        level: room.hostLevel,
        role: 'host',
        joinedAt: room.createdAt,
        isMuted: false,
      },
      {
        id: `part-${currentUser.id}`,
        userId: currentUser.id,
        username: currentUser.displayName,
        avatar: currentUser.avatar,
        level: currentUser.creatorLevel || 5,
        role: 'viewer',
        joinedAt: new Date().toISOString(),
        isMuted: false,
      },
      {
        id: 'part-viewer-1',
        userId: 'v-101',
        username: 'CyberFan99',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        level: 12,
        role: 'viewer',
        joinedAt: '10m ago',
        isMuted: false,
      },
      {
        id: 'part-viewer-2',
        userId: 'v-102',
        username: 'Luna_Cosmos',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
        level: 21,
        role: 'moderator',
        joinedAt: '25m ago',
        isMuted: false,
      },
    ]);

    return true;
  }, [currentUser, addToast]);

  // Set / Clear Current Room
  const setCurrentRoom = useCallback((room: LiveRoom | null) => {
    if (room) {
      joinRoom(room);
    } else {
      leaveRoom();
    }
  }, [joinRoom, leaveRoom]);

  // Create Live Room & Start Broadcasting
  const createLiveRoom = useCallback((roomData: {
    title: string;
    category: LiveRoom['category'];
    type: 'video' | 'audio';
    isPrivate: boolean;
    password?: string;
    coverImage?: string;
  }): LiveRoom => {
    const newRoom: LiveRoom = {
      id: `room-${Date.now()}`,
      hostId: currentUser.id,
      hostName: currentUser.displayName,
      hostAvatar: currentUser.avatar,
      hostCountry: currentUser.country,
      hostLevel: currentUser.creatorLevel || 1,
      title: roomData.title,
      category: roomData.category,
      type: roomData.type,
      isPrivate: roomData.isPrivate,
      password: roomData.password,
      coverImage: roomData.coverImage || currentUser.avatar,
      viewerCount: 1,
      likeCount: 0,
      status: 'live',
      announcement: 'Welcome to my official live room on NEO!',
      streamChannelId: `neo_stream_${currentUser.id}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      tags: [roomData.category, roomData.type === 'video' ? 'VideoLive' : 'AudioLive'],
      moderatorIds: [],
      mutedUserIds: [],
      bannedUserIds: [],
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);
    setIsBroadcasting(true);

    // Request actual local camera/mic media if available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: roomData.type === 'video',
          audio: true,
        })
        .then(stream => {
          setLocalMediaStream(stream);
        })
        .catch(err => {
          console.warn('Camera/Mic permission fallback in sandboxed preview:', err);
        });
    }

    setRoomMessages([
      {
        id: `sys-${Date.now()}`,
        roomId: newRoom.id,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        senderLevel: 99,
        text: 'Your live broadcast has started! You are live to the world.',
        timestamp: 'Just now',
        type: 'system',
      },
    ]);

    setRoomParticipants([
      {
        id: `part-${currentUser.id}`,
        userId: currentUser.id,
        username: currentUser.displayName,
        avatar: currentUser.avatar,
        level: currentUser.creatorLevel || 1,
        role: 'host',
        joinedAt: new Date().toISOString(),
        isMuted: false,
      },
    ]);

    addToast('Broadcast Live!', 'You are now streaming to NEO Live Room.', 'success');
    return newRoom;
  }, [currentUser, addToast]);

  const endLiveBroadcast = useCallback(() => {
    if (activeRoom) {
      setRooms(prev => prev.filter(r => r.id !== activeRoom.id));
    }
    leaveRoom();
    addToast('Broadcast Ended', 'Your live session summary has been recorded.', 'info');
  }, [activeRoom, leaveRoom, addToast]);

  // Send Room Message
  const sendRoomMessage = useCallback((text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      roomId: activeRoom?.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderLevel: currentUser.creatorLevel || 5,
      text: text.trim(),
      imageUrl: image,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setRoomMessages(prev => [...prev, newMsg]);
  }, [activeRoom, currentUser]);

  // Send Gift To Host
  const sendGiftToHost = useCallback((gift: Gift): boolean => {
    if (coins < gift.cost) {
      addToast('Insufficient Coins', 'Recharge your wallet to send this gift.', 'warning');
      return false;
    }

    // Deduct coins from user
    setCoins(prev => prev - gift.cost);

    // Audio cue
    soundFx.playGift();

    // Gift animation burst
    confetti({
      particleCount: gift.cost >= 500 ? 120 : 40,
      spread: gift.cost >= 500 ? 100 : 60,
      origin: { y: 0.7 },
      colors: [gift.color, '#ffffff', '#fbbf24'],
    });

    // If active room host is not current user, credit diamonds to host
    if (activeRoom && activeRoom.hostId === currentUser.id) {
      setDiamonds(prev => prev + gift.diamondYield);
    }

    // Add gift alert banner
    setActiveGiftAlert({
      id: `alert-${Date.now()}`,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      gift,
    });

    setTimeout(() => {
      setActiveGiftAlert(null);
    }, 3800);

    // Add chat message for gift
    const giftMsg: ChatMessage = {
      id: `gift-${Date.now()}`,
      roomId: activeRoom?.id,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderLevel: currentUser.creatorLevel || 5,
      giftId: gift.id,
      giftName: gift.name,
      giftIcon: gift.icon,
      giftCost: gift.cost,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'gift',
    };
    setRoomMessages(prev => [...prev, giftMsg]);

    // Ledger transaction
    const newTx: Transaction = {
      id: `tx-gift-${Date.now()}`,
      userId: currentUser.id,
      amount: gift.cost,
      currency: 'coins',
      type: 'gift_sent',
      status: 'completed',
      referenceId: activeRoom?.id,
      createdAt: new Date().toISOString(),
      note: `Sent ${gift.name} ${gift.icon} to ${activeRoom?.hostName || 'Host'}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    return true;
  }, [coins, activeRoom, currentUser, addToast]);

  // Like current room with floating heart
  const likeCurrentRoom = useCallback((x?: number) => {
    soundFx.playLike();
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#06b6d4', '#eab308'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const posX = x !== undefined ? x : Math.floor(Math.random() * 80) + 10;

    const newHeart: FloatingHeart = {
      id: `heart-${Date.now()}-${Math.random()}`,
      x: posX,
      color: randomColor,
      size: Math.floor(Math.random() * 12) + 24,
    };

    setFloatingHearts(prev => [...prev, newHeart]);

    // Increment like count
    if (activeRoom) {
      setActiveRoom(prev => prev ? { ...prev, likeCount: prev.likeCount + 1 } : null);
    }

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1900);
  }, [activeRoom]);

  // Toggle Camera / Mic controls
  const toggleMic = useCallback(() => {
    setIsMicMuted(prev => {
      const next = !prev;
      if (localMediaStream) {
        localMediaStream.getAudioTracks().forEach(t => {
          t.enabled = !next;
        });
      }
      return next;
    });
  }, [localMediaStream]);

  const toggleCamera = useCallback(() => {
    setIsCameraOff(prev => {
      const next = !prev;
      if (localMediaStream) {
        localMediaStream.getVideoTracks().forEach(t => {
          t.enabled = !next;
        });
      }
      return next;
    });
  }, [localMediaStream]);

  const switchCameraFacing = useCallback(() => {
    setIsFrontCamera(prev => !prev);
    addToast('Camera Flipped', isFrontCamera ? 'Switched to Rear Camera' : 'Switched to Front Camera', 'info');
  }, [isFrontCamera, addToast]);

  // Room host controls
  const updateRoomAnnouncement = useCallback((announcement: string) => {
    if (!activeRoom) return;
    setActiveRoom(prev => prev ? { ...prev, announcement } : null);
    setRooms(prev => prev.map(r => r.id === activeRoom.id ? { ...r, announcement } : r));
    addToast('Announcement Updated', 'Broadcasting new room notice to all viewers', 'success');
  }, [activeRoom, addToast]);

  const muteParticipant = useCallback((userId: string) => {
    setRoomParticipants(prev =>
      prev.map(p => p.userId === userId ? { ...p, isMuted: true } : p)
    );
    addToast('Participant Muted', 'User has been muted by moderator.', 'info');
  }, [addToast]);

  const kickParticipant = useCallback((userId: string) => {
    setRoomParticipants(prev => prev.filter(p => p.userId !== userId));
    addToast('Participant Removed', 'User has been kicked from the room.', 'info');
  }, [addToast]);

  const banParticipant = useCallback((userId: string) => {
    kickParticipant(userId);
    if (activeRoom) {
      setActiveRoom(prev => prev ? { ...prev, bannedUserIds: [...prev.bannedUserIds, userId] } : null);
    }
    addToast('Participant Banned', 'User has been permanently banned from this room.', 'warning');
  }, [activeRoom, kickParticipant, addToast]);

  // Follow host
  const toggleFollowHost = useCallback((hostId: string) => {
    setFollowedHostIds(prev => {
      const isFollowing = prev.includes(hostId);
      if (isFollowing) {
        addToast('Unfollowed', 'Removed host from your following list', 'info');
        return prev.filter(id => id !== hostId);
      } else {
        soundFx.playNotify();
        addToast('Following!', 'You will be notified when this host goes live.', 'success');
        return [...prev, hostId];
      }
    });
  }, [addToast]);

  // Recharge Coins via Google Play Billing simulation
  const rechargeCoins = async (_packageId: string, packageCoins: number, priceUsd: number): Promise<boolean> => {
    soundFx.playCoin();
    setCoins(prev => prev + packageCoins);

    const newTx: Transaction = {
      id: `tx-gpa-${Date.now()}`,
      userId: currentUser.id,
      amount: packageCoins,
      currency: 'coins',
      type: 'recharge',
      status: 'completed',
      referenceId: `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: 'Google Play Billing',
      createdAt: new Date().toISOString(),
      note: `Recharge of ${packageCoins} Coins ($${priceUsd.toFixed(2)} USD)`,
    };

    setTransactions(prev => [newTx, ...prev]);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#3b82f6'],
    });

    addToast('Payment Successful', `Added ${packageCoins} Coins via Google Play Billing.`, 'success');
    return true;
  };

  // Request Creator Withdrawal
  const requestWithdrawal = async (
    amountUsd: number,
    method: WithdrawalRequest['method'],
    accountDetails: string
  ): Promise<boolean> => {
    const requiredDiamonds = amountUsd * 100;
    if (diamonds < requiredDiamonds) {
      addToast('Insufficient Diamonds', `You need ${requiredDiamonds} Diamonds to withdraw $${amountUsd} USD.`, 'warning');
      return false;
    }

    if (amountUsd < 25) {
      addToast('Minimum Threshold', 'Minimum withdrawal threshold is $25.00 USD.', 'warning');
      return false;
    }

    // Deduct diamonds
    setDiamonds(prev => prev - requiredDiamonds);

    const newWth: WithdrawalRequest = {
      id: `wth-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      amountUsd,
      diamondsDeducted: requiredDiamonds,
      method,
      accountDetails,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWithdrawalRequests(prev => [newWth, ...prev]);

    const newTx: Transaction = {
      id: `tx-wth-${Date.now()}`,
      userId: currentUser.id,
      amount: amountUsd,
      currency: 'usd',
      type: 'withdrawal',
      status: 'pending',
      referenceId: newWth.id,
      paymentMethod: method,
      createdAt: new Date().toISOString(),
      note: `Withdrawal request for $${amountUsd.toFixed(2)} USD to ${method}`,
    };

    setTransactions(prev => [newTx, ...prev]);
    addToast('Withdrawal Submitted', `Requested $${amountUsd} USD via ${method}. Under review.`, 'success');
    return true;
  };

  // Direct 1-on-1 Messages
  const sendDirectMessage = useCallback((participantId: string, text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;

    const newMsg: ChatMessage = {
      id: `dm-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      senderLevel: currentUser.creatorLevel || 5,
      text: text.trim(),
      imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      recipientId: participantId,
    };

    setDirectMessages(prev => ({
      ...prev,
      [participantId]: [...(prev[participantId] || []), newMsg],
    }));

    setDirectConversations(prev =>
      prev.map(c =>
        c.participantId === participantId
          ? { ...c, lastMessage: text.trim() || 'Sent an image', lastTimestamp: 'Just now' }
          : c
      )
    );
  }, [currentUser]);

  // Creator Application
  const submitCreatorApplication = useCallback((app: Omit<CreatorApplication, 'id' | 'status' | 'submittedAt'>) => {
    const newApp: CreatorApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setCreatorApplications(prev => [newApp, ...prev]);
    addToast('Application Submitted', 'Admin team will review your creator application within 24 hours.', 'success');
  }, [addToast]);

  // Moderation & Safety
  const reportEntity = useCallback((
    targetType: ReportRecord['targetType'],
    targetId: string,
    targetName: string,
    reason: string,
    details: string
  ) => {
    const newReport: ReportRecord = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      targetName,
      reason,
      details,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    addToast('Report Received', 'Thank you. Our Trust & Safety team will inspect this shortly.', 'info');
  }, [currentUser, addToast]);

  const submitReport = useCallback((
    targetType: ReportRecord['targetType'],
    targetId: string,
    targetName: string,
    reason: string,
    details: string
  ) => {
    reportEntity(targetType, targetId, targetName, reason, details);
  }, [reportEntity]);

  const blockUser = useCallback((userId: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
    addToast('User Blocked', 'You will no longer see messages or rooms from this user.', 'info');
  }, [addToast]);

  const unblockUser = useCallback((userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
    addToast('User Unblocked', 'User has been removed from your blocked list.', 'info');
  }, [addToast]);

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Admin Operations
  const adminApproveCreator = useCallback((appId: string) => {
    setCreatorApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a)
    );
    addToast('Creator Approved', 'Application verified and creator badge issued.', 'success');
  }, [addToast]);

  const adminRejectCreator = useCallback((appId: string) => {
    setCreatorApplications(prev =>
      prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a)
    );
    addToast('Creator Rejected', 'Application declined.', 'info');
  }, [addToast]);

  const adminApproveWithdrawal = useCallback((withdrawalId: string) => {
    setWithdrawalRequests(prev =>
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'paid', processedAt: new Date().toISOString() } : w)
    );
    setTransactions(prev =>
      prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'completed' } : t)
    );
    addToast('Withdrawal Paid', 'Payout marked as paid and ledger updated.', 'success');
  }, [addToast]);

  const adminRejectWithdrawal = useCallback((withdrawalId: string, reason: string) => {
    const target = withdrawalRequests.find(w => w.id === withdrawalId);
    if (target) {
      // Refund diamonds
      setDiamonds(prev => prev + target.diamondsDeducted);
    }
    setWithdrawalRequests(prev =>
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'rejected', rejectReason: reason } : w)
    );
    setTransactions(prev =>
      prev.map(t => t.referenceId === withdrawalId ? { ...t, status: 'failed' } : t)
    );
    addToast('Withdrawal Rejected', `Declined: ${reason}. Diamonds refunded.`, 'warning');
  }, [withdrawalRequests, addToast]);

  const adminBanUser = useCallback((userId: string) => {
    if (userId === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, isBanned: true }));
    }
    addToast('User Banned', `Account ${userId} has been suspended platform-wide.`, 'warning');
  }, [currentUser, addToast]);

  const adminUnbanUser = useCallback((userId: string) => {
    if (userId === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, isBanned: false }));
    }
    addToast('User Unbanned', `Account ${userId} access restored.`, 'info');
  }, [currentUser, addToast]);

  const adminForceEndRoom = useCallback((roomId: string) => {
    setRooms(prev => prev.filter(r => r.id !== roomId));
    if (activeRoom && activeRoom.id === roomId) {
      leaveRoom();
    }
    addToast('Room Force-Closed', 'Stream terminated by administrator.', 'warning');
  }, [activeRoom, leaveRoom, addToast]);

  const adminBroadcast = useCallback((title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: `notif-sys-${Date.now()}`,
      userId: 'all',
      type: 'system',
      title,
      body: message,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(title, message, 'info');
  }, [addToast]);

  const toggleAndroidFrame = useCallback(() => {
    setIsAndroidFrame(prev => !prev);
  }, []);

  // Simulated live viewers chat incoming messages
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const mockFans = [
        { name: 'CyberGamer_X', level: 8, text: 'This stream is fire! 🔥' },
        { name: 'TokyoDrifter', level: 16, text: 'Awesome quality today!' },
        { name: 'LunaStar', level: 23, text: 'Greetings from Montreal! 🇨🇦' },
        { name: 'NeonSamurai', level: 11, text: 'Sent you a like!' },
        { name: 'KPopFanatic', level: 19, text: 'Can you do an encore piece next?' },
      ];
      const randomFan = mockFans[Math.floor(Math.random() * mockFans.length)];

      const incomingMsg: ChatMessage = {
        id: `auto-msg-${Date.now()}`,
        roomId: activeRoom.id,
        senderId: `fan-${Date.now()}`,
        senderName: randomFan.name,
        senderAvatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 50000000)}?w=100&auto=format&fit=crop&q=80`,
        senderLevel: randomFan.level,
        text: randomFan.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      };

      setRoomMessages(prev => {
        // Keep last 40 messages to prevent unbounded growth
        const next = [...prev, incomingMsg];
        return next.length > 40 ? next.slice(-40) : next;
      });

      // Also casually burst a heart
      if (Math.random() > 0.4) {
        likeCurrentRoom(Math.floor(Math.random() * 70) + 15);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [activeRoom, likeCurrentRoom]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        loginWithEmail,
        loginWithPhone,
        loginWithGoogle,
        registerUser,
        logout,
        logoutUser,
        updateProfile,
        switchRole,
        requestAccountDeletion,
        rooms,
        activeRoom,
        currentRoom: activeRoom,
        setCurrentRoom,
        isBroadcasting,
        joinRoom,
        leaveRoom,
        createLiveRoom,
        endLiveBroadcast,
        roomMessages,
        roomParticipants,
        sendRoomMessage,
        sendGiftToHost,
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
        updateRoomAnnouncement,
        muteParticipant,
        kickParticipant,
        banParticipant,
        followedHostIds,
        toggleFollowHost,
        coins,
        diamonds,
        transactions,
        rechargeCoins,
        requestWithdrawal,
        withdrawalRequests,
        directConversations,
        directMessages,
        sendDirectMessage,
        creatorApplications,
        submitCreatorApplication,
        reports,
        blockedUserIds,
        reportEntity,
        submitReport,
        blockUser,
        unblockUser,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        addToast,
        activeToast,
        adminApproveCreator,
        adminRejectCreator,
        adminApproveWithdrawal,
        adminRejectWithdrawal,
        adminBanUser,
        adminUnbanUser,
        adminForceEndRoom,
        adminBroadcast,
        isAndroidFrame,
        toggleAndroidFrame,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
