import React from "react";
import { LiveChatConversationView } from "@/features/admin/communication/components/live-chat/live-chat-conversation-view";
import { DEMO_LIVE_CHAT_CONVERSATIONS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Support Ticket Conversation | BDSisters Admin",
  description: "Asynchronous customer inquiry and support ticket thread"
};

export async function generateStaticParams() {
  return DEMO_LIVE_CHAT_CONVERSATIONS.map((c) => ({
    conversationId: c.id
  }));
}

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function LiveChatConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  return <LiveChatConversationView conversationId={conversationId} />;
}
