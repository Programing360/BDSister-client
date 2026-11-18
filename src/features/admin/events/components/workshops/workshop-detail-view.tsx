"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
} from "lucide-react";
import type { WorkshopItem, EventStatus } from "../../types/event";
import {
  EventStatusBadge,
  EventFormatBadge,
} from "../common/event-status-badge";

interface WorkshopDetailViewProps {
  workshop: WorkshopItem;
}

export function WorkshopDetailView({
  workshop: initialWorkshop,
}: WorkshopDetailViewProps) {
  const [workshop, setWorkshop] = useState<WorkshopItem>(initialWorkshop);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const handleToggleStatus = () => {
    const nextStatus: EventStatus =
      workshop.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setWorkshop((prev) => ({ ...prev, status: nextStatus }));
    showToast(
      `[DEMO] Workshop status changed to "${nextStatus}". Changes are simulated locally.`
    );
  };

  const capacityPct = Math.min(
    100,
    Math.round((workshop.registrationCount / workshop.capacity) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {simulationToast && (
        <div
          data-aos="fade-down"
          className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-brand-navy/95 text-white rounded-xl shadow-[0_12px_36px_rgba(91,70,246,0.3)] border border-brand-primary/40 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-top-4"
        >
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0 animate-pulse" />
          <span>{simulationToast}</span>
          <button
            onClick={() => setSimulationToast(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Header and Back Link */}
      <div
        data-aos="fade-up"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <Link
          href="/admin/events/workshops"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-muted hover:text-brand-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Workshops
        </Link>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleStatus}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              workshop.status === "PUBLISHED"
                ? "border-amber-400 text-amber-800 bg-amber-50 hover:bg-amber-100"
                : "border-emerald-400 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
            }`}
          >
            {workshop.status === "PUBLISHED"
              ? "Pause Enrollment"
              : "Publish Workshop"}
          </button>
          <Link
            href={`/admin/events/workshops/${workshop.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Workshop
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA NOTICE:</span> Workshop curriculum, instructor bio, and registration progress are simulated local records.
        </p>
      </div>

      {/* Two Column Showcase (Cover on Left, Rich Details on Right) */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 p-6 lg:p-8 shadow-[0_12px_40px_rgb(91,70,246,0.08)]"
      >
        {/* Left Side: Cover Image with cover styling */}
        <div className="lg:col-span-5 space-y-4" data-aos="fade-right">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-primary/15 shadow-[0_8px_24px_rgba(91,70,246,0.12)] group">
            <Image
              src={workshop.coverImageUrl}
              alt={workshop.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent"></div>
            <div className="absolute top-3 left-3 flex gap-1.5">
              <EventStatusBadge status={workshop.status} />
              <EventFormatBadge format={workshop.format} />
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                {workshop.category}
              </span>
              <p className="text-sm font-semibold truncate">{workshop.duration}</p>
            </div>
          </div>

          {/* Seat Capacity Progress */}
          <div className="p-4 rounded-xl bg-brand-surface/70 border border-brand-primary/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-navy">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-primary" />
                Enrollment Capacity
              </span>
              <span>
                {workshop.registrationCount} / {workshop.capacity} seats ({capacityPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-primary/15 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  capacityPct >= 90 ? "bg-amber-500" : "bg-brand-primary"
                }`}
                style={{ width: `${capacityPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-brand-muted">
              <span>{workshop.capacity - workshop.registrationCount} seats left</span>
              <span>
                Fee: {workshop.priceBDT === 0 ? "Free" : `৳ ${workshop.priceBDT} BDT`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Workshop Details & Curriculum */}
        <div className="lg:col-span-7 space-y-6" data-aos="fade-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              Intensive Workshop
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-brand-navy tracking-tight leading-snug">
              {workshop.title}
            </h1>
            <p className="text-xs font-mono text-brand-muted">
              ID: {workshop.id} • Slug: /{workshop.slug}
            </p>
          </div>

          {/* Quick Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-brand-surface/60 border border-brand-primary/10 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-muted font-medium">Session Date</p>
                <p className="font-semibold text-brand-navy">{workshop.startDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-muted font-medium">Time & Duration</p>
                <p className="font-semibold text-brand-navy">
                  {workshop.startTime} ({workshop.duration})
                </p>
              </div>
            </div>
          </div>

          {/* Instructor Profile Card */}
          <div className="p-4 rounded-xl bg-white border border-brand-primary/15 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-brand-primary font-semibold">
                Lead Master Instructor
              </span>
              <span className="text-[11px] font-medium text-brand-muted">
                {workshop.instructor.organization}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-brand-navy">
              {workshop.instructor.name}
            </h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              {workshop.instructor.bio}
            </p>
          </div>

          {/* Practical Skills Learned */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-brand-navy flex items-center gap-1.5">
              <Award className="w-4 h-4 text-brand-primary" />
              Skills & Outcomes
            </h3>
            <div className="flex flex-wrap gap-2">
              {workshop.skillsLearned.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          {workshop.prerequisites && (
            <div className="p-3.5 rounded-xl bg-brand-surface/80 border border-brand-primary/10 text-xs">
              <span className="font-semibold text-brand-navy">Prerequisites: </span>
              <span className="text-brand-muted">{workshop.prerequisites}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
