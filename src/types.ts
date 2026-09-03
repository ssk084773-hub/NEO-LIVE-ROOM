export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  country: string;
  countryCode: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  isOnline: boolean;
  isCreator: boolean;
  creatorLevel: number;
  isVerified: boolean;
  isBanned: boolean;
  role: 'user' | 'creator' | 'moderator' | 'admin';
  coins: number;
  earningsDiamonds: number; // 100 diamonds = $1 USD
  totalReceivedGifts: number;
  followersCount: number;
  followingCount: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface LiveRoom {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  hostCountry: string;
  hostLevel: number;
  title: string;
  category: 'Music' | 'Gaming' | 'Chat' | 'Dancing' | 'Talent' | 'PK Battle' | 'Education';
  type: 'video' | 'audio';
  isPrivate: boolean;
  password?: string;
  coverImage: string;
  viewerCount: number;
  likeCount: number;
  status: 'live' | 'ended';
  announcement: string;
  streamChannelId: string;
  createdAt: string;
  tags: string[];
  moderatorIds: string[];
  mutedUserIds: string[];
  bannedUserIds: string[];
}

export interface RoomParticipant {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  role: 'host' | 'moderator' | 'viewer';
  joinedAt: string;
  isMuted: boolean;
}

export interface ChatMessage {
  id: string;
  roomId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLevel: number;
  text?: string;
  giftId?: string;
  giftName?: string;
  giftIcon?: string;
  giftCost?: number;
  imageUrl?: string;
  timestamp: string;
  type: 'text' | 'gift' | 'system' | 'like' | 'join';
  recipientId?: string;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
  animationType: 'float' | 'burst' | 'luxury' | 'fullscreen';
  color: string;
  description: string;
  diamondYield: number; // Diamonds awarded to host
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: 'coins' | 'diamonds' | 'usd';
  type: 'recharge' | 'gift_sent' | 'gift_received' | 'withdrawal' | 'referral_bonus';
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
  paymentMethod?: string;
  createdAt: string;
  note: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amountUsd: number;
  diamondsDeducted: number;
  method: 'PayPal' | 'Bank Transfer' | 'Wise' | 'UPI';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  processedAt?: string;
  rejectReason?: string;
}

export interface CreatorApplication {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  governmentIdType: string;
  idNumber: string;
  socialLinks: string;
  bio: string;
  talentCategory: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface CoinPackage {
  id: string;
  coins: number;
  bonusCoins: number;
  priceUsd: number;
  badge?: string;
  playStoreProductId: string;
}

export interface LeaderboardItem {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  level: number;
  country: string;
  isHost: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'follow' | 'gift' | 'message' | 'system' | 'withdrawal' | 'room_invite';
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  linkRoomId?: string;
}

export interface ReportRecord {
  id: string;
  reporterId: string;
  targetType: 'user' | 'room' | 'message';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface DirectConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantOnline: boolean;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}
