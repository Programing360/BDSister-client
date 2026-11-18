/**
 * BDSisters.org - Step 11: Resource Library & Learning Management
 * TypeScript Domain Types for LMS & Educational Resource Administration
 */

export type ResourceType =
  | "ARTICLE"
  | "VIDEO"
  | "PDF"
  | "DOCUMENT"
  | "DOWNLOADABLE_FILE"
  | "TUTORIAL"
  | "COURSE"
  | "GUIDE"
  | "TEMPLATE"
  | "OTHER";

export type ResourceStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

export type ResourceVisibility = "PUBLIC" | "MEMBERS_ONLY" | "PREMIUM";

export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";

export type CourseStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "ARCHIVED";

export type EnrollmentStatus =
  | "ACTIVE"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "SUSPENDED";

export type ApprovalStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export type ApprovalPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  coverImageUrl?: string;
  resourcesCount: number;
  status: "ACTIVE" | "INACTIVE";
  displayOrder: number;
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  resourceType: ResourceType;
  categoryId: string;
  categoryName: string;
  author: {
    name: string;
    role: string;
    email: string;
    avatarUrl?: string;
  };
  coverImageUrl: string;
  tags: string[];
  language: string;
  estimatedTime: string; // e.g. "12 mins read", "45 mins watch", "4 weeks"
  viewsCount: number;
  downloadsCount: number;
  status: ResourceStatus;
  visibility: ResourceVisibility;
  isFeatured: boolean;
  featuredOrder?: number;
  featuredDate?: string;
  publicationDate: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;

  // Type-specific optional fields:
  // Article
  articleBody?: string;
  readingTimeMinutes?: number;

  // Video
  videoDuration?: string;
  videoSourceType?: "YOUTUBE" | "VIMEO" | "SELF_HOSTED" | "EMBED";
  videoPlaceholderUrl?: string;

  // PDF / Document
  fileName?: string;
  fileType?: string;
  fileSizeBytes?: number;
  downloadUrlPlaceholder?: string;

  // Tutorial / Guide
  learningObjectives?: string[];
  difficultyLevel?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface LessonItem {
  id: string;
  moduleId: string;
  title: string;
  lessonType: "VIDEO" | "ARTICLE" | "DOWNLOADABLE" | "QUIZ_PLACEHOLDER";
  duration: string;
  order: number;
  isFreePreview: boolean;
  description?: string;
  contentPlaceholder?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessons: LessonItem[];
}

export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImageUrl: string;
  categoryId: string;
  categoryName: string;
  instructor: {
    name: string;
    bio: string;
    organization: string;
    avatarUrl?: string;
  };
  level: CourseLevel;
  duration: string; // e.g. "6 Weeks", "12 Hours"
  priceBDT: number;
  status: CourseStatus;
  isFeatured: boolean;
  modulesCount: number;
  lessonsCount: number;
  enrolledLearnersCount: number;
  completionRatePct: number;
  modules: CourseModule[];
  learningOutcomes: string[];
  prerequisites?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  learnerPhone: string;
  enrollmentDate: string;
  enrollmentType: "SELF_PACED" | "COHORT" | "SCHOLARSHIP";
  paymentStatus: "PAID" | "FREE" | "PENDING" | "REFUNDED";
  paymentReference?: string;
  progressPct: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  lastActiveDate: string;
  enrollmentStatus: EnrollmentStatus;
}

export interface ResourceApprovalRecord {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: ResourceType;
  contributorName: string;
  contributorEmail: string;
  categoryName: string;
  submittedDate: string;
  reviewStatus: ApprovalStatus;
  priority: ApprovalPriority;
  internalNotes?: string;
  timeline: Array<{
    status: ApprovalStatus;
    timestamp: string;
    reviewer: string;
    note: string;
  }>;
}

export interface ResourceKpis {
  totalResources: number;
  publishedResources: number;
  draftResources: number;
  pendingReviewCount: number;
  totalCategories: number;
  totalViews: number;
  totalDownloads: number;
  featuredCount: number;
}

export interface LearningAnalyticsMetrics {
  totalEnrolledLearners: number;
  activeLearners: number;
  completedCoursesCount: number;
  averageCompletionRatePct: number;
  monthlyEnrollmentSeries: Array<{
    month: string;
    enrollments: number;
    completions: number;
  }>;
  progressDistribution: Array<{
    range: string;
    learnersCount: number;
  }>;
}
