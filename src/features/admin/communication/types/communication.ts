/**
 * BDSisters.org - Step 13: Communication, Support & Notification Management
 * TypeScript Domain Types for Contacts, Tickets, Email, Newsletters, Announcements & Live Chat
 */

export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// 1. CONTACT SUBMISSIONS
export type ContactStatus =
  | "NEW"
  | "READ"
  | "IN_PROGRESS"
  | "REPLIED"
  | "RESOLVED"
  | "ARCHIVED";

export interface ContactSubmission {
  id: string;
  senderName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submissionDate: string;
  status: ContactStatus;
  priority: PriorityLevel;
  category: "GENERAL" | "PARTNERSHIP" | "SPONSORSHIP" | "PRESS" | "COMPLIANCE";
  internalNotes?: string;
  replyHistory?: Array<{
    id: string;
    sender: string;
    text: string;
    sentAt: string;
  }>;
}

// 2. SUPPORT TICKETS & COMPLAINTS
export type TicketCategory =
  | "ACCOUNT_ISSUES"
  | "PROFILE_VERIFICATION"
  | "MEMBERSHIP"
  | "PAYMENT"
  | "BUSINESS_MANAGEMENT"
  | "ECOMMERCE"
  | "TECHNICAL_ISSUES"
  | "GENERAL_SUPPORT"
  | "EVENT"
  | "OTHER";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_RESPONSE"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderType: "MEMBER" | "ADMIN";
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  memberName: string;
  memberEmail: string;
  memberId: string;
  category: TicketCategory;
  priority: PriorityLevel;
  assignedAdmin: string;
  createdDate: string;
  lastUpdated: string;
  status: TicketStatus;
  messages: TicketMessage[];
  internalNotes: string[];
}

export type ComplaintStatus =
  | "PENDING"
  | "INVESTIGATING"
  | "RESOLVED"
  | "DISMISSED";

export interface Complaint {
  id: string;
  complaintNumber: string;
  category: "SELLER_MISCONDUCT" | "ORDER_DISPUTE" | "COUNTERFEIT" | "HARASSMENT" | "POLICY_VIOLATION";
  reportedUserOrContent: string;
  reportedEntityId: string;
  reporterName: string;
  reporterEmail: string;
  priority: PriorityLevel;
  reviewStatus: ComplaintStatus;
  details: string;
  resolutionSummary?: string;
  filedDate: string;
  resolvedDate?: string;
}

// 3. EMAIL MANAGEMENT
export type EmailTemplateCategory =
  | "WELCOME"
  | "VERIFICATION"
  | "PASSWORD_RESET"
  | "MEMBERSHIP"
  | "PAYMENT"
  | "APPROVAL"
  | "EVENT"
  | "SUPPORT"
  | "ANNOUNCEMENT"
  | "auth"
  | "membership"
  | "orders"
  | "notifications"
  | "marketing"
  | string;

export interface EmailTemplate {
  id: string;
  name: string;
  category: EmailTemplateCategory;
  subject: string;
  body?: string;
  htmlBody?: string;
  variables: string[];
  lastUpdated: string;
  status?: "ACTIVE" | "DRAFT" | string;
  isActive?: boolean;
  slug?: string;
}

export type EmailDeliveryStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "BOUNCED"
  | "pending"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced";

export interface EmailLog {
  id: string;
  recipient?: string;
  recipientEmail?: string;
  recipientName?: string;
  subject: string;
  templateName: string;
  status: EmailDeliveryStatus | string;
  createdDate?: string;
  sentDate?: string;
  sentAt?: string;
  errorSummary?: string;
}

// 4. NEWSLETTER
export type SubscriberStatus =
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "PENDING_CONFIRMATION"
  | "BOUNCED";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscriptionDate?: string;
  subscribedAt?: string;
  status: SubscriberStatus | string;
  source: "WEBSITE_FOOTER" | "CHECKOUT" | "COMMUNITY_SIGNUP" | "MANUAL_IMPORT" | string;
  tags?: string[];
}

export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "CANCELLED"
  | "draft"
  | "scheduled"
  | "sending"
  | "sent";

export type CampaignAudience =
  | "ALL_MEMBERS"
  | "FREE_MEMBERS"
  | "PAID_MEMBERS"
  | "BUSINESS_OWNERS"
  | "SELLERS"
  | "SUBSCRIBERS"
  | "all"
  | "entrepreneurs"
  | "members"
  | "inactive";

export interface NewsletterCampaign {
  id: string;
  name?: string;
  title?: string;
  subject: string;
  audience: CampaignAudience | string;
  subscriberCount?: number;
  recipientCount?: number;
  status: CampaignStatus | string;
  createdDate?: string;
  createdAt?: string;
  scheduledDate?: string;
  scheduledFor?: string;
  sentDate?: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
  previewText?: string;
  content: string;
}

// 5. ANNOUNCEMENTS
export type AnnouncementType =
  | "GENERAL"
  | "IMPORTANT"
  | "WARNING"
  | "EVENT"
  | "MEMBERSHIP"
  | "MAINTENANCE"
  | "info"
  | "warning"
  | "success"
  | "critical";

export type AnnouncementStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SCHEDULED"
  | "EXPIRED"
  | "ARCHIVED"
  | "draft"
  | "active"
  | "scheduled"
  | "expired";

