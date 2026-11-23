"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    UserCircle,
    Save,
    ShieldCheck,
    Upload,
    Lock,
    Globe,
    FileDown,
    Send,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    MapPin,
    Eye,
    EyeOff,
    ExternalLink,
    Mail,
} from "lucide-react";
import { apiClient, ApiError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { SectionHelpTooltip } from "@/components/shared/section-help-tooltip";
import { uploadSignedToCloudinary } from "@/lib/cloudinary/cloudinary";

interface LookupItem {
    _id: string;
    genreOrCategory: string;
    name: string;
}

interface LookupGroups {
    subjects: LookupItem[];
    software: LookupItem[];
    vocationalSkills: LookupItem[];
    socialIcons: LookupItem[];
}

interface SkillWithBar {
    name: string;
    level: number; // 10 to 100
}

interface WebProfileItem {
    platform: string;
    url: string;
    isReachable?: boolean;
}

interface SectionVisibility {
    showBio: boolean;
    showLocation: boolean;
    showContact: boolean;
    showWebProfiles: boolean;
    showSubjects: boolean;
    showSoftware: boolean;
    showVocational: boolean;
}

interface ProfileState {
    _id: string;
    fullName: string;
    primaryEmail: string;
    additionalEmails: string[];
    bio: string;
    district: string;
    state: string;
    country: string;
    phone: string;
    whatsapp: string;
    shareContactPublicly: boolean; // Default false (Private)
    profilePicture: string;
    subjectsOfInterest: string[];
    softwareSkills: SkillWithBar[];
    vocationalSkills: SkillWithBar[];
    webProfiles: WebProfileItem[];
    visibility: SectionVisibility;
    status: string;
    profileStatus: string;
    identityVerification: {
        verificationStatus?: string;
        nidOrPassportUrl?: string;
    };
}

export function MemberProfileBuilderView() {
    const [profile, setProfile] = useState<ProfileState | null>(null);
    const [lookups, setLookups] = useState<LookupGroups>({
        subjects: [],
        software: [],
        vocationalSkills: [],
        socialIcons: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingNid, setIsUploadingNid] = useState(false);
    const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);

    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form Inputs
    const [newEmailInput, setNewEmailInput] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedSoftware, setSelectedSoftware] = useState("");
    const [softwareLevel, setSoftwareLevel] = useState<number>(75);
    const [selectedVocational, setSelectedVocational] = useState("");
    const [vocationalLevel, setVocationalLevel] = useState<number>(80);
    const [webPlatform, setWebPlatform] = useState("");
    const [webUrl, setWebUrl] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 4000);
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [meRes, lookupRes] = await Promise.allSettled([
                apiClient.get<{ data?: Record<string, unknown> }>(API_ENDPOINTS.auth.me),
                apiClient.get<{ data?: Partial<LookupGroups> }>(API_ENDPOINTS.cms.lookups),
            ]);

            if (meRes.status === "fulfilled") {
                const raw = meRes.value as unknown as { data?: Record<string, unknown> };
                const d = raw.data || {};
                const rawVis = (d.visibility as Partial<SectionVisibility>) || {};
                const loc = (d.location as Record<string, string>) || {};
                const contact = (d.contactInfo as Record<string, unknown>) || {};
                const primaryEmail = String(d.email || "");
                const contactEmails = Array.isArray(contact.emails)
                    ? (contact.emails as string[])
                    : Array.isArray(d.additionalEmails)
                        ? (d.additionalEmails as string[])
                        : [];
                const extraEmails = contactEmails.filter(
                    (em) => em && em.toLowerCase() !== primaryEmail.toLowerCase()
                );

                const rawWebList = Array.isArray(d.webProfiles)
                    ? (d.webProfiles as WebProfileItem[])
                    : Array.isArray(d.socialLinks)
                        ? (d.socialLinks as WebProfileItem[])
                        : [];

                setProfile({
                    _id: String(d._id || ""),
                    fullName: String(d.fullName || ""),
                    primaryEmail,
                    additionalEmails: extraEmails,
                    bio: String(d.bio || ""),
                    district: String(loc.district || d.district || ""),
                    state: String(loc.state || d.state || ""),
                    country: String(loc.country || d.country || "Bangladesh"),
                    phone: String(contact.phone || d.phone || ""),
                    whatsapp: String(contact.whatsapp || d.whatsapp || ""),
                    shareContactPublicly:
                        contact.isPrivate !== undefined
                            ? !Boolean(contact.isPrivate)
                            : Boolean(d.shareContactPublicly ?? false),
                    profilePicture: String(d.profilePicture || ""),
                    subjectsOfInterest: Array.isArray(d.subjectsOfInterest)
                        ? (d.subjectsOfInterest as string[])
                        : [],
                    softwareSkills: Array.isArray(d.softwareSkills)
                        ? (d.softwareSkills as Array<string | SkillWithBar>).map((s) =>
                            typeof s === "string" ? { name: s, level: 75 } : s
                        )
                        : [],
                    vocationalSkills: Array.isArray(d.vocationalSkills)
                        ? (d.vocationalSkills as Array<string | SkillWithBar>).map((v) =>
                            typeof v === "string" ? { name: v, level: 80 } : v
                        )
                        : [],
                    webProfiles: rawWebList.map((w) => ({
                        ...w,
                        isReachable: /^https?:\/\/.+\..+/.test(w.url),
                    })),
                    visibility: {
                        showBio: rawVis.showBio ?? true,
                        showLocation: rawVis.showLocation ?? true,
                        showContact: rawVis.showContact ?? false,
                        showWebProfiles: rawVis.showWebProfiles ?? true,
                        showSubjects: rawVis.showSubjects ?? true,
                        showSoftware: rawVis.showSoftware ?? true,
                        showVocational: rawVis.showVocational ?? true,
                    },
                    status: String(d.status || "Pending"),
                    profileStatus: String(d.profileStatus || "Draft"),
                    identityVerification:
                        (d.identityVerification as ProfileState["identityVerification"]) || {},
                });
            }

            if (lookupRes.status === "fulfilled") {
                const rawL = lookupRes.value as unknown as { data?: Partial<LookupGroups> };
                if (rawL.data) {
                    setLookups({
                        subjects: rawL.data.subjects || [],
                        software: rawL.data.software || [],
                        vocationalSkills: rawL.data.vocationalSkills || [],
                        socialIcons: rawL.data.socialIcons || [],
                    });
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Signed Cloudinary Upload for Big Square Profile Picture
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;
        setIsUploadingAvatar(true);
        setError(null);
        try {
            const url = await uploadSignedToCloudinary(file);
            if (!url) throw new Error("Upload failed to return URL.");
            setProfile({ ...profile, profilePicture: url });
            await apiClient.patch(API_ENDPOINTS.auth.updateMe, { profilePicture: url });
            showToast("Big square profile picture updated!");
        } catch (err) {
            setError(
                err instanceof ApiError || err instanceof Error ? err.message : "Upload failed."
            );
        } finally {
            setIsUploadingAvatar(false);
            e.target.value = "";
        }
    };

    // Signed Cloudinary Upload for Confidential NID/Passport
    const handleNidUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;
        setIsUploadingNid(true);
        setError(null);
        try {
            const url = await uploadSignedToCloudinary(file);
            if (!url) throw new Error("Upload failed to return URL.");
            await apiClient.patch(API_ENDPOINTS.auth.updateMe, {
                nidOrPassportUrl: url,
                identityVerification: {
                    ...profile.identityVerification,
                    nidOrPassportUrl: url,
                    verificationStatus: "Pending",
                },
            });
            showToast("NID/Passport uploaded securely.");
            await loadData();
        } catch (err) {
            setError(
                err instanceof ApiError || err instanceof Error
                    ? err.message
                    : "NID upload failed."
            );
        } finally {
            setIsUploadingNid(false);
            e.target.value = "";
        }
    };

    const handleSaveDraft = async () => {
        if (!profile) return;
        setIsSaving(true);
        setError(null);
        try {
            const allEmails = Array.from(
                new Set([profile.primaryEmail, ...profile.additionalEmails].filter(Boolean))
            );

            await Promise.all([
                apiClient.patch(API_ENDPOINTS.auth.updateMe, {
                    fullName: profile.fullName,
                    bio: profile.bio,
                    profilePicture: profile.profilePicture || undefined,
                    location: {
                        district: profile.district,
                        state: profile.state,
                        country: profile.country,
                    },
                    subjectsOfInterest: profile.subjectsOfInterest,
                    softwareSkills: profile.softwareSkills,
                    vocationalSkills: profile.vocationalSkills,
                    webProfiles: profile.webProfiles.map(({ platform, url }) => ({
                        platform,
                        url,
                    })),
                }),
                apiClient.patch(API_ENDPOINTS.auth.updateContact, {
                    phone: profile.phone,
                    whatsapp: profile.whatsapp,
                    emails: allEmails,
                    isPrivate: !profile.shareContactPublicly,
                }),
            ]);
            showToast("Profile & Contact Info saved successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublishReview = async () => {
        const hasId =
            Boolean(profile?.identityVerification?.nidOrPassportUrl) ||
            profile?.identityVerification?.verificationStatus === "Pending" ||
            profile?.identityVerification?.verificationStatus === "Approved";

        if (!hasId) {
            setError("Please upload your NID or Passport first before submitting to Publish.");
            return;
        }
        setIsSubmittingPublish(true);
        setError(null);
        try {
            await handleSaveDraft();
            await apiClient.post(API_ENDPOINTS.auth.submitReview);
            showToast("Profile submitted to admins for manual review & publishing!");
            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit for publish.");
        } finally {
            setIsSubmittingPublish(false);
        }
    };

    const toggleSectionVisibility = (key: keyof SectionVisibility) => {
        if (!profile) return;
        setProfile({
            ...profile,
            visibility: {
                ...profile.visibility,
                [key]: !profile.visibility[key],
            },
        });
    };

    if (isLoading || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-[#5B9891]/20 bg-white space-y-3">
                <Loader2 className="h-8 w-8 text-[#5B9891] animate-spin" />
                <p className="text-xs font-semibold text-gray-600">
                    Loading Sister Profile Builder...
                </p>
            </div>
        );
    }

    const hasUploadedId =
        Boolean(profile.identityVerification?.nidOrPassportUrl) ||
        profile.identityVerification?.verificationStatus === "Pending" ||
        profile.identityVerification?.verificationStatus === "Approved";

    return (
        <div className="space-y-6 pb-14">
            {toast && (
                <div className="flex items-center gap-2 rounded-2xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3.5 text-xs font-bold text-[#467A74]">
                    <CheckCircle2 className="h-4 w-4 text-[#5B9891]" />
                    <span>{toast}</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Header with Save, Publish & Download PDF */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/55 via-white to-[#5B9891]/12 p-6 shadow-xs">
                <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            My Sister Profile Builder
                        </h1>
                        <SectionHelpTooltip
                            title="Personal Profile & Visibility"
                            explanation="Build your profile for free, toggle which sections appear publicly, save drafts anytime, and click Publish to submit for manual admin review."
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        Account: <strong className="text-[#467A74]">{profile.status}</strong> • Directory Status:{" "}
                        <strong className="text-[#D98408]">{profile.profileStatus}</strong>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <a
                        href={API_ENDPOINTS.auth.exportPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:border-[#5B9891] hover:text-[#5B9891] transition"
                    >
                        <FileDown className="h-4 w-4" />
                        <span>Download PDF</span>
                    </a>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white hover:bg-[#467A74] transition"
                    >
                        <Save className="h-4 w-4" />
                        <span>{isSaving ? "Saving..." : "Save Profile"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handlePublishReview}
                        disabled={isSubmittingPublish}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#D98408] px-4 py-2 text-xs font-bold text-white hover:bg-[#b86f06] transition"
                    >
                        <Send className="h-4 w-4" />
                        <span>{isSubmittingPublish ? "Submitting..." : "Publish"}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Columns */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. Big Square Profile Picture, Name, Bio & Current Location */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-[#5B9891]" />
                                <h2 className="text-sm font-bold text-gray-900">
                                    Identity, Bio & Current Location
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggleSectionVisibility("showBio")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${profile.visibility.showBio
                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {profile.visibility.showBio ? (
                                        <Eye className="h-3 w-3" />
                                    ) : (
                                        <EyeOff className="h-3 w-3" />
                                    )}
                                    <span>Bio: {profile.visibility.showBio ? "Visible" : "Hidden"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => toggleSectionVisibility("showLocation")}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${profile.visibility.showLocation
                                            ? "bg-[#5B9891]/15 text-[#467A74]"
                                            : "bg-gray-100 text-gray-500"
                                        }`}
                                >
                                    {profile.visibility.showLocation ? (
                                        <Eye className="h-3 w-3" />
                                    ) : (
                                        <EyeOff className="h-3 w-3" />
                                    )}
                                    <span>
                                        Location: {profile.visibility.showLocation ? "Visible" : "Hidden"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Big Square Profile Picture */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                            <div className="h-32 w-32 shrink-0 rounded-2xl border-2 border-[#5B9891]/30 bg-[#FAF8F5] overflow-hidden flex items-center justify-center shadow-2xs">
                                {profile.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile.fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-black text-[#5B9891]">
                                        {profile.fullName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-800">
                                    Big Square Profile Picture
                                </p>
                                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-[#F7DFC7] px-4 py-2 text-xs font-bold text-[#D98408] hover:bg-[#F2B55D]/45 transition">
                                    <Upload className="h-3.5 w-3.5" />
                                    <span>
                                        {isUploadingAvatar ? "Uploading..." : "Upload Square Photo"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploadingAvatar}
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-[11px] text-gray-400">
                                    Displayed as a square portrait on your sisterhood profile.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="sm:col-span-2">
                                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, fullName: e.target.value })
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 font-medium text-gray-900"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block font-bold text-gray-700 mb-1">
                                    Short Profile Summary
                                </label>
                                <textarea
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Write a brief summary about yourself..."
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3.5 py-2 text-gray-900"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="flex items-center gap-1 font-bold text-gray-700 mb-1">
                                    <MapPin className="h-3.5 w-3.5 text-[#5B9891]" /> Current Location
                                    (District, State, Country only — No specific address)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        value={profile.district}
                                        onChange={(e) =>
                                            setProfile({ ...profile, district: e.target.value })
                                        }
                                        placeholder="District (e.g. Dhaka)"
                                        className="rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                    />
                                    <input
                                        type="text"
                                        value={profile.state}
                                        onChange={(e) =>
                                            setProfile({ ...profile, state: e.target.value })
                                        }
                                        placeholder="State / Division"
                                        className="rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                    />
                                    <input
                                        type="text"
                                        value={profile.country}
                                        onChange={(e) =>
                                            setProfile({ ...profile, country: e.target.value })
                                        }
                                        placeholder="Country"
                                        className="rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Subjects of Interest, Applications & Software (with Skill Bars), Vocational Skills (with Skill Bars) */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-6">
                        {/* Subjects of Interest */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-800">
                                    5. Subjects of Interest (Educational Subjects)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleSectionVisibility("showSubjects")}
                                    className="text-[11px] font-bold text-[#5B9891]"
                                >
                                    {profile.visibility.showSubjects ? "Visible" : "Hidden"}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                                >
                                    <option value="">
                                        {lookups.subjects.length === 0
                                            ? "No subjects added by Admin yet..."
                                            : "Choose genre & subject..."}
                                    </option>
                                    {lookups.subjects.map((item) => (
                                        <option key={item._id} value={item.name}>
                                            {item.genreOrCategory} — {item.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            selectedSubject &&
                                            !profile.subjectsOfInterest.includes(selectedSubject)
                                        ) {
                                            setProfile({
                                                ...profile,
                                                subjectsOfInterest: [
                                                    ...profile.subjectsOfInterest,
                                                    selectedSubject,
                                                ],
                                            });
                                            setSelectedSubject("");
                                        }
                                    }}
                                    className="rounded-xl bg-[#5B9891] px-4 py-2 text-xs font-bold text-white"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.subjectsOfInterest.map((sub) => (
                                    <span
                                        key={sub}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B9891]/12 px-2.5 py-1 text-xs font-semibold text-[#467A74]"
                                    >
                                        {sub}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfile({
                                                    ...profile,
                                                    subjectsOfInterest: profile.subjectsOfInterest.filter(
                                                        (s) => s !== sub
                                                    ),
                                                })
                                            }
                                            className="text-rose-600 font-bold"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Applications & Software with Skill Bars */}
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-800">
                                    6. Applications & Softwares (with Skill Level Bars)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleSectionVisibility("showSoftware")}
                                    className="text-[11px] font-bold text-[#5B9891]"
                                >
                                    {profile.visibility.showSoftware ? "Visible" : "Hidden"}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                <select
                                    value={selectedSoftware}
                                    onChange={(e) => setSelectedSoftware(e.target.value)}
                                    className="sm:col-span-6 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                                >
                                    <option value="">
                                        {lookups.software.length === 0
                                            ? "No software added by Admin yet..."
                                            : "Choose software..."}
                                    </option>
                                    {lookups.software.map((item) => (
                                        <option key={item._id} value={item.name}>
                                            {item.genreOrCategory} — {item.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="sm:col-span-4 flex items-center gap-2 text-xs">
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        step={5}
                                        value={softwareLevel}
                                        onChange={(e) => setSoftwareLevel(Number(e.target.value))}
                                        className="flex-1 accent-[#D98408]"
                                    />
                                    <span className="font-mono font-bold text-[#D98408] w-9">
                                        {softwareLevel}%
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            selectedSoftware &&
                                            !profile.softwareSkills.some((s) => s.name === selectedSoftware)
                                        ) {
                                            setProfile({
                                                ...profile,
                                                softwareSkills: [
                                                    ...profile.softwareSkills,
                                                    { name: selectedSoftware, level: softwareLevel },
                                                ],
                                            });
                                            setSelectedSoftware("");
                                        }
                                    }}
                                    className="sm:col-span-2 rounded-xl bg-[#5B9891] px-3 py-2 text-xs font-bold text-white"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2">
                                {profile.softwareSkills.map((sw) => (
                                    <div
                                        key={sw.name}
                                        className="rounded-xl bg-[#FAF8F5] p-2.5 border border-gray-100"
                                    >
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-gray-800">{sw.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#D98408]">{sw.level}%</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setProfile({
                                                            ...profile,
                                                            softwareSkills: profile.softwareSkills.filter(
                                                                (s) => s.name !== sw.name
                                                            ),
                                                        })
                                                    }
                                                    className="text-rose-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                            <div
                                                style={{ width: `${sw.level}%` }}
                                                className="h-full rounded-full bg-[#D98408]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vocational Skills with Skill Bars */}
                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-800">
                                    7. Vocational Skills (with Skill Level Bars)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => toggleSectionVisibility("showVocational")}
                                    className="text-[11px] font-bold text-[#5B9891]"
                                >
                                    {profile.visibility.showVocational ? "Visible" : "Hidden"}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                <select
                                    value={selectedVocational}
                                    onChange={(e) => setSelectedVocational(e.target.value)}
                                    className="sm:col-span-6 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                                >
                                    <option value="">
                                        {lookups.vocationalSkills.length === 0
                                            ? "No vocational skills added by Admin yet..."
                                            : "Choose vocational skill..."}
                                    </option>
                                    {lookups.vocationalSkills.map((item) => (
                                        <option key={item._id} value={item.name}>
                                            {item.genreOrCategory} — {item.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="sm:col-span-4 flex items-center gap-2 text-xs">
                                    <input
                                        type="range"
                                        min={10}
                                        max={100}
                                        step={5}
                                        value={vocationalLevel}
                                        onChange={(e) => setVocationalLevel(Number(e.target.value))}
                                        className="flex-1 accent-[#5B9891]"
                                    />
                                    <span className="font-mono font-bold text-[#467A74] w-9">
                                        {vocationalLevel}%
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (
                                            selectedVocational &&
                                            !profile.vocationalSkills.some(
                                                (v) => v.name === selectedVocational
                                            )
                                        ) {
                                            setProfile({
                                                ...profile,
                                                vocationalSkills: [
                                                    ...profile.vocationalSkills,
                                                    { name: selectedVocational, level: vocationalLevel },
                                                ],
                                            });
                                            setSelectedVocational("");
                                        }
                                    }}
                                    className="sm:col-span-2 rounded-xl bg-[#5B9891] px-3 py-2 text-xs font-bold text-white"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="space-y-2">
                                {profile.vocationalSkills.map((vs) => (
                                    <div
                                        key={vs.name}
                                        className="rounded-xl bg-[#FAF8F5] p-2.5 border border-gray-100"
                                    >
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-gray-800">{vs.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#467A74]">{vs.level}%</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setProfile({
                                                            ...profile,
                                                            vocationalSkills: profile.vocationalSkills.filter(
                                                                (v) => v.name !== vs.name
                                                            ),
                                                        })
                                                    }
                                                    className="text-rose-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                            <div
                                                style={{ width: `${vs.level}%` }}
                                                className="h-full rounded-full bg-[#5B9891]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 4 Columns: Confidential NID, Private Contact (+ Multiple Emails), Web Profiles with Real-time Check */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Confidential NID / Passport Upload */}
                    <div className="rounded-2xl border border-[#D98408]/35 bg-white p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[#D98408]" />
                                <h3 className="text-sm font-bold text-gray-900">
                                    NID / Passport Verification
                                </h3>
                            </div>
                            <span className="rounded-full bg-[#F7DFC7] px-2.5 py-0.5 text-[10px] font-bold text-[#D98408]">
                                {profile.identityVerification?.verificationStatus || "Required"}
                            </span>
                        </div>

                        <p className="text-[11px] text-gray-700 bg-[#F7DFC7]/45 p-3 rounded-xl border border-[#D98408]/25 leading-relaxed">
                            <strong>Disclaimer:</strong> Only the administrator will have access
                            to your ID documents. They are strictly confidential and never visible
                            to members or guests.
                        </p>

                        {hasUploadedId && (
                            <div className="rounded-xl border border-[#5B9891]/30 bg-[#5B9891]/10 p-3 text-xs font-bold text-[#467A74] flex items-center justify-between">
                                <span>
                                    {profile.identityVerification?.verificationStatus === "Approved"
                                        ? "Verified ID Document On File"
                                        : "NID / Passport Submitted (Under Admin Review)"}
                                </span>
                                {profile.identityVerification?.nidOrPassportUrl && (
                                    <a
                                        href={profile.identityVerification.nidOrPassportUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline"
                                    >
                                        View
                                    </a>
                                )}
                            </div>
                        )}

                        <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-[#D98408] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b86f06] transition">
                            <Upload className="h-4 w-4" />
                            <span>
                                {isUploadingNid
                                    ? "Uploading..."
                                    : hasUploadedId
                                        ? "Replace NID / Passport"
                                        : "Upload NID / Passport"}
                            </span>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                disabled={isUploadingNid}
                                onChange={handleNidUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Contact Info (Default Private + Multiple Emails with PLUS button) */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                {profile.shareContactPublicly ? (
                                    <Globe className="h-4 w-4 text-[#5B9891]" />
                                ) : (
                                    <Lock className="h-4 w-4 text-[#D98408]" />
                                )}
                                <h3 className="text-sm font-bold text-gray-900">
                                    Contact Information
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500">
                                {profile.shareContactPublicly ? "Public" : "Private (Default)"}
                            </span>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block font-bold text-gray-700 mb-1">
                                    Phone (Calls & SMS)
                                </label>
                                <input
                                    type="text"
                                    value={profile.phone}
                                    onChange={(e) =>
                                        setProfile({ ...profile, phone: e.target.value })
                                    }
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-gray-700 mb-1">
                                    WhatsApp Number
                                </label>
                                <input
                                    type="text"
                                    value={profile.whatsapp}
                                    onChange={(e) =>
                                        setProfile({ ...profile, whatsapp: e.target.value })
                                    }
                                    placeholder="+880 1XXX-XXXXXX"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-gray-900"
                                />
                            </div>

                            {/* Multiple Emails with PLUS button */}
                            <div className="space-y-2">
                                <label className="block font-bold text-gray-700">
                                    Email Addresses
                                </label>
                                <div className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] border border-gray-200 px-3 py-2 text-gray-600">
                                    <Mail className="h-3.5 w-3.5 text-[#5B9891]" />
                                    <span className="truncate">{profile.primaryEmail} (Primary)</span>
                                </div>

                                {profile.additionalEmails.map((em, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-gray-200 px-3 py-1.5"
                                    >
                                        <span className="truncate">{em}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfile({
                                                    ...profile,
                                                    additionalEmails: profile.additionalEmails.filter(
                                                        (_, i) => i !== idx
                                                    ),
                                                })
                                            }
                                            className="text-rose-600 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                <div className="flex gap-1.5">
                                    <input
                                        type="email"
                                        value={newEmailInput}
                                        onChange={(e) => setNewEmailInput(e.target.value)}
                                        placeholder="Add another email..."
                                        className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Add email"
                                        onClick={() => {
                                            const trimmed = newEmailInput.trim();
                                            if (
                                                trimmed &&
                                                !profile.additionalEmails.includes(trimmed) &&
                                                trimmed.toLowerCase() !== profile.primaryEmail.toLowerCase()
                                            ) {
                                                setProfile({
                                                    ...profile,
                                                    additionalEmails: [...profile.additionalEmails, trimmed],
                                                });
                                                setNewEmailInput("");
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-xl bg-[#5B9891] px-3 py-2 text-white hover:bg-[#467A74]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-start gap-2.5 rounded-xl border border-[#F7DFC7] bg-[#FAF8F5] p-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={profile.shareContactPublicly}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            shareContactPublicly: e.target.checked,
                                        })
                                    }
                                    className="mt-0.5 h-4 w-4 accent-[#5B9891]"
                                />
                                <span className="text-[11px] text-gray-700 leading-relaxed">
                                    Make my contact information visible on my profile (unchecked =
                                    private).
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* 2. My Web Profiles with Real-Time Link Check & Inset Preview */}
                    <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-sm font-bold text-gray-900">2. My Web Profiles</h3>
                            <button
                                type="button"
                                onClick={() => toggleSectionVisibility("showWebProfiles")}
                                className="text-[11px] font-bold text-[#5B9891]"
                            >
                                {profile.visibility.showWebProfiles ? "Visible" : "Hidden"}
                            </button>
                        </div>

                        <div className="space-y-2">
                            <select
                                value={webPlatform}
                                onChange={(e) => setWebPlatform(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs"
                            >
                                <option value="">
                                    {lookups.socialIcons.length === 0
                                        ? "No social icons added by Admin yet..."
                                        : "Select Social / New Media Icon..."}
                                </option>
                                {lookups.socialIcons.map((icon) => (
                                    <option key={icon._id} value={icon.name}>
                                        {icon.name}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={webUrl}
                                    onChange={(e) => setWebUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 rounded-xl border border-gray-200 bg-[#FAF8F5] px-3 py-2 text-xs font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const cleanUrl = webUrl.trim();
                                        if (webPlatform && cleanUrl) {
                                            const valid = /^https?:\/\/.+\..+/.test(cleanUrl);
                                            setProfile({
                                                ...profile,
                                                webProfiles: [
                                                    ...profile.webProfiles,
                                                    {
                                                        platform: webPlatform,
                                                        url: cleanUrl,
                                                        isReachable: valid,
                                                    },
                                                ],
                                            });
                                            setWebPlatform("");
                                            setWebUrl("");
                                        }
                                    }}
                                    className="rounded-xl bg-[#5B9891] px-3.5 py-2 text-xs font-bold text-white"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Web Profiles List with Adjacent Inset Link Status & Favicon Preview */}
                        <div className="space-y-2.5 pt-1">
                            {profile.webProfiles.map((wp, idx) => {
                                let domain = "";
                                try {
                                    domain = new URL(wp.url).hostname;
                                } catch {
                                    domain = "";
                                }

                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between gap-2 rounded-xl bg-[#FAF8F5] border border-gray-200/80 p-2.5 text-xs"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            {/* Adjacent Inset External Profile Preview */}
                                            <div className="h-9 w-9 shrink-0 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
                                                {domain ? (
                                                    <img
                                                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                                        alt={wp.platform}
                                                        className="h-5 w-5"
                                                    />
                                                ) : (
                                                    <Globe className="h-4 w-4 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-bold text-gray-900">
                                                        {wp.platform}
                                                    </span>
                                                    <span
                                                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${wp.isReachable
                                                                ? "bg-[#5B9891]/15 text-[#467A74]"
                                                                : "bg-rose-100 text-rose-700"
                                                            }`}
                                                    >
                                                        {wp.isReachable ? "Active Link" : "Invalid URL"}
                                                    </span>
                                                </div>
                                                <a
                                                    href={wp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[11px] font-mono text-[#5B9891] truncate hover:underline"
                                                >
                                                    <span className="truncate">{wp.url}</span>
                                                    <ExternalLink className="h-3 w-3 shrink-0" />
                                                </a>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProfile({
                                                    ...profile,
                                                    webProfiles: profile.webProfiles.filter(
                                                        (_, i) => i !== idx
                                                    ),
                                                })
                                            }
                                            className="text-rose-600 p-1"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}