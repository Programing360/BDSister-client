"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Heart,
  Languages,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import type { SkillItem, LanguageItem, SkillLevel, LanguageProficiency } from "@/types/profile";

interface SkillsManagerProps {
  initialSkills?: SkillItem[];
  initialInterests?: string[];
  initialLanguages?: LanguageItem[];
}

const POPULAR_SKILLS = [
  "Digital Marketing",
  "Product Design",
  "Fashion & Apparel",
  "Culinary Arts & Bakery",
  "Financial Literacy",
  "Web Development",
  "Handicrafts & Boutique",
  "Public Speaking",
  "Content Writing",
  "Project Management",
];

const POPULAR_INTERESTS = [
  "Women Leadership",
  "SME Business",
  "Tech & AI",
  "Social Entrepreneurship",
  "Handmade Products",
  "Health & Wellness",
  "E-Commerce",
  "Mentorship",
];

export function SkillsManager({
  initialSkills = [],
  initialInterests = [],
  initialLanguages = [],
}: SkillsManagerProps) {
  const router = useRouter();

  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("INTERMEDIATE");

  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [newInterest, setNewInterest] = useState("");

  const [languages, setLanguages] = useState<LanguageItem[]>(
    initialLanguages.length > 0
      ? initialLanguages
      : [{ language: "Bengali", proficiency: "NATIVE" }]
  );
  const [newLangName, setNewLangName] = useState("");
  const [newLangProf, setNewLangProf] = useState<LanguageProficiency>("CONVERSATIONAL");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Skill Add/Remove
  const handleAddSkill = (nameToAdd?: string) => {
    const name = (nameToAdd || newSkillName).trim();
    if (!name) return;
    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      return;
    }
    setSkills([
      ...skills,
      {
        id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name,
        level: newSkillLevel,
      },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  // Interest Add/Remove
  const handleAddInterest = (tagToAdd?: string) => {
    const raw = (tagToAdd || newInterest).trim().replace(/^#/, "");
    if (!raw) return;
    if (interests.some((i) => i.toLowerCase() === raw.toLowerCase())) {
      return;
    }
    setInterests([...interests, raw]);
    setNewInterest("");
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  // Language Add/Remove
  const handleAddLanguage = () => {
    const name = newLangName.trim();
    if (!name) return;
    if (languages.some((l) => l.language.toLowerCase() === name.toLowerCase())) {
      return;
    }
    setLanguages([...languages, { language: name, proficiency: newLangProf }]);
    setNewLangName("");
  };

  const handleRemoveLanguage = (langName: string) => {
    setLanguages(languages.filter((l) => l.language !== langName));
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          interests,
          languages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update skills & interests.");
      }

      setSuccessMsg("Skills, interests & languages saved successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/member/profile"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Back to profile"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Skills, Interests & Languages
            </h1>
            <p className="text-xs text-gray-500">
              Highlight your superpowers and discover complementary sisters across the network.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/member/profile"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Back to Profile
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* 1. SKILLS MANAGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5B46F6] flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Professional Skills</h2>
            <p className="text-xs text-gray-500">
              List the tools, crafts, and skills you excel at.
            </p>
          </div>
        </div>

        {/* Add skill input row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="e.g. Accounting, Tailoring, Figma, Python..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
          />

          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            className="px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="EXPERT">Expert</option>
          </select>

          <button
            type="button"
            onClick={() => handleAddSkill()}
            className="px-4 py-2.5 rounded-2xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Current Skills list */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Your Active Skills ({skills.length})
          </label>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200/80 text-xs font-semibold text-gray-900 flex items-center gap-2 shadow-xs group"
                >
                  <span>{skill.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      skill.level === "EXPERT"
                        ? "bg-[#5B46F6] text-white"
                        : skill.level === "INTERMEDIATE"
                        ? "bg-purple-200 text-purple-900"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {skill.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No skills added yet.</p>
          )}
        </div>

        {/* Popular skill suggestions */}
        <div className="pt-2">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Suggested Skills (Click to add)
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SKILLS.filter(
              (p) => !skills.some((s) => s.name.toLowerCase() === p.toLowerCase())
            ).map((sugg) => (
              <button
                key={sugg}
                type="button"
                onClick={() => handleAddSkill(sugg)}
                className="px-3 py-1 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200/70 hover:border-purple-300 text-xs text-gray-600 hover:text-[#5B46F6] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{sugg}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. INTERESTS MANAGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Community & Business Interests</h2>
            <p className="text-xs text-gray-500">
              Connect with sisters who share identical passions or industry curiosities.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddInterest();
              }
            }}
            placeholder="e.g. Sustainable Fashion, AI for Business..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
          />
          <button
            type="button"
            onClick={() => handleAddInterest()}
            className="px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Interest</span>
          </button>
        </div>

        {/* Current Interests */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
            Your Selected Interests ({interests.length})
          </label>
          {interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interests.map((tag) => (
                <div
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-semibold text-pink-800 flex items-center gap-1.5"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(tag)}
                    className="text-pink-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No interests added yet.</p>
          )}
        </div>

        {/* Popular suggestions */}
        <div className="pt-2">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Suggested Community Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_INTERESTS.filter(
              (p) => !interests.some((i) => i.toLowerCase() === p.toLowerCase())
            ).map((sugg) => (
              <button
                key={sugg}
                type="button"
                onClick={() => handleAddInterest(sugg)}
                className="px-3 py-1 rounded-full bg-gray-50 hover:bg-pink-50 border border-gray-200/70 hover:border-pink-300 text-xs text-gray-600 hover:text-pink-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>#{sugg}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. LANGUAGES MANAGER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Languages</h2>
            <p className="text-xs text-gray-500">
              Languages you use to communicate with sisters and global partners.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            placeholder="e.g. English, Bengali, Hindi, Arabic..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
          />

          <select
            value={newLangProf}
            onChange={(e) => setNewLangProf(e.target.value as LanguageProficiency)}
            className="px-4 py-2.5 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
          >
            <option value="BASIC">Basic</option>
            <option value="CONVERSATIONAL">Conversational</option>
            <option value="FLUENT">Fluent</option>
            <option value="NATIVE">Native / Bilingual</option>
          </select>

          <button
            type="button"
            onClick={handleAddLanguage}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Language</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((item) => (
            <div
              key={item.language}
              className="p-3 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between shadow-xs"
            >
              <div>
                <p className="text-sm font-bold text-gray-900">{item.language}</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700">
                  {item.proficiency}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLanguage(item.language)}
                className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                title="Remove language"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Bottom Floating Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-sm font-semibold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
