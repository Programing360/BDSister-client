"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Calendar,
  Clock,
  Users,
  Edit,
  ExternalLink,
  Tag,
} from "lucide-react";
import type { WorkshopItem } from "../../types/event";
import {
  EventStatusBadge,
  EventFormatBadge,
} from "../common/event-status-badge";

interface WorkshopTableProps {
  workshops: WorkshopItem[];
  onToggleStatus: (workshopId: string) => void;
}

export function WorkshopTable({
  workshops,
  onToggleStatus,
}: WorkshopTableProps) {
  if (workshops.length === 0) {
    return (
      <div className="p-12 text-center bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]">
        <GraduationCap className="w-10 h-10 text-brand-muted/60 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-brand-navy">
          No Workshops Found
        </h3>
        <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
          No practical skill-building workshops match your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-brand-surface/70 text-brand-muted uppercase text-[11px] font-semibold border-b border-brand-primary/10">
            <tr>
              <th className="py-3.5 px-4">Workshop</th>
              <th className="py-3.5 px-4">Instructor</th>
              <th className="py-3.5 px-4">Schedule</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4">Enrollment</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/5">
            {workshops.map((ws) => {
              const capacityPct = Math.min(
                100,
                Math.round((ws.registrationCount / ws.capacity) * 100)
              );

              return (
                <tr
                  key={ws.id}
                  className="hover:bg-brand-surface/50 transition-colors"
                >
                  {/* Workshop Title & Cover */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-primary/15 shrink-0">
                        <Image
                          src={ws.coverImageUrl}
                          alt={ws.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/admin/events/workshops/${ws.id}`}
                          className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                        >
                          {ws.title}
                        </Link>
                        <span className="text-[11px] text-brand-primary font-medium">
                          {ws.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-navy">
                      {ws.instructor.name}
                    </p>
                    <p className="text-[11px] text-brand-muted line-clamp-1">
                      {ws.instructor.organization}
                    </p>
                  </td>

                  {/* Schedule */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-brand-navy font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                      <span>{ws.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-brand-muted">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>
                        {ws.startTime} • {ws.duration}
                      </span>
                    </div>
                  </td>

                  {/* Format */}
                  <td className="py-3.5 px-4">
                    <EventFormatBadge format={ws.format} />
                  </td>

                  {/* Enrollment Progress */}
                  <td className="py-3.5 px-4 min-w-[130px]">
                    <div className="flex justify-between text-[11px] font-semibold text-brand-navy mb-1">
                      <span>{ws.registrationCount}</span>
                      <span className="text-brand-muted">/ {ws.capacity}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-brand-primary/15 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          capacityPct >= 90
                            ? "bg-amber-500"
                            : "bg-brand-primary"
                        }`}
                        style={{ width: `${capacityPct}%` }}
                      ></div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-semibold text-brand-navy">
                    {ws.priceBDT === 0
                      ? "Free"
                      : `৳ ${ws.priceBDT.toLocaleString()}`}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <EventStatusBadge status={ws.status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onToggleStatus(ws.id)}
                        className="px-2 py-1 rounded-lg text-[11px] font-semibold border border-brand-primary/20 text-brand-navy hover:bg-brand-primary/10 transition"
                      >
                        {ws.status === "PUBLISHED" ? "Pause" : "Activate"}
                      </button>
                      <Link
                        href={`/admin/events/workshops/${ws.id}/edit`}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                        title="Edit Workshop"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/events/workshops/${ws.id}`}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 transition"
                        title="Inspect Workshop"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-brand-primary/10 p-4 space-y-4">
        {workshops.map((ws) => (
          <div key={ws.id} className="pt-4 first:pt-0 space-y-3">
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-surface shrink-0">
                <Image
                  src={ws.coverImageUrl}
                  alt={ws.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/events/workshops/${ws.id}`}
                  className="font-semibold text-brand-navy hover:text-brand-primary text-sm line-clamp-1"
                >
                  {ws.title}
                </Link>
                <p className="text-[11px] text-brand-primary font-medium">
                  {ws.category} • Instructor: {ws.instructor.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <EventStatusBadge status={ws.status} />
                  <span className="text-[11px] text-brand-muted font-medium">
                    {ws.startDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-primary/5">
              <span className="font-semibold text-brand-navy">
                {ws.priceBDT === 0 ? "Free" : `৳ ${ws.priceBDT.toLocaleString()}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleStatus(ws.id)}
                  className="text-xs font-semibold text-brand-muted hover:text-brand-primary"
                >
                  Toggle
                </button>
                <Link
                  href={`/admin/events/workshops/${ws.id}/edit`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/events/workshops/${ws.id}`}
                  className="text-xs font-semibold text-brand-primary"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
