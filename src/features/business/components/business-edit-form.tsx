"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  MapPin,
  Phone,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Globe,
} from "lucide-react";
import { ImageUploader } from "@/features/profile/components/image-uploader";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_TYPES,
  BANGLADESH_DIVISIONS,
  type BusinessUpdateInput,
} from "@/lib/validations/business";
import type { BusinessDocument } from "@/types/business";

interface BusinessEditFormProps {
  business: BusinessDocument;
}

export function BusinessEditForm({ business }: BusinessEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "contact" | "location" | "branding">("info");

  // Step 1: Info
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [businessType, setBusinessType] = useState(business.businessType);
  const [shortDescription, setShortDescription] = useState(business.shortDescription);
  const [fullDescription, setFullDescription] = useState(business.fullDescription);
  const [yearEstablished, setYearEstablished] = useState<number | undefined>(business.yearEstablished);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(business.visibility);

  // Step 2: Contact
  const [email, setEmail] = useState(business.contact.email);
  const [phone, setPhone] = useState(business.contact.phone);
  const [altPhone, setAltPhone] = useState(business.contact.altPhone || "");
  const [website, setWebsite] = useState(business.contact.website || "");
  const [facebook, setFacebook] = useState(business.contact.facebook || "");
  const [instagram, setInstagram] = useState(business.contact.instagram || "");
  const [linkedin, setLinkedin] = useState(business.contact.linkedin || "");

  // Step 3: Location
  const [division, setDivision] = useState(business.location.division);
  const [district, setDistrict] = useState(business.location.district);
  const [city, setCity] = useState(business.location.city);
  const [address, setAddress] = useState(business.location.address || "");
  const [postalCode, setPostalCode] = useState(business.location.postalCode || "");

  // Step 4: Branding
  const [logo, setLogo] = useState<string | null>(business.logo || null);
  const [coverImage, setCoverImage] = useState<string | null>(business.coverImage || null);

  // Submission state
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload: BusinessUpdateInput = {
      name: name.trim(),
      category,
      businessType,
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      yearEstablished: yearEstablished ? Number(yearEstablished) : undefined,
      email: email.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim() || undefined,
      website: website.trim() || undefined,
      facebook: facebook.trim() || undefined,
      instagram: instagram.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      division,
      district: district.trim(),
      city: city.trim(),
      address: address.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      logo: logo || undefined,
      coverImage: coverImage || undefined,
      visibility,
    };

    try {
      const res = await fetch(`/api/member/business/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to update business.");
      }

      setSuccessMsg("Business updated successfully!");
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl shadow-xl border border-gray-200/80">
        <div className="flex items-center gap-3">
          <Link
            href={`/member/business/${business.id}`}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Back to business overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Business Profile</h1>
            <p className="text-xs text-gray-500">
              Update branding, official contacts, and operating details for {business.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href={`/member/business/${business.id}`}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "info", label: "Business Information", icon: Store },
          { id: "contact", label: "Contacts & Socials", icon: Phone },
          { id: "location", label: "Location & Region", icon: MapPin },
          { id: "branding", label: "Branding & Imagery", icon: Camera },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all shadow-xs ${
                isActive
                  ? "bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESS INFORMATION */}
      {activeTab === "info" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            General Business Details
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
              >
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Entity Type *
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tagline / Short Summary *
              </label>
              <span className="text-[11px] text-gray-400">{shortDescription.length} / 200</span>
            </div>
            <input
              type="text"
              maxLength={200}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Detailed Business Story *
              </label>
              <span className="text-[11px] text-gray-400">{fullDescription.length} / 3000</span>
            </div>
            <textarea
              rows={5}
              maxLength={3000}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Year Established
              </label>
              <input
                type="number"
                min={1971}
                max={new Date().getFullYear()}
                value={yearEstablished || ""}
                onChange={(e) => setYearEstablished(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Public Directory Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
              >
                <option value="PUBLIC">Public (Visible in Directory when approved)</option>
                <option value="PRIVATE">Private (Hidden from Directory)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACTS */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Official Contact Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Business Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Business Phone *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Alternative Phone
              </label>
              <input
                type="tel"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Facebook Page
              </label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                LinkedIn Company URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION */}
      {activeTab === "location" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-5">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Operating Region &amp; Studio Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Division *
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6]"
              >
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                District *
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                City / Area *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Physical Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BRANDING */}
      {activeTab === "branding" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/80 space-y-6">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Branding Imagery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <ImageUploader
              type="avatar"
              label="Business Logo"
              currentUrl={logo}
              onUploaded={(url) => setLogo(url)}
            />

            <ImageUploader
              type="cover"
              label="Cover Banner"
              currentUrl={coverImage}
              onUploaded={(url) => setCoverImage(url)}
            />
          </div>
        </div>
      )}

      {/* Floating Save button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href={`/member/business/${business.id}`}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] disabled:opacity-70 text-white text-sm font-bold shadow-lg shadow-[#5B46F6]/25 flex items-center gap-2 transition-all active:scale-[0.98]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Business Details</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
