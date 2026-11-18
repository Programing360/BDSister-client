import { Metadata } from "next";
import { ArchiveListView } from "@/features/admin/events/components/archive/archive-list-view";

export const metadata: Metadata = {
  title: "Event Media & Archive | BDSisters Admin",
  description: "Historical summits, video recordings, attendee turnouts, and photo recaps.",
};

export default function EventArchivePage() {
  return <ArchiveListView />;
}
