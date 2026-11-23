"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

interface SectionHelpTooltipProps {
    title: string;
    explanation: string;
}

export function SectionHelpTooltip({ title, explanation }: SectionHelpTooltipProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={`About ${title}`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F7DFC7] text-[#D98408] hover:bg-[#D98408] hover:text-white transition"
            >
                <HelpCircle className="h-3.5 w-3.5" />
            </button>

            {isOpen && (
                <div
                    role="tooltip"
                    className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-2xl border border-[#5B9891]/25 bg-white p-3.5 text-left shadow-xl animate-in fade-in zoom-in-95"
                >
                    <p className="text-[11px] font-bold text-[#467A74]">{title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-600">
                        {explanation}
                    </p>
                    <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[#5B9891]/25 bg-white" />
                </div>
            )}
        </div>
    );
}