"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    FileDown,
    Video,
    FileSpreadsheet,
    Download,
    Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { CURATED_RESOURCES, SECTION_EXPLAINERS } from "@/data/mockData";

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/common/MotionComponents";
import { SectionHoverInfo } from "@/components/common/SectionHoverInfo";

const RESOURCE_ICON_MAP: Record<string, React.ReactNode> = {
    "PDF Guide": <FileDown className="w-5 h-5 text-[#5B9891]" />,
    "Video Lecture": <Video className="w-5 h-5 text-[#D98408]" />,
    Worksheet: <FileSpreadsheet className="w-5 h-5 text-[#5B9891]" />,
    "Curated Article": <BookOpen className="w-5 h-5 text-[#111E28]" />,
};

export function ResourceLibraryPreview() {
    const [resources, setResources] = useState(CURATED_RESOURCES);
    const [resourcesExplainer, setResourcesExplainer] = useState(SECTION_EXPLAINERS.resources);

    useEffect(() => {
        async function fetchLiveResources() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.resources.list);
                const list = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data)
                        ? res.data
                        : [];
                if (list.length > 0) {
                    const formatted = list.slice(0, 4).map((item: any, idx: number) => ({
                        id: item._id || item.id || `res-${idx}`,
                        title: item.title,
                        type: (item.type === "Video" ? "Video Lecture" : item.type === "Downloadable" ? "PDF Guide" : "Curated Article") as (typeof CURATED_RESOURCES)[number]["type"],
                        curatedBySister: item.category || "BDSisters Editorial",
                        downloadsOrReads: item.downloadCount || 1000 + idx * 300,
                        fileSizeOrDuration: item.type === "Video" ? "35 Mins Video" : "2.4 MB (Printable)",
                        fileUrl: item.fileUrl || item.videoUrl,
                    }));
                    setResources(formatted);
                }
            } catch (err) {
                // Fall back gracefully to CURATED_RESOURCES
            }
        }

        async function fetchResourcesExplainer() {
            try {
                const res = await apiClient.get<any>(API_ENDPOINTS.cms.blocks);
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
                const explainerBlock = list.find(
                    (b: any) => b.sectionKey === "sectionExplainers" && (b.title === "resources" || b.title === "library")
                );
                if (explainerBlock) {
                    setResourcesExplainer({
                        title: explainerBlock.subtitle || "Curated Resource Library",
                        description: explainerBlock.content || "",
                        howItWorks: explainerBlock.metadata?.howItWorks || SECTION_EXPLAINERS.resources.howItWorks,
                    });
                }
            } catch (err) {
                // Keep default explainer
            }
        }

        fetchLiveResources();
        fetchResourcesExplainer();
    }, []);

    const handleDownload = (id: string, fileUrl?: string) => {
        if (fileUrl) {
            window.open(fileUrl, "_blank");
        } else {
            window.open(API_ENDPOINTS.resources.download(id), "_blank");
        }
    };
    return (
        <section
            id="resources"
            aria-labelledby="resources-heading"
            className="py-16 bg-white border-b border-[#F7DFC7] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <ScrollReveal direction="up">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#F7DFC7]/60">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-1.5 rounded-lg bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                    <BookOpen className="w-4 h-4 text-[#5B9891]" />
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#111E28]">
                                    Knowledge Treasury & TSPP
                                </span>
                            </div>
                            <h2
                                id="resources-heading"
                                className="font-serif text-2xl sm:text-3xl font-bold text-[#111E28] tracking-tight"
                            >
                                Curated Resource Library
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-stone-700 max-w-2xl">
                                Authentic articles, downloadable study materials, and practical tools curated by sisters
                                and scholars across Muhsina Organization wings.
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <SectionHoverInfo
                                explainer={resourcesExplainer}
                                sectionName="Resource Library"
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* Resources Cards Grid with Staggered Entrance */}
                <StaggerContainer
                    staggerDelay={0.08}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {CURATED_RESOURCES.map((item) => (
                        <StaggerItem key={item.id}>
                            <motion.div
                                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                                className="h-full bg-[#FAF8F5] rounded-2xl border border-[#F7DFC7] p-5 flex flex-col justify-between hover:bg-white hover:shadow-xl hover:border-[#5B9891] transition-all duration-200"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="p-2 rounded-xl bg-white border border-[#F7DFC7] shadow-2xs">
                                            {RESOURCE_ICON_MAP[item.type] || (
                                                <BookOpen className="w-5 h-5 text-[#111E28]" />
                                            )}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#F7DFC7] text-[#111E28] border border-[#F7DFC7]">
                                            {item.type}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-[#111E28] leading-snug line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-[#5B9891] font-semibold mt-2">
                                        By {item.curatedBySister}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-[#F7DFC7]/60 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                                        <span>{item.fileSizeOrDuration}</span>
                                        <span>{item.downloadsOrReads.toLocaleString()} reads</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => handleDownload(item.id, (item as any).fileUrl)}
                                        className="w-full py-2.5 px-3 rounded-full bg-white border border-[#F7DFC7] hover:bg-[#5B9891] hover:text-white hover:border-[#111E28] text-[#111E28] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                                    >
                                        <Download className="w-3.5 h-3.5 text-[#5B9891]" />
                                        <span>Download Resource</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}