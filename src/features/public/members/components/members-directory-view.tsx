"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  Users,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { MemberCard } from "./member-card";
import type { PublicMemberProfile } from "@/types/profile";

interface MembersDirectoryViewProps {
  initialMembers?: PublicMemberProfile[];
}

const WINGS = [
  "All Wings",
  "Tech & Digital",
  "Creative & Arts",
  "Business & Commerce",
  "Corporate & Leadership",
  "Diaspora & Global",
  "Health & Wellness",
];

const DISTRICTS = [
  "All Districts",
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
  "Bogura",
  "Cox's Bazar",
  "International / Diaspora",
];

const POPULAR_SKILLS = [
  "UI/UX Design",
  "Next.js",
  "Ecommerce",
  "Halal Bakery",
  "Digital Marketing",
  "Modest Fashion",
  "Content Strategy",
  "Accounting",
];

// Fallback demo dataset representing Bangladeshi sisters across wings & districts
const DEMO_MEMBERS: PublicMemberProfile[] = [
  {
    userId: "mem_001",
    displayName: "Nusrat Jahan",
    headline: "Founder at Dhaka Modest Wear & Ecommerce Strategist",
    bio: "Passionate entrepreneur empowering women in ethical apparel and cross-border ecommerce.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    location: { district: "Dhaka", division: "Dhaka", country: "Bangladesh" },
    skills: [
      { id: "s1", name: "Ecommerce" },
      { id: "s2", name: "Modest Fashion" },
      { id: "s3", name: "Digital Marketing" },
    ],
    isVerified: true,
    membershipTier: "PREMIUM",
    createdAt: "2024-01-10",
  },
  {
    userId: "mem_002",
    displayName: "Farzana Rahman",
    headline: "Senior Frontend Engineer & Open-Source Advocate",
    bio: "Specializing in React, Next.js, and accessible design systems. Mentoring junior female devs.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    location: { district: "Chattogram", division: "Chattogram", country: "Bangladesh" },
    skills: [
      { id: "s4", name: "Next.js" },
      { id: "s5", name: "UI/UX Design" },
      { id: "s6", name: "TypeScript" },
    ],
    isVerified: true,
    membershipTier: "PREMIUM",
    createdAt: "2024-02-15",
  },
  {
    userId: "mem_003",
    displayName: "Sabrina Akter",
    headline: "Artisanal Baker & Culinary Instructor at Sylhet Treats",
    bio: "Custom tiered wedding cakes, organic sourdough, and culinary workshop creator in Sylhet.",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80",
    location: { district: "Sylhet", division: "Sylhet", country: "Bangladesh" },
    skills: [
      { id: "s7", name: "Halal Bakery" },
      { id: "s8", name: "Culinary Arts" },
      { id: "s9", name: "Event Planning" },
    ],
    isVerified: true,
    membershipTier: "BASIC",
    createdAt: "2024-03-01",
  },
  {
    userId: "mem_004",
    displayName: "Tasmia Chowdhury",
    headline: "Brand Identity Designer & Creative Director",
    bio: "Helping female-led small businesses build timeless, meaningful visual branding.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    location: { district: "Dhaka", division: "Dhaka", country: "Bangladesh" },
    skills: [
      { id: "s10", name: "UI/UX Design" },
      { id: "s11", name: "Content Strategy" },
      { id: "s12", name: "Typography" },
    ],
    isVerified: false,
    membershipTier: "FREE",
    createdAt: "2024-03-20",
  },
  {
    userId: "mem_005",
    displayName: "Anika Tabassum",
    headline: "Chartered Financial Analyst & Business Mentor",
    bio: "Advising startups on cash-flow optimization, tax compliance, and funding preparedness.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    location: { district: "Rajshahi", division: "Rajshahi", country: "Bangladesh" },
    skills: [
      { id: "s13", name: "Accounting" },
      { id: "s14", name: "Financial Modeling" },
      { id: "s15", name: "Mentorship" },
    ],
    isVerified: true,
    membershipTier: "PREMIUM",
    createdAt: "2024-04-05",
  },
  {
    userId: "mem_006",
    displayName: "Dr. Mehreen Haque",
    headline: "Public Health Researcher & Wellness Consultant",
    bio: "Advocating for maternal health, nutritional literacy, and mindful living for working women.",
    avatar: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&auto=format&fit=crop&q=80",
    location: { district: "International / Diaspora", division: "Diaspora", country: "United Kingdom" },
    skills: [
      { id: "s16", name: "Public Health" },
      { id: "s17", name: "Wellness" },
      { id: "s18", name: "Research" },
    ],
    isVerified: true,
    membershipTier: "ENTERPRISE",
    createdAt: "2024-04-18",
  },
];

