import React from "react";
import { LiveChatInboxView } from "@/features/admin/communication/components/live-chat/live-chat-inbox-view";

export const metadata = {
  title: "Support Inquiries & Chat Threads | BDSisters Admin",
  description: "Asynchronous customer help desk and ticket message threads"
};

export default function LiveChatPage() {
  return <LiveChatInboxView />;
}
