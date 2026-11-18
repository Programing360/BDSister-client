import React from "react";
import { Award, ThumbsUp, MessageSquare, ArrowUpRight } from "lucide-react";
import { DEMO_TOP_CONTRIBUTORS } from "../../data/mock-community";

export function TopContributorsCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-pink-50 text-pink-700">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Top Community Contributors
            </h3>
            <p className="text-xs text-gray-500">
              Recognized sisters with highest helpful solution upvotes
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {DEMO_TOP_CONTRIBUTORS.map((contributor, idx) => (
          <div
            key={contributor.id}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-purple-50/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <img
                src={contributor.avatarUrl}
                alt={contributor.name}
                className="w-10 h-10 rounded-full object-cover border border-purple-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {contributor.name}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#322499]">
                    {contributor.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{contributor.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-600" title="Helpful Upvotes">
                <ThumbsUp className="w-3.5 h-3.5" />
                {contributor.helpfulVotes}
              </span>
              <span className="flex items-center gap-1 text-gray-500" title="Posts Authored">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                {contributor.postsCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
