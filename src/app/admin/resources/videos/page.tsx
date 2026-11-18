import { Metadata } from "next";
import { VideosListView } from "@/features/admin/resources/components/videos/videos-list-view";

export const metadata: Metadata = {
  title: "Video Library & Masterclasses | BDSisters Admin",
  description:
    "Curate video masterclasses, recorded summits, workshop replays, and video tutorials.",
};

export default function AdminVideosPage() {
  return <VideosListView />;
}
