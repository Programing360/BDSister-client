"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Layers,
  GraduationCap,
  FileText,
  Video,
  CheckCircle2,
  Users,
  Star,
  Info,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  DEMO_RESOURCE_KPIS,
  DEMO_RESOURCES,
} from "../../data/mock-resources";
import { ResourceKpiCards } from "./resource-kpi-cards";
import { ResourceAnalyticsCharts } from "./resource-analytics-charts";
import { RecentResourcesCard } from "./recent-resources-card";
import { PopularResourcesCard } from "./popular-resources-card";

export function ResourcesOverviewView() {
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSimulationToast(message);
    setTimeout(() => {
      setSimulationToast(null);
    }, 4500);
  };

  const quickNavCards = [
    {
      title: "All Resources",
      desc: "Full searchable library catalogue",
      href: "/admin/resources/all",
      icon: BookOpen,
      count: "68 items",
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
    },
    {
      title: "Course Programs",
      desc: "LMS curricula & module builder",
      href: "/admin/resources/courses",
      icon: GraduationCap,
      count: "4 courses",
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      title: "Articles & Editorial",
      desc: "Long-form written knowledge",
      href: "/admin/resources/articles",
      icon: FileText,
      count: "18 articles",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Video Masterclasses",
      desc: "Recorded visual studio sessions",
      href: "/admin/resources/videos",
      icon: Video,
      count: "14 masterclasses",
      color: "text-rose-600",
      bg: "bg-rose-500/10",
    },
    {
      title: "Learner Enrollments",
      desc: "Student cohort progress tracking",
      href: "/admin/resources/enrollments",
      icon: Users,
      count: "742 learners",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Editorial Approvals",
      desc: "Pending contributor queue",
      href: "/admin/resources/approvals",
      icon: ShieldAlert,
      count: "9 pending",
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Feedback Toast */}
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

      {/* Header and Quick Actions */}
      <div
        data-aos="fade-up"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)]"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge & Learning Management (LMS)
          </div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-brand-navy tracking-tight">
            Resource Library Overview
          </h1>
          <p className="text-sm font-normal text-brand-muted">
            Oversee educational articles, video masterclasses, downloadable templates, and structured LMS courses for Bangladesh women entrepreneurs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/resources/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-brand-primary" />
            Categories
          </Link>
          <Link
            href="/admin/resources/courses/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/20 text-brand-navy bg-white hover:bg-brand-primary/5 text-sm font-semibold transition shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-brand-primary" />
            Create Course
          </Link>
          <Link
            href="/admin/resources/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-semibold shadow-[0_6px_20px_rgb(91,70,246,0.25)] transition"
          >
            <Plus className="w-4 h-4" />
            Create Resource
          </Link>
        </div>
      </div>

      {/* Demo Warning Banner */}
      <div
        data-aos="fade-up"
        data-aos-delay="50"
        className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-sm"
      >
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="font-medium">
          <span className="font-semibold">DEMO DATA — Not connected to live learning services.</span> All resource analytics, enrollment metrics, download counts, and editorial actions operate locally for frontend verification.
        </p>
      </div>

      {/* KPI Cards */}
      <ResourceKpiCards kpis={DEMO_RESOURCE_KPIS} />

      {/* Analytics Charts */}
      <ResourceAnalyticsCharts />

      {/* Quick Navigation Hub Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickNavCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              data-aos="fade-up"
              data-aos-delay={i * 40}
              className="p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-primary/10 shadow-[0_8px_30px_rgb(91,70,246,0.06)] hover:shadow-[0_12px_36px_rgb(91,70,246,0.12)] hover:border-brand-primary/30 transition-all duration-300 group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className={`p-2.5 rounded-xl ${c.bg} ${c.color} inline-block mb-1`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-brand-navy group-hover:text-brand-primary transition">
                  {c.title}
                </h4>
                <p className="text-xs text-brand-muted font-normal">{c.desc}</p>
                <span className="inline-block text-[11px] font-semibold text-brand-primary pt-1">
                  {c.count}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-1 transition" />
            </Link>
          );
        })}
      </div>

      {/* Recent & Top Performing Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentResourcesCard resources={DEMO_RESOURCES} />
        <PopularResourcesCard resources={DEMO_RESOURCES} />
      </div>
    </div>
  );
}
