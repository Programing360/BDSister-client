import { Metadata } from "next";
import { FeedbackListView } from "@/features/admin/events/components/feedback/feedback-list-view";

export const metadata: Metadata = {
  title: "Event Reviews & Feedback | BDSisters Admin",
  description: "Attendee satisfaction scores, testimonials, and quality feedback.",
};

export default function EventFeedbackPage() {
  return <FeedbackListView />;
}
