/**
 * BDSisters.org - Step 10: Events & Workshops Management
 * TypeScript Domain Types for Event Administration
 */

export type EventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type EventFormat = "PHYSICAL" | "ONLINE" | "HYBRID";

export type EventType =
  | "CONFERENCE"
  | "SEMINAR"
  | "WEBINAR"
  | "NETWORKING"
  | "EXHIBITION"
  | "TRAINING"
  | "MASTERCLASS"
  | "COMMUNITY";

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  coverImageUrl?: string;
  eventsCount: number;
  status: CategoryStatus;
  displayOrder: number;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  categoryName: string;
  eventType: EventType;
  format: EventFormat;
  organizer: {
    name: string;
    role: string;
    email: string;
    avatarUrl?: string;
  };
  coverImageUrl: string;
  galleryImages?: string[];
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  registrationOpeningDate: string;
  registrationClosingDate: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    mapDescription?: string;
  };
  onlinePlatform?: {
    platformName: string;
    placeholderMeetingUrl: string;
  };
  registrationCount: number;
  capacity: number;
  isRegistrationOpen: boolean;
  allowWaitlist: boolean;
  ticketPriceBDT: number;
  status: EventStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface WorkshopItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  instructor: {
    name: string;
    bio: string;
    avatarUrl?: string;
    organization: string;
  };
  coverImageUrl: string;
  format: EventFormat;
  startDate: string;
  startTime: string;
  duration: string;
  registrationCount: number;
  capacity: number;
  priceBDT: number;
  status: EventStatus;
  skillsLearned: string[];
  prerequisites?: string;
  createdAt: string;
  adminNotes?: string;
}

export type TicketTypeCategory =
  | "FREE"
  | "PAID"
  | "VIP"
  | "EARLY_BIRD"
  | "STUDENT"
  | "CUSTOM";

export type RegistrationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WAITLISTED"
  | "CANCELLED";

export type PaymentStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "SUCCESSFUL"
  | "FAILED"
  | "REFUNDED";

export type AttendanceStatus =
  | "NOT_CHECKED_IN"
  | "CHECKED_IN"
  | "ATTENDED"
  | "ABSENT";

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  memberId: string;
  registrationDate: string;
  ticketType: TicketTypeCategory;
  ticketPriceBDT: number;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  attendanceStatus: AttendanceStatus;
  paymentReference?: string;
  timeline: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
}

export interface EventAttendee {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  phone: string;
  eventId: string;
  eventTitle: string;
  ticketType: string;
  checkInStatus: "NOT_CHECKED_IN" | "CHECKED_IN";
  checkInTime?: string;
  attendanceStatus: AttendanceStatus;
}

export type TicketStatus = "ACTIVE" | "SOLD_OUT" | "DISABLED" | "UPCOMING";

export interface EventTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  type: TicketTypeCategory;
  description: string;
  priceBDT: number;
  totalQuantity: number;
  soldQuantity: number;
  salesStartDate: string;
  salesEndDate: string;
  status: TicketStatus;
}

export interface EventPaymentRecord {
  id: string;
  transactionReference: string;
  gateway: "ZINIPAY";
  registrationId: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  amountBDT: number;
  paymentMethod: string;
  status: "SUCCESSFUL" | "PENDING" | "FAILED" | "REFUNDED";
  transactionDate: string;
}

export type FeedbackReviewStatus = "PUBLISHED" | "HIDDEN" | "PENDING_REVIEW";

export interface EventFeedback {
  id: string;
  eventId: string;
  eventTitle: string;
  attendeeName: string;
  rating: number; // 1 to 5
  comment: string;
  submittedDate: string;
  status: FeedbackReviewStatus;
}

export interface EventKpis {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  cancelledEvents: number;
  totalRegistrations: number;
  totalAttendees: number;
}
