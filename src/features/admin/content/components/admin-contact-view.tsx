"use client";

import React, { useState } from "react";
import { Mail, Send, MessageCircle, CheckCircle2 } from "lucide-react";

export function AdminContactView() {
    const [whatsappLink, setWhatsappLink] = useState("https://chat.whatsapp.com/bdsisters");
    const [telegramLink, setTelegramLink] = useState("https://t.me/bdsisters");
    const [savedToast, setSavedToast] = useState(false);

    const handleSaveLinks = (e: React.FormEvent) => {
        e.preventDefault();
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3000);
    };

    return (
        <div className="space-y-6 pb-12">
            {savedToast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>Community invitation links updated.</span>
                </div>
            )}

            <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 shadow-xs">
                <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Contact & Newsletter
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
                        <Mail className="h-3.5 w-3.5" />
                        Get in Touch
                    </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                    Manage WhatsApp/Telegram sisterhood group invitations, newsletter sign-ups, and inquiries.
                </p>
            </div>

            {/* Group Invitations Manager */}
            <form
                onSubmit={handleSaveLinks}
                className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4"
            >
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MessageCircle className="h-4 w-4 text-[#5B9891]" />
                    <h2 className="text-sm font-bold text-gray-900">
                        WhatsApp & Telegram Group Invitations
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                            WhatsApp Community Invite URL
                        </label>
                        <input
                            type="url"
                            value={whatsappLink}
                            onChange={(e) => setWhatsappLink(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                            Telegram Channel / Group URL
                        </label>
                        <input
                            type="url"
                            value={telegramLink}
                            onChange={(e) => setTelegramLink(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-xs font-mono text-gray-900"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-5 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                >
                    <Send className="h-3.5 w-3.5" /> Save Invitation Links
                </button>
            </form>
        </div>
    );
}