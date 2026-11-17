"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  MapPin,
  Phone,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Briefcase,
  Globe,
  Upload,
} from "lucide-react";
import { ImageUploader } from "@/features/profile/components/image-uploader";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_TYPES,
  BANGLADESH_DIVISIONS,
  type BusinessRegistrationInput,
} from "@/lib/validations/business";

export function BusinessRegistrationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic
  const [name, setName] = useState("");
  const [category, setCategory] = useState(BUSINESS_CATEGORIES[0]);
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [yearEstablished, setYearEstablished] = useState<number | undefined>(undefined);

  // Step 2: Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Step 3: Location
  const [country, setCountry] = useState("Bangladesh");
  const [division, setDivision] = useState<string>("Dhaka");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Step 4: Branding
  const [logo, setLogo] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Submission state
  const [isDraft, setIsDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validation helpers for advancing steps
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMsg("Business name must be at least 2 characters.");
        return false;
      }
      if (!shortDescription.trim() || shortDescription.trim().length < 10) {
        setErrorMsg("Please provide a short description or tagline of at least 10 characters.");
        return false;
      }
      if (!fullDescription.trim() || fullDescription.trim().length < 20) {
        setErrorMsg("Please write at least 20 characters about your business vision and story.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please provide a valid business email address.");
        return false;
      }
      if (!phone.trim() || phone.trim().length < 6) {
        setErrorMsg("Please provide a valid business contact phone number.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!district.trim()) {
        setErrorMsg("Please specify your home or business district.");
        return false;
      }
      if (!city.trim()) {
        setErrorMsg("Please enter your city, town, or area.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (submitForReview: boolean) => {
    setErrorMsg(null);
    setSubmitting(true);
    setIsDraft(!submitForReview);

    const payload: BusinessRegistrationInput = {
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
      country,
      division,
      district: district.trim(),
      city: city.trim(),
      address: address.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      logo: logo || undefined,
      coverImage: coverImage || undefined,
      visibility: "PUBLIC",
      submitForReview,
    };

    try {
      const res = await fetch("/api/member/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to register business.");
      }

      const created = data.data.business;
      router.push(`/member/business/${created.id}`);
    } catch (err) {
      setErrorMsg((err as Error).message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const STEPS = [
    { num: 1, title: "Overview", icon: Store },
    { num: 2, title: "Contact", icon: Phone },
    { num: 3, title: "Location", icon: MapPin },
    { num: 4, title: "Branding", icon: Camera },
    { num: 5, title: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/member/business"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Businesses</span>
        </Link>
        <span className="text-xs font-bold text-[#5B46F6]">Step {currentStep} of 5</span>
      </div>

      {/* Step Indicator Pills */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = s.num < currentStep;
          const isCurrent = s.num === currentStep;

          return (
            <div
              key={s.num}
              className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? "bg-[#5B46F6] text-white border-[#5B46F6] shadow-md shadow-[#5B46F6]/20"
                  : isDone
                  ? "bg-purple-50 text-[#5B46F6] border-purple-200"
                  : "bg-white text-gray-400 border-gray-200/80"
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <p className="text-[11px] font-bold truncate hidden sm:block">{s.title}</p>
            </div>
          );
        })}
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-gray-200/80 space-y-6">
        {/* STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Step 1 — Basic Business Information</h2>
              <p className="text-xs text-gray-500">
                Identify your enterprise name, category, legal entity, and story.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. SilkHeritage Studio & Boutique"
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] focus:ring-2 focus:ring-[#5B46F6]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6] transition-all"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Business Entity Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none bg-white focus:border-[#5B46F6] transition-all"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tagline / Short Summary <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">{shortDescription.length} / 200</span>
              </div>
              <input
                type="text"
                maxLength={200}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Handcrafted Jamdani and sustainable silk apparel empowering rural weavers."
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full Business Story &amp; Offerings <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">{fullDescription.length} / 3000</span>
              </div>
              <textarea
                rows={5}
                maxLength={3000}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Tell potential clients and sisters about your products, founding vision, quality standards, and craftsmanship..."
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] transition-all resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Year Established (Optional)
              </label>
              <input
                type="number"
                min={1971}
                max={new Date().getFullYear()}
                value={yearEstablished || ""}
                onChange={(e) => setYearEstablished(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g. 2021"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6] transition-all"
              />
            </div>
          </div>
        )}

        {/* STEP 2: CONTACT & SOCIALS */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Step 2 — Business Contact Information</h2>
              <p className="text-xs text-gray-500">
                Official contact channels for orders, partnership inquiries, and client communication.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@mybrand.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Business Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711 000000"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="+880 1811 000000"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Official Website (Optional)
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://silkheritage.com"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Facebook Page (Optional)
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/mybrand"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Instagram Handle / URL (Optional)
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/mybrand"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  LinkedIn Company Page (Optional)
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/company/mybrand"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Step 3 — Business Location &amp; Region</h2>
              <p className="text-xs text-gray-500">
                Helps local clients find your workshop or regional delivery presence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Division <span className="text-red-500">*</span>
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
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Dhaka, Sylhet, Bogura..."
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  City / Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhanmondi, Uttara, Zindabazar..."
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Postal Code (Optional)
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 1209"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Physical Address / Studio Location (Optional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House 42, Road 7, Sector 3"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/80 text-sm outline-none focus:border-[#5B46F6]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BRANDING */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Step 4 — Business Branding &amp; Imagery</h2>
              <p className="text-xs text-gray-500">
                Upload your brand logo and store cover banner. (You can also add or change these later).
              </p>
            </div>

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

        {/* STEP 5: REVIEW & SUBMIT */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Step 5 — Review &amp; Submit Registration</h2>
              <p className="text-xs text-gray-500">
                Verify your business information before submitting for institutional sisterhood accreditation.
              </p>
            </div>

            {/* Summary Review Card */}
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{name}</h3>
                  <p className="text-gray-500">{category} • {businessType}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Ready for Review
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-gray-700 uppercase">Contact</p>
                  <p className="text-gray-600">{email} | {phone}</p>
                  {website && <p className="text-[#5B46F6]">{website}</p>}
                </div>
                <div>
                  <p className="font-bold text-gray-700 uppercase">Location</p>
                  <p className="text-gray-600">{city}, {district}, {division}</p>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-700 uppercase">Tagline</p>
                <p className="text-gray-600 leading-relaxed">{shortDescription}</p>
              </div>
            </div>

            {/* Moderation policy note */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-gray-600 leading-relaxed">
              <strong>Institutional Accreditation Process:</strong> Upon submission, your business status will be marked as <em>Pending Review</em>. Our verification team reviews trade credibility within 24-48 business hours. You can continue configuring your shop and policies immediately.
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep === 5 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  {submitting && isDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save as Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 transition-all flex items-center gap-2 active:scale-[0.98]"
                >
                  {submitting && !isDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Submit for Review</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#5B46F6] hover:bg-[#4C38E0] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B46F6]/25 transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
