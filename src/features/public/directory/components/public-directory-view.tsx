"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    Users,
    Sparkles,
    ExternalLink,
    Phone,
    Mail,
    Lock,
    Loader2,
    AlertCircle,
    Filter,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

interface PublicMember {
    _id: string;
    fullName: string;
    profilePicture?: string;
    bio?: string;
    location?: {
        district?: string;
        state?: string;
        country?: string;
    };
    subjectsOfInterest?: Array<string | { genre?: string; subject?: string }>;
    softwareSkills?: Array<string | { name?: string; level?: number }>;
    vocationalSkills?: Array<string | { genre?: string; skill?: string; level?: number }>;
    webProfiles?: Array<{ label?: string; platform?: string; url: string }>;
    contactInfo?: {
        phone?: string;
        whatsapp?: string;
        emails?: string[];
        isPrivate?: boolean;
    };
}

export function PublicDirectoryView() {
    const [members, setMembers] = useState<PublicMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [districtFilter, setDistrictFilter] = useState("");
    const [skillFilter, setSkillFilter] = useState("");

    const fetchMembers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.set("search", searchQuery.trim());
            if (districtFilter.trim()) params.set("district", districtFilter.trim());
            if (skillFilter.trim()) params.set("skill", skillFilter.trim());

            const queryStr = params.toString();
            const url = queryStr
                ? `${API_ENDPOINTS.users.directory}?${queryStr}`
                : API_ENDPOINTS.users.directory;

            const res = await apiClient.get<any>(url);
            const raw = res as any;
            const list: PublicMember[] = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                    ? raw.data
                    : Array.isArray(raw?.data?.users)
                        ? raw.data.users
                        : Array.isArray(raw?.users)
                            ? raw.users
                            : [];
            setMembers(list);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load Sisterhood Directory."
            );
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, districtFilter, skillFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchMembers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchMembers]);

    const extractSkillLabels = (member: PublicMember): string[] => {
        const labels: string[] = [];
        (member.vocationalSkills || []).forEach((v) => {
            if (typeof v === "string") labels.push(v);
            else if (v?.skill) labels.push(v.skill);
            else if (v?.genre && v.genre !== "General") labels.push(v.genre);
        });
        (member.softwareSkills || []).forEach((s) => {
            if (typeof s === "string") labels.push(s);
            else if (s?.name) labels.push(s.name);
        });
        (member.subjectsOfInterest || []).forEach((sub) => {
            if (typeof sub === "string") labels.push(sub);
            else if (sub?.subject) labels.push(sub.subject);
            else if (sub?.genre && sub.genre !== "General") labels.push(sub.genre);
        });
        return Array.from(new Set(labels.filter(Boolean)));
    };

    const filteredMembers = members.filter((member) => {
        if (districtFilter.trim()) {
            const d = districtFilter.trim().toLowerCase();
            const dist = (member.location?.district || "").toLowerCase();
            const state = (member.location?.state || "").toLowerCase();
            const country = (member.location?.country || "").toLowerCase();
            if (!dist.includes(d) && !state.includes(d) && !country.includes(d)) {
                return false;
            }
        }
        if (skillFilter.trim()) {
            const s = skillFilter.trim().toLowerCase();
            const allSkills = [
                ...(member.vocationalSkills || []).map((v) =>
                    typeof v === "string" ? v : `${v.skill || ""} ${v.genre || ""}`
                ),
                ...(member.softwareSkills || []).map((sw) =>
                    typeof sw === "string" ? sw : sw.name || ""
                ),
                ...(member.subjectsOfInterest || []).map((sub) =>
                    typeof sub === "string" ? sub : `${sub.subject || ""} ${sub.genre || ""}`
                ),
            ]
                .join(" ")
                .toLowerCase();
            if (!allSkills.includes(s)) {
                return false;
            }
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/60 via-white to-[#5B9891]/15 p-8 shadow-xs">
                    <div className="max-w-3xl space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B9891]/15 px-3 py-1 text-xs font-bold text-[#467A74]">
                            <Users className="h-3.5 w-3.5" /> Verified Sisterhood Network
                        </span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            BDSisters Member Directory
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Connect with verified Bangladeshi Muslim women across disciplines—educators,
                            entrepreneurs, developers, designers, and homemakers—in a safe, respectful space.
                        </p>
                    </div>

                    {/* Search & Location Filter Bar */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5 relative">
                            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by sister's name or bio..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>

                        <div className="sm:col-span-4 relative">
                            <MapPin className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={districtFilter}
                                onChange={(e) => setDistrictFilter(e.target.value)}
                                placeholder="Filter by District (e.g. Dhaka, Sylhet)..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>

                        <div className="sm:col-span-3 relative">
                            <Filter className="h-4 w-4 text-gray-400 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                placeholder="Filter by skill or interest..."
                                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:border-[#5B9891] focus:outline-hidden"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Directory Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                        <p className="text-xs font-semibold text-gray-500">
                            Loading approved sister profiles...
                        </p>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200/80 bg-white p-14 text-center space-y-3">
                        <Sparkles className="h-9 w-9 text-[#D98408] mx-auto" />
                        <h3 className="text-base font-bold text-gray-900">
                            No Approved Profiles Match Your Filter
                        </h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            Only admin-approved profiles appear in the public directory. Try clearing your search
                            filters or check back soon as new sisters are verified.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMembers.map((member) => {
                            const skills = extractSkillLabels(member);
                            const isContactPublic =
                                member.contactInfo && member.contactInfo.isPrivate === false;

                            return (
                                <div
                                    key={member._id}
                                    className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs hover:border-[#5B9891]/50 transition space-y-4"
                                >
                                    <div className="space-y-4">
                                        {/* Top Portrait & Location */}
                                        <div className="flex items-start gap-4">
                                            <div className="h-20 w-20 shrink-0 rounded-2xl border border-[#5B9891]/25 bg-[#FAF8F5] overflow-hidden flex items-center justify-center">
                                                {member.profilePicture ? (
                                                    <img
                                                        src={member.profilePicture}
                                                        alt={member.fullName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-black text-[#5B9891]">
                                                        {member.fullName?.charAt(0).toUpperCase() || "S"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/directory/${member._id}`}
                                                    className="text-base font-bold text-gray-900 hover:text-[#5B9891] transition line-clamp-1"
                                                >
                                                    {member.fullName}
                                                </Link>
                                                {(member.location?.district || member.location?.country) && (
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="h-3.5 w-3.5 text-[#D98408] shrink-0" />
                                                        <span className="truncate">
                                                            {[
                                                                member.location?.district,
                                                                member.location?.state,
                                                                member.location?.country,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ")}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Short Bio */}
                                        {member.bio && (
                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                {member.bio}
                                            </p>
                                        )}

                                        {/* Skills Tags */}
                                        {skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {skills.slice(0, 4).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="rounded-lg bg-[#5B9891]/12 px-2.5 py-1 text-[11px] font-semibold text-[#467A74]"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {skills.length > 4 && (
                                                    <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-500">
                                                        +{skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Web Profiles */}
                                        {member.webProfiles && member.webProfiles.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {member.webProfiles.slice(0, 3).map((wp, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={wp.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-bold text-gray-700 hover:border-[#5B9891] hover:text-[#5B9891]"
                                                    >
                                                        <span>{wp.label || wp.platform || "Link"}</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer: Contact Privacy Respect & View Profile */}
                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                        {isContactPublic ? (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                {member.contactInfo?.phone && (
                                                    <span className="inline-flex items-center gap-1 text-[11px]">
                                                        <Phone className="h-3 w-3 text-[#5B9891]" />
                                                        {member.contactInfo.phone}
                                                    </span>
                                                )}
                                                {!member.contactInfo?.phone && member.contactInfo?.emails?.[0] && (
                                                    <span className="inline-flex items-center gap-1 text-[11px] truncate max-w-[150px]">
                                                        <Mail className="h-3 w-3 text-[#5B9891]" />
                                                        {member.contactInfo.emails[0]}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400">
                                                <Lock className="h-3 w-3" /> Contact Private
                                            </span>
                                        )}

                                        <Link
                                            href={`/directory/${member._id}`}
                                            className="font-bold text-[#D98408] hover:underline"
                                        >
                                            View Profile →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}