"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Plus,
  Search,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import type { WorkshopItem, EventStatus } from "../../types/event";
import { DEMO_WORKSHOPS } from "../../data/mock-events";
import { WorkshopTable } from "./workshop-table";

export function WorkshopsListView() {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(DEMO_WORKSHOPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const filteredWorkshops = useMemo(() => {
    return workshops.filter((ws) => {
      const matchesSearch =
        ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || ws.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workshops, searchQuery, statusFilter]);

  const handleToggleStatus = (workshopId: string) => {
    setWorkshops((prev) =>
      prev.map((ws) => {
        if (ws.id === workshopId) {
          const nextStatus: EventStatus =
            ws.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          showToast(
            `[DEMO] Workshop "${ws.title}" status changed to ${nextStatus}. Changes are local.`
          );
          return { ...ws, status: nextStatus };
        }
        return ws;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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

      {/* Header */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            Skill-Building Masterclasses
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Workshops Management
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Curate hands-on artisan studios, tech bootcamps, and business acceleration clinics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/all"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-medium transition shadow-sm"
          >
            <Calendar className="w-4 h-4 text-brand-primary" />
            Events Catalogue
          </Link>
          <Link
            href="/admin/events/workshops/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            Add Workshop
          </Link>
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
          <span className="font-semibold">DEMO DATA NOTICE:</span> All workshop registrations and seat allocations are frontend simulations.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div
        data-aos="fade-up"
        data-aos-delay="150"
        className="p-5 bg-white/95 backdrop-blur-md rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search workshop title, instructor, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter workshop status"
              className="w-full px-3 py-2 text-sm bg-brand-surface/70 border border-brand-primary/15 rounded-xl text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="UPCOMING">Upcoming Only</option>
              <option value="DRAFT">Drafts</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-brand-muted pt-2 border-t border-brand-primary/10">
          <div>
            Showing <span className="font-semibold text-brand-navy">{filteredWorkshops.length}</span> of{" "}
            <span className="font-semibold text-brand-navy">{workshops.length}</span> workshops
          </div>
          <div className="text-[11px] font-medium text-brand-primary">
            Workshops support limited capacity & prerequisite requirements
          </div>
        </div>
      </div>

      {/* Workshop Table */}
      <div data-aos="fade-up" data-aos-delay="200">
        <WorkshopTable
          workshops={filteredWorkshops}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  );
}
