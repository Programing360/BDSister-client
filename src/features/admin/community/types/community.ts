/**
 * BDSisters.org - Step 9: Community & Forum Management
 * TypeScript Domain Types for Community & Forum Administration
 */

export type CommunityCategoryStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface CommunityCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name, e.g. "MessageSquare", "Sparkles", "Briefcase"
  coverImageUrl?: string;
  parentId?: string;
  parentName?: string;
  discussionsCount: number;
  postsCount: number;
  status: CommunityCategoryStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type DiscussionStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNDER_REVIEW"
  | "LOCKED"
  | "ARCHIVED"
  | "REMOVED";

export interface DiscussionAuthor {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  memberRole: string;
  isVerified: boolean;
}

export interface ModerationAuditLogEntry {
  action: string;
  actor: string;
  timestamp: string;
  note: string;
}

export interface Discussion {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  author: DiscussionAuthor;
  content: string;
  summary?: string;
  postsCount: number;
  viewsCount: number;
  likesCount: number;
  isPinned: boolean;
  isLocked: boolean;
  status: DiscussionStatus;
  createdAt: string;
  lastActivityAt: string;
  tags: string[];
  adminNotes?: string;
  moderationHistory: ModerationAuditLogEntry[];
}

export type PostStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "PENDING_REVIEW"
  | "REJECTED"
  | "HIDDEN"
  | "ARCHIVED"
  | "REMOVED";

export interface PostMediaAttachment {
  id: string;
  type: "IMAGE" | "DOCUMENT";
  name: string;
  url: string;
  sizeKB: number;
}

export interface CommunityPost {
  id: string;
  discussionId: string;
  discussionTitle: string;
  categoryId: string;
  categoryName: string;
  author: DiscussionAuthor;
  title?: string;
  content: string;
  mediaAttachments?: PostMediaAttachment[];
  reactionsCount: number;
  commentsCount: number;
  isPinned: boolean;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  moderationHistory: ModerationAuditLogEntry[];
}

export type CommentStatus =
  | "PUBLISHED"
  | "PENDING_REVIEW"
  | "HIDDEN"
  | "REJECTED"
  | "REMOVED";

export interface CommunityComment {
  id: string;
  postId: string;
  postTitle: string;
  discussionId: string;
  author: DiscussionAuthor;
  content: string;
  parentId?: string;
  parentAuthorName?: string;
  reactionsCount: number;
  status: CommentStatus;
  createdAt: string;
  adminNotes?: string;
  moderationHistory: ModerationAuditLogEntry[];
}

export type ModerationContentType = "DISCUSSION" | "POST" | "COMMENT";
export type ModerationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ModerationReviewStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "NEEDS_CHANGES";

export interface ModerationQueueItem {
  id: string;
  contentType: ModerationContentType;
  contentId: string;
  title?: string;
  contentPreview: string;
  author: DiscussionAuthor;
  reason: string;
  submittedAt: string;
  priority: ModerationPriority;
  reviewStatus: ModerationReviewStatus;
  assignedModerator?: string;
  internalNotes?: string;
  history: ModerationAuditLogEntry[];
}

export type ReportCategory =
  | "SPAM"
  | "HARASSMENT"
  | "BULLYING"
  | "HATE_SPEECH"
  | "MISINFORMATION"
  | "INAPPROPRIATE"
  | "COPYRIGHT"
  | "FAKE_ACCOUNT"
  | "OTHER";

export type ReportStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "RESOLVED"
  | "DISMISSED"
  | "ESCALATED";

export interface CommunityReport {
  id: string;
  reportId: string; // e.g. "REP-2026-0104"
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  reportedMember: {
    id: string;
    name: string;
    role: string;
    warningCount: number;
  };
  content: {
    id: string;
    type: ModerationContentType | "PROFILE";
    title?: string;
    preview: string;
    url: string;
  };
  category: ReportCategory;
  reason: string;
  reportedAt: string;
  priority: ModerationPriority;
  status: ReportStatus;
  resolutionNotes?: string;
  history: ModerationAuditLogEntry[];
}

export type ModeratorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface CommunityModerator {
  id: string;
  member: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    memberRole: string;
    joinDate: string;
  };
  assignedCategoryIds: string[];
  assignedCategoryNames: string[];
  moderatorStatus: ModeratorStatus;
  assignedAt: string;
  assignedBy: string;
  actionsCountLast30Days: number;
  pendingQueueLoad: number;
  recentActivity: Array<{
    action: string;
    target: string;
    timestamp: string;
  }>;
}

export interface CommunitySettings {
  communityEnabled: boolean;
  defaultDiscussionVisibility: "PUBLIC" | "MEMBERS_ONLY" | "VERIFIED_ONLY";
  whoCanCreateDiscussions:
    | "ALL_MEMBERS"
    | "VERIFIED_MEMBERS"
    | "SUBSCRIBED_MEMBERS"
    | "ADMINS_ONLY";
  whoCanReply: "ALL_MEMBERS" | "VERIFIED_MEMBERS" | "SUBSCRIBED_MEMBERS";
  requirePostApproval: boolean;
  requireCommentApproval: boolean;
  allowReactions: boolean;
  allowAttachments: boolean;
  maxAttachmentSizeMB: number;
  communityGuidelines: string;
  moderationRules: string;
  welcomeMessage: string;
}

export interface CommunityKpis {
  totalCommunityMembers: number;
  activeMembers: number;
  totalDiscussions: number;
  totalPosts: number;
  totalComments: number;
  pendingModeration: number;
  reportedContent: number;
  activeModerators: number;
}
