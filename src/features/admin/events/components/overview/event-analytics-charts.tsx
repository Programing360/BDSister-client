import React from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  DEMO_EVENT_GROWTH_SERIES,
  DEMO_EVENT_CATEGORIES,
} from "../../data/mock-events";

export function EventAnalyticsCharts() {
  const maxReg = Math.max(...DEMO_EVENT_GROWTH_SERIES.map((d) => d.registrations));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up">
      {/* 1. Monthly Registration Trajectory */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Monthly Registrations & Attendance Velocity
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Passes claimed vs confirmed verified attendees over the past 6 months
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
            Past 6 Months
          </span>
        </div>

        {/* Visual Bar Columns */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-6 gap-3 items-end h-48 border-b border-gray-100 pb-3">
            {DEMO_EVENT_GROWTH_SERIES.map((item, idx) => {
              const heightPercent = Math.round((item.registrations / maxReg) * 100);
              const attHeightPercent = Math.round((item.attendees / maxReg) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">
                    {item.registrations}
                  </span>
                  <div className="flex items-end gap-1 w-full max-w-[42px] justify-center h-full">
                    {/* Registrations bar */}
                    <div className="w-1/2 bg-purple-50 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                      />
                    </div>
                    {/* Attendees bar */}
                    <div className="w-1/2 bg-emerald-50 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${attHeightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 mt-1">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                Registrations
              </span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                Verified Attendance
              </span>
            </div>
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Avg 81.2% Conversion Ratio
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                <Calendar className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Events by Category
              </h3>
            </div>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mb-5">
            Share of organized gatherings by interest vertical
          </p>

          <div className="space-y-4">
            {DEMO_EVENT_CATEGORIES.slice(0, 5).map((cat, i) => {
              const totalEvents = 42;
              const percent = Math.round((cat.eventsCount / totalEvents) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 truncate max-w-[170px]">
                      {cat.name}
                    </span>
                    <span className="font-bold text-gray-600">
                      {cat.eventsCount} <span className="font-normal text-gray-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-purple-700 font-semibold">
            <Sparkles className="w-4 h-4" />
            Top: Artisan Craft Guilds
          </div>
          <span className="text-gray-400">33.3% of total events</span>
        </div>
      </div>
    </div>
  );
}