export interface PlatformAnnouncement {
  id: string;
  title: string;
  description?: string;
  content?: string;
  announcementType?: AnnouncementType;
  type?: AnnouncementType;
  targetAudience?: CampaignAudience | "ALL_VISITORS" | string;
  visibility?: "PUBLIC" | "MEMBERS_ONLY" | "ADMIN_ONLY";
  displayLocation?: "PUBLIC_WEBSITE" | "MEMBER_DASHBOARD" | "ADMIN_DASHBOARD" | "ALL";
  startDate?: string;
  endDate?: string;
  publishedAt?: string;
  expiresAt?: string;
  status: AnnouncementStatus | string;
  priority?: PriorityLevel | string;
  actionUrl?: string;
  actionText?: string;
  actionLabel?: string;
  isPinned?: boolean;
}

// 6. NOTIFICATIONS
export type NotificationType =
  | "ACCOUNT"
  | "MEMBERSHIP"
  | "PROFILE"
  | "BUSINESS"
  | "ECOMMERCE"
  | "PAYMENT"
  | "EVENTS"
  | "COMMUNITY"
  | "SYSTEM"
  | "account"
  | "verification"
  | "marketplace"
  | "events"
  | "system"
  | string;

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  title?: string;
  titleTemplate?: string;
  message?: string;
  bodyTemplate?: string;
  availableVariables?: string[];
  variables?: string[];
  status?: "ACTIVE" | "DRAFT" | string;
  isActive?: boolean;
  slug?: string;
  inApp?: boolean;
  emailPush?: boolean;
  smsPush?: boolean;
  channels?: string[];
}

export interface NotificationHistoryItem {
  id: string;
  recipient?: string;
  recipientName?: string;
  recipientEmail: string;
  title: string;
  body?: string;
  type?: NotificationType;
  deliveryStatus?: "DELIVERED" | "QUEUED" | "FAILED" | string;
  createdDate?: string;
  sentAt?: string;
  readStatus?: "READ" | "UNREAD" | string;
  isRead?: boolean;
  channel?: string;
}

// 7. BULK EMAIL
export interface BulkEmailCampaign {
  id: string;
  name?: string;
  title?: string;
  audience?: CampaignAudience | string;
  targetCriteria?: string;
  recipientCount: number;
  deliveredCount?: number;
  failedCount?: number;
  subject: string;
  templateId?: string;
  templateName?: string;
  status: "DRAFT" | "SCHEDULED" | "PROCESSING" | "SENT" | "completed" | "sending" | string;
  createdDate?: string;
  createdAt?: string;
  scheduledDate?: string;
  bodyPreview?: string;
  createdBy?: string;
}

// 8. LIVE CHAT
export type LiveChatStatus = "OPEN" | "ACTIVE" | "WAITING" | "CLOSED" | "open" | "pending" | "closed" | string;

export interface LiveChatMessage {
  id: string;
  senderName: string;
  senderType: "MEMBER" | "AGENT" | "user" | "agent" | "bot" | string;
  text?: string;
  content?: string;
  timestamp: string;
}

export interface LiveChatConversation {
  id: string;
  conversationNumber?: string;
  memberName?: string;
  userName?: string;
  memberEmail?: string;
  userEmail?: string;
  memberAvatar?: string;
  lastMessagePreview?: string;
  lastMessage?: string;
  lastActivity?: string;
  lastMessageAt?: string;
  createdAt?: string;
  unreadCount: number;
  assignedAgent?: string;
  assignedTo?: string;
  status: LiveChatStatus;
  district?: string;
  membershipTier?: "FREE" | "VERIFIED_SISTER" | "PREMIUM_ENTREPRENEUR" | string;
  messages: LiveChatMessage[];
}

// 9. COMMUNICATION CHANNELS & SETTINGS
export interface CommunicationChannel {
  id: string;
  name: string;
  type: "EMAIL" | "WHATSAPP" | "TELEGRAM" | "CONTACT_FORM" | "LIVE_CHAT" | string;
  configurationStatus?: "CONFIGURED" | "NOT_CONFIGURED" | "REQUIRES_ACTION" | string;
  connectionStatus?: "CONNECTED" | "DISCONNECTED" | "PLACEHOLDER_ONLY" | string;
  lastActivity?: string;
  description?: string;
  accountHandle?: string;
  isEnabled?: boolean;
  provider?: string;
  targetAddress?: string;
}

export interface CommunicationSettings {
  contactAutoReply?: boolean;
  contactNotificationEmail?: string;
  supportTicketAssignment?: "ROUND_ROBIN" | "MANUAL" | "CATEGORY_BASED";
  supportEscalationHours?: number;
  newsletterDoubleOptIn?: boolean;
  emailSenderName?: string;
  emailSenderAddress?: string;
  announcementAutoExpireDays?: number;
  liveChatOperatingHours?: string;
  whatsappPlaceholderEnabled?: boolean;
  telegramPlaceholderEnabled?: boolean;

  supportEmail?: string;
  notificationSenderName?: string;
  defaultReplyTo?: string;
  dailyEmailLimit?: number;
  ticketSlaHours?: number;
  autoResponderEnabled?: boolean;
  autoResponderMessage?: string;
}

// 10. KPIS & ANALYTICS
export interface CommunicationKPIs {
  totalContactMessages: number;
  unreadMessages: number;
  openSupportTickets: number;
  pendingComplaints: number;
  resolvedTickets: number;
  totalNewsletterSubscribers: number;
  activeAnnouncements: number;
  emailsSentMonth: number;
  notificationsDeliveredMonth: number;
  avgResolutionHours: number;
}