export function MembersDirectoryView({ initialMembers }: MembersDirectoryViewProps) {
  const members = initialMembers && initialMembers.length > 0 ? initialMembers : DEMO_MEMBERS;

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWing, setSelectedWing] = useState("All Wings");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "name" | "updated">("newest");

  // Filtering & Sorting
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = member.displayName?.toLowerCase().includes(q);
          const matchHeadline = member.headline?.toLowerCase().includes(q);
          const matchBio = member.bio?.toLowerCase().includes(q);
          const matchSkill = member.skills?.some((s) => s.name.toLowerCase().includes(q));
          if (!matchName && !matchHeadline && !matchBio && !matchSkill) return false;
        }

        // District filter
        if (selectedDistrict !== "All Districts") {
          const dist = member.location?.district || member.location?.city || "";
          if (selectedDistrict === "International / Diaspora") {
            if (member.location?.country === "Bangladesh" && dist !== "Diaspora") return false;
          } else if (!dist.toLowerCase().includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }

        // Skill tag filter
        if (selectedSkill) {
          const hasSkill = member.skills?.some(
            (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
          );
          if (!hasSkill) return false;
        }

        // Verified-only filter
        if (onlyVerified && !member.isVerified) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return (a.displayName || "").localeCompare(b.displayName || "");
        }
        if (sortBy === "updated") {
          return 0; // standard fallback
        }
        // Default: newest first
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [members, searchTerm, selectedWing, selectedDistrict, selectedSkill, onlyVerified, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedWing("All Wings");
    setSelectedDistrict("All Districts");
    setSelectedSkill(null);
    setOnlyVerified(false);
    setSortBy("newest");
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedWing !== "All Wings" ||
    selectedDistrict !== "All Districts" ||
    Boolean(selectedSkill) ||
    onlyVerified;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#5B46F6] via-[#4C38E0] to-[#3726B8] p-8 sm:p-12 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-purple-100">
            <Users className="w-3.5 h-3.5" />
            <span>Authenticated Sisterhood Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Connect with Bangladesh&apos;s Brightest Women Leaders & Founders
          </h1>
          <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
            Discover verified sisters across Bangladesh and the global diaspora. Collaborate, hire, mentor, and build thriving businesses together in a safe, women-only community.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200/80 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, skill, or bio..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200/80 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-sm transition-all"
            />
          </div>

          {/* District Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              aria-label="Filter by District"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-sm transition-all bg-white text-gray-700"
            >
              {DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "name" | "updated")}
              aria-label="Sort Members"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 outline-none text-sm transition-all bg-white text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name (A–Z)</option>
              <option value="updated">Recently Active</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="md:col-span-2 flex items-center">
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`w-full py-3 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                onlyVerified
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${onlyVerified ? "text-emerald-600" : "text-gray-400"}`} />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Popular Skill Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
            Top Skills:
          </span>
          {POPULAR_SKILLS.map((sk) => {
            const isSelected = selectedSkill === sk;
            return (
              <button
                key={sk}
                type="button"
                onClick={() => setSelectedSkill(isSelected ? null : sk)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#5B46F6] text-white shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200/70 text-gray-700"
                }`}
              >
                {sk}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors py-1 px-2"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          Showing <strong>{filteredMembers.length}</strong> active{" "}
          {filteredMembers.length === 1 ? "sister" : "sisters"}
        </span>
        {onlyVerified && (
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Showing authenticated profiles only
          </span>
        )}
      </div>

      {/* Directory Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.userId} member={member} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5B46F6] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">No Sisters Found Matching Criteria</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your search terms, changing the district filter, or resetting the active skill tags.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] text-white text-xs font-semibold shadow-md hover:bg-[#4C38E0] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
