import React from "react";
import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  FolderTree,
} from "lucide-react";
import {
  DEMO_COMMUNITY_GROWTH_SERIES,
  DEMO_COMMUNITY_CATEGORIES,
} from "../../data/mock-community";

export function CommunityAnalyticsChart() {
  const maxPosts = Math.max(...DEMO_COMMUNITY_GROWTH_SERIES.map((d) => d.posts));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up">
      {/* 1. Growth Trends Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-gray-900">
                Community Engagement & Content Growth
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Monthly new discussions, active replies, and member acquisition trajectory
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
            Past 6 Months
          </span>
        </div>

        {/* Visual Bar representation */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-6 gap-3 items-end h-48 border-b border-gray-100 pb-3">
            {DEMO_COMMUNITY_GROWTH_SERIES.map((item, idx) => {
              const heightPercent = Math.round((item.posts / maxPosts) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-gray-400 group-hover:text-purple-600 transition-colors">
                    {item.posts.toLocaleString()}
                  </span>
                  <div className="w-full max-w-[38px] bg-purple-50 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                    />
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
                Community Posts Published
              </span>
              <span className="flex items-center gap-1.5 font-medium text-gray-600">
                <span className="w-3 h-3 rounded-full bg-purple-200" />
                Total Platform Members (14,850)
              </span>
            </div>
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
              Avg +61.3% YoY Velocity
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
                <FolderTree className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-gray-900">
                Discussion Distribution
              </h3>
            </div>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mb-5">
            Share of discussions across key interest tracks
          </p>

          <div className="space-y-4">
            {DEMO_COMMUNITY_CATEGORIES.slice(0, 5).map((cat, i) => {
              const totalDiscussions = 1840;
              const percent = Math.round((cat.discussionsCount / totalDiscussions) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 truncate max-w-[170px]">
                      {cat.name}
                    </span>
                    <span className="font-bold text-gray-600">
                      {cat.discussionsCount} <span className="font-normal text-gray-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            99.2% Clean Community Index
          </div>
          <span className="text-gray-400">0.8% Toxicity Intercept</span>
        </div>
      </div>
    </div>
  );
}
