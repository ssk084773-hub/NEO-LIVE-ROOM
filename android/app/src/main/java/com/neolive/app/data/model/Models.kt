package com.neolive.app.data.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

enum class UserRole {
    USER, CREATOR, MODERATOR, ADMIN
}

enum class RoomType {
    VIDEO, AUDIO
}

enum class RoomStatus {
    LIVE, ENDED
}

enum class TransactionType {
    RECHARGE, GIFT_SENT, GIFT_RECEIVED, WITHDRAWAL, REFERRAL_BONUS
}

enum class TransactionStatus {
    COMPLETED, PENDING, FAILED
}

enum class WithdrawalStatus {
    PENDING, APPROVED, REJECTED, PAID
}

data class User(
    @DocumentId val id: String = "",
    val username: String = "",
    val displayName: String = "",
    val email: String = "",
    val phone: String = "",
    val avatar: String = "",
    val bio: String = "",
    val country: String = "US",
    val gender: String = "other",
    val dateOfBirth: String = "",
    val isOnline: Boolean = false,
    val isCreator: Boolean = false,
    val creatorLevel: Int = 1,
    val isVerified: Boolean = false,
    val isBanned: Boolean = false,
    val role: String = UserRole.USER.name,
    val coins: Long = 0,
    val earningsDiamonds: Long = 0, // 100 diamonds = $1 USD
    val totalReceivedGifts: Long = 0,
    val followersCount: Long = 0,
    val followingCount: Long = 0,
    val referralCode: String = "",
    val referredBy: String? = null,
    @ServerTimestamp val createdAt: Date? = null
)

data class LiveRoom(
    @DocumentId val id: String = "",
    val hostId: String = "",
    val hostName: String = "",
    val hostAvatar: String = "",
    val hostCountry: String = "US",
    val hostLevel: Int = 1,
    val title: String = "",
    val category: String = "Music",
    val type: String = RoomType.VIDEO.name,
    val isPrivate: Boolean = false,
    val passwordHash: String? = null,
    val coverImage: String = "",
    val viewerCount: Int = 0,
    val likeCount: Long = 0,
    val status: String = RoomStatus.LIVE.name,
    val announcement: String = "",
    val streamChannelId: String = "",
    val tags: List<String> = emptyList(),
    val moderatorIds: List<String> = emptyList(),
    val mutedUserIds: List<String> = emptyList(),
    val bannedUserIds: List<String> = emptyList(),
    @ServerTimestamp val createdAt: Date? = null
)

data class ChatMessage(
    @DocumentId val id: String = "",
    val roomId: String = "",
    val senderId: String = "",
    val senderName: String = "",
    val senderAvatar: String = "",
    val senderLevel: Int = 1,
    val text: String? = null,
    val giftId: String? = null,
    val giftName: String? = null,
    val giftIcon: String? = null,
    val giftCost: Long? = null,
    val imageUrl: String? = null,
    val type: String = "text", // text, gift, system, like, join
    @ServerTimestamp val timestamp: Date? = null
)

data class Gift(
    val id: String = "",
    val name: String = "",
    val icon: String = "",
    val cost: Long = 0,
    val animationType: String = "float",
    val color: String = "#f43f5e",
    val description: String = "",
    val diamondYield: Long = 0
)

data class Wallet(
    val userId: String = "",
    val coins: Long = 0,
    val earningsDiamonds: Long = 0,
    val pendingWithdrawalUsd: Double = 0.0,
    val totalRechargedUsd: Double = 0.0,
    val totalWithdrawnUsd: Double = 0.0,
    @ServerTimestamp val lastUpdated: Date? = null
)

data class Transaction(
    @DocumentId val id: String = "",
    val userId: String = "",
    val amount: Double = 0.0,
    val currency: String = "coins", // coins, diamonds, usd
    val type: String = TransactionType.RECHARGE.name,
    val status: String = TransactionStatus.COMPLETED.name,
    val referenceId: String? = null,
    val paymentMethod: String? = null,
    val note: String = "",
    @ServerTimestamp val createdAt: Date? = null
)

data class WithdrawalRequest(
    @DocumentId val id: String = "",
    val userId: String = "",
    val username: String = "",
    val amountUsd: Double = 0.0,
    val diamondsDeducted: Long = 0,
    val method: String = "PayPal",
    val accountDetails: String = "",
    val status: String = WithdrawalStatus.PENDING.name,
    val rejectReason: String? = null,
    @ServerTimestamp val createdAt: Date? = null,
    val processedAt: Date? = null
)

data class CreatorApplication(
    @DocumentId val id: String = "",
    val userId: String = "",
    val username: String = "",
    val fullName: String = "",
    val governmentIdType: String = "Passport",
    val idNumber: String = "",
    val socialLinks: String = "",
    val bio: String = "",
    val talentCategory: String = "Music",
    val status: String = "pending", // pending, approved, rejected
    @ServerTimestamp val submittedAt: Date? = null
)
