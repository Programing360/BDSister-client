"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  DollarSign,
  ArrowLeft,
  Sparkles,
  Info,
  Save,
  CheckCircle2,
} from "lucide-react";
import type { EventItem, EventStatus, EventFormat, EventType } from "../../types/event";
import { DEMO_EVENT_CATEGORIES } from "../../data/mock-events";

interface EventFormProps {
  initialData?: EventItem;
  isEdit?: boolean;
}

export function EventForm({ initialData, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<EventItem>>(
    initialData || {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      categoryId: DEMO_EVENT_CATEGORIES[0]?.id || "evt-cat-1",
      categoryName: DEMO_EVENT_CATEGORIES[0]?.name || "Entrepreneurship & Startup Summits",
      eventType: "CONFERENCE",
      format: "PHYSICAL",
      organizer: {
        name: "BDSisters Admin Team",
        role: "Event Director",
        email: "events@bdsisters.org",
      },
      coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
      startDate: "2025-05-15",
      startTime: "09:30",
      endDate: "2025-05-15",
      endTime: "18:00",
      timezone: "GMT+6 (Dhaka)",
      registrationOpeningDate: "2025-04-01",
      registrationClosingDate: "2025-05-12",
      venue: {
        name: "BICC (Bangabandhu International Conference Center)",
        address: "Sher-e-Bangla Nagar, Agargaon",
        city: "Dhaka",
      },
      onlinePlatform: {
        platformName: "Zoom Webinar / YouTube Live",
        placeholderMeetingUrl: "https://zoom.us/j/demo-placeholder",
      },
      registrationCount: 0,
      capacity: 150,
      isRegistrationOpen: true,
      allowWaitlist: true,
      ticketPriceBDT: 0,
      status: "DRAFT",
    }
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : slug,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    const cat = DEMO_EVENT_CATEGORIES.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      categoryId: catId,
      categoryName: cat?.name || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage(
        `[DEMO] Event "${formData.title}" ${
          isEdit ? "updated" : "created"
        } successfully. Changes are simulated locally.`
      );
      setTimeout(() => {
        router.push("/admin/events/all");
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Toast */}
      {toastMessage && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/events/all"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events List
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          {isEdit ? "Editing Mode" : "New Event Draft"}
        </div>
      </div>

      {/* Notice Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO MODE:</span> Forms validate and simulate save operations locally. No database transactions or live calendar broadcasts will occur.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="150"
        className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-8"
      >
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              1. Event Overview & Classification
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Define the core title, category, format, and description.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="e.g. Bangladesh Women Tech Leaders Summit 2025"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Event Slug
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="slug-url-identifier"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                {DEMO_EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    eventType: e.target.value as EventType,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="CONFERENCE">Conference</option>
                <option value="SEMINAR">Seminar</option>
                <option value="WEBINAR">Webinar</option>
                <option value="NETWORKING">Networking Meetup</option>
                <option value="EXHIBITION">Exhibition / Fair</option>
                <option value="TRAINING">Training Session</option>
                <option value="MASTERCLASS">Masterclass</option>
                <option value="COMMUNITY">Community Circle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Delivery Format
              </label>
              <select
                value={formData.format}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    format: e.target.value as EventFormat,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="PHYSICAL">Physical (In-Person)</option>
                <option value="ONLINE">Online (Virtual Stream)</option>
                <option value="HYBRID">Hybrid (Both)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Short Summary (1-2 sentences)
              </label>
              <input
                type="text"
                value={formData.shortDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: e.target.value,
                  }))
                }
                placeholder="Brief one-line hook for event cards"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Full Event Description
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullDescription: e.target.value,
                  }))
                }
                placeholder="Detailed itinerary, agenda, learning outcomes, keynote speakers..."
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 2: Date, Time & Venue */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              2. Timing, Schedule & Location
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Specify schedule dates and physical or virtual venues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            {/* Venue (if physical or hybrid) */}
            {(formData.format === "PHYSICAL" || formData.format === "HYBRID") && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.venue?.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        venue: {
                          name: e.target.value,
                          address: prev.venue?.address || "",
                          city: prev.venue?.city || "Dhaka",
                        },
                      }))
                    }
                    placeholder="e.g. Bangabandhu International Conference Center"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.venue?.city || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        venue: {
                          name: prev.venue?.name || "",
                          address: prev.venue?.address || "",
                          city: e.target.value,
                        },
                      }))
                    }
                    placeholder="Dhaka, Chittagong, Sylhet..."
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Address Line
                  </label>
                  <input
                    type="text"
                    value={formData.venue?.address || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        venue: {
                          name: prev.venue?.name || "",
                          address: e.target.value,
                          city: prev.venue?.city || "",
                        },
                      }))
                    }
                    placeholder="Street, area, road number"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </>
            )}

            {/* Online info (if online or hybrid) */}
            {(formData.format === "ONLINE" || formData.format === "HYBRID") && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Virtual Platform Name
                  </label>
                  <input
                    type="text"
                    value={formData.onlinePlatform?.platformName || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        onlinePlatform: {
                          platformName: e.target.value,
                          placeholderMeetingUrl:
                            prev.onlinePlatform?.placeholderMeetingUrl || "",
                        },
                      }))
                    }
                    placeholder="Zoom Webinar, Google Meet, YouTube Live"
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                    Stream / Meeting URL (Placeholder)
                  </label>
                  <input
                    type="text"
                    value={formData.onlinePlatform?.placeholderMeetingUrl || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        onlinePlatform: {
                          platformName:
                            prev.onlinePlatform?.platformName || "Zoom",
                          placeholderMeetingUrl: e.target.value,
                        },
                      }))
                    }
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Capacity, Tickets & Pricing */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              3. Capacity, Pricing & Registration
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Set attendance limits, ticket pricing via ZiniPay, and waitlist settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Maximum Capacity (Seats)
              </label>
              <input
                type="number"
                min={1}
                value={formData.capacity || 100}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                General Ticket Price (BDT)
              </label>
              <input
                type="number"
                min={0}
                value={formData.ticketPriceBDT ?? 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ticketPriceBDT: Number(e.target.value),
                  }))
                }
                placeholder="0 for Free"
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
              <span className="text-[11px] text-brand-muted">
                {formData.ticketPriceBDT === 0 ? "Free access" : "Processed via ZiniPay"}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as EventStatus,
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={formData.isRegistrationOpen ?? true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRegistrationOpen: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/30"
              />
              Accept Registrations Now
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-navy">
              <input
                type="checkbox"
                checked={formData.allowWaitlist ?? true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    allowWaitlist: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/30"
              />
              Enable Automatic Waitlist When Full
            </label>
          </div>
        </div>

        {/* Section 4: Visuals & Organizer */}
        <div className="space-y-4">
          <div className="border-b border-brand-primary/10 pb-3">
            <h2 className="text-lg font-semibold text-brand-navy">
              4. Media & Organizer Profile
            </h2>
            <p className="text-xs text-brand-muted font-normal">
              Cover image banner and designated organizer point-of-contact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Cover Image URL
              </label>
              <input
                type="text"
                value={formData.coverImageUrl || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, coverImageUrl: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Lead Organizer Name
              </label>
              <input
                type="text"
                value={formData.organizer?.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    organizer: {
                      name: e.target.value,
                      role: prev.organizer?.role || "Event Coordinator",
                      email: prev.organizer?.email || "events@bdsisters.org",
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Organizer Email
              </label>
              <input
                type="email"
                value={formData.organizer?.email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    organizer: {
                      name: prev.organizer?.name || "BDSisters Admin",
                      role: prev.organizer?.role || "Event Coordinator",
                      email: e.target.value,
                    },
                  }))
                }
                className="w-full px-4 py-2.5 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-primary/10">
          <Link
            href="/admin/events/all"
            className="px-5 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Simulating Save..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
