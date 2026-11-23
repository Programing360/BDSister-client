"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { forumService } from "@/lib/services/forum-service";
import type { ForumPost } from "@/types/forum";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Heart,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export function CommunityGuestTeaser() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    forumService
      .getPosts({ teaser: true })
      .then((data) => {
        if (mounted) {
          setPosts(data.slice(0, 4));
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          // Truncate to first two sentences
          const sentences = post.content.match(/[^\.!\?]+[\.!\?]+/g) || [post.content];
          const teaserText = sentences.slice(0, 2).join(" ");

          return (
            <div
              key={post.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-white p-7 shadow-card transition-all hover:border-primary/30"
            >
              <div>
                {/* Meta bar */}
                <div className="flex items-center justify-between text-xs mb-3.5">
                  <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary text-[11px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-text-secondary">
                    <Lock className="h-3 w-3 text-primary" /> Members Only
                  </span>
                </div>

                {/* Author row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-surface border border-border shrink-0">
                    {post.author.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-xs text-primary bg-primary/10">
                        {post.author.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                      <span>{post.author.name}</span>
                      {post.author.isVerified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <span className="text-[11px] text-text-secondary">
                      {post.author.role || "Sisterhood Member"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug line-clamp-2">
                  {post.title}
                </h3>

                {/* Teaser snippet with blur overlay */}
                <div className="relative mt-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
                  <p>{teaserText}</p>
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Locked Discussion CTA Overlay */}
              <div className="mt-5 pt-4 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1 font-semibold">
                    <Heart className="h-3.5 w-3.5 text-rose-500" /> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />{" "}
                    {post.commentsCount} replies
                  </span>
                </div>

                <Link
                  href="/register?redirect=/member/community"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary gap-1.5"
                  >
                    <span>Be a member to read full post. It&apos;s Free</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Forum Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-surface to-heading-accent/5 p-8 text-center flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-text-primary">
          Join 4,500+ Verified Bangladeshi Sisters in Discussion
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl">
          Get real mentorship, honest supplier reviews, trade license guides, and
          compassionate support in our safe, spam-free member sanctuary.
        </p>
        <Link href="/register?redirect=/member/community">
          <Button variant="primary" size="lg" className="shadow-button gap-2">
            <span>Unlock All Circles — 100% Free</span>
            <Sparkles className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
