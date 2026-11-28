"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { forumService } from "@/lib/services/forum-service";
import type { ForumPost, ForumCategory } from "@/types/forum";
import { CreateTopicModal } from "./create-topic-modal";
import { ThreadDetailModal } from "./thread-detail-modal";
import { ReportTopicModal } from "./report-topic-modal";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Heart,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Sparkles,
  Users,
  Flag,
  Lock,
  X,
  Crown,
} from "lucide-react";

interface CommunityFeedViewProps {
  myPostsOnly?: boolean;
}

export function CommunityFeedView({ myPostsOnly = false }: CommunityFeedViewProps) {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Modals state
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [upgradePromptOpen, setUpgradePromptOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [reportPost, setReportPost] = useState<ForumPost | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const handleOpenCreateTopic = () => {
    const role = (user as any)?.role || "MEMBER";
    const tier = (user as any)?.membershipTier;
    const isAdmin = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "CONTENT_MANAGER"].includes(role);
    const isPaid = ["BASIC", "PREMIUM", "ENTERPRISE", "PAIDMEMBER"].includes(String(tier || "").toUpperCase());

    if (!isAdmin && tier === "FREE") {
      setUpgradePromptOpen(true);
      return;
    }
    setCreateModalOpen(true);
  };

  useEffect(() => {
    forumService.getCategories().then((data) => setCategories(data));
  }, []);

  const loadPosts = () => {
    setLoading(true);
    forumService
      .getPosts({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy,
        authorId: myPostsOnly ? "usr-101" : undefined,
      })
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, sortBy, myPostsOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    const res = await forumService.toggleLike(postId);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: res.liked, likesCount: res.likesCount }
          : p
      )
    );
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? { ...prev, isLiked: res.liked, likesCount: res.likesCount }
          : null
      );
    }
  };

  const handleOpenDetail = (post: ForumPost) => {
    setSelectedPost(post);
    setDetailModalOpen(true);
  };

  const handleOpenReport = (post: ForumPost) => {
    setReportPost(post);
    setReportModalOpen(true);
  };

  const handleTopicCreated = (newPost: ForumPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setSelectedPost(newPost);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Sisterhood Safe Space
            </span>
          </div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight">
            {myPostsOnly ? "My Community Discussions" : "Member Community Forum"}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {myPostsOnly
              ? "Discussions and questions you started across all community circles."
              : "Exchange trusted advice, ask candid questions, and grow together without social media spam."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={myPostsOnly ? "/member/community" : "/member/community/posts"}
          >
            <Button variant="outline" size="sm" className="rounded-2xl text-xs font-bold">
              {myPostsOnly ? "Back to All Discussions" : "My Discussions"}
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateTopic}
            className="rounded-2xl gap-1.5 shadow-button"
          >
            <Plus className="h-4 w-4" />
            <span>New Discussion</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions by keyword, tag..."
            className="w-full rounded-2xl border border-border bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-text-primary focus:border-primary focus:outline-hidden"
          />
        </form>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-secondary hidden sm:inline">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-border bg-white px-3 py-2 text-xs font-medium text-text-primary focus:border-primary focus:outline-hidden"
          >
            <option value="newest">Newest First</option>
            <option value="most-liked">Most Liked</option>
            <option value="most-active">Most Active</option>
          </select>
        </div>
      </div>

      {/* Categories Tabs */}
      {!myPostsOnly && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-xs"
                : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
            }`}
          >
            All Circles
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat.name
                  ? "bg-primary text-white shadow-xs"
                  : "border border-border bg-white text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Discussions List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-text-secondary">
          Loading discussion feed...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary">
            No Discussions Found
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {myPostsOnly
              ? "You haven't posted any discussion threads yet. Share a question or advice with the sisterhood!"
              : "No discussions match your filter. Be the first to start a conversation in this circle!"}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateTopic}
            className="rounded-2xl gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Start a Discussion</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group rounded-3xl border border-border/80 bg-white p-6 shadow-card hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-0.5 font-bold text-primary text-[11px]">
                      {post.category}
                    </span>
                    {post.isPinned && (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-secondary">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
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
                <h2
                  onClick={() => handleOpenDetail(post)}
                  className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors cursor-pointer leading-snug"
                >
                  {post.title}
                </h2>

                {/* Content snippet */}
                <p
                  onClick={() => handleOpenDetail(post)}
                  className="mt-2 text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed cursor-pointer"
                >
                  {post.excerpt || post.content}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-surface px-2.5 py-0.5 text-[11px] text-text-secondary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action footer */}
              <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      post.isLiked
                        ? "text-rose-600"
                        : "text-text-secondary hover:text-rose-600"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => handleOpenDetail(post)}
                    className="flex items-center gap-1.5 font-bold text-text-secondary hover:text-primary transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.commentsCount} replies</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReport(post)}
                    className="p-1.5 rounded-lg text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                    title="Report post"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDetail(post)}
                    className="text-xs font-bold text-primary hover:bg-primary/10"
                  >
                    <span>View Discussion</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTopicModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        categories={categories}
        onTopicCreated={handleTopicCreated}
      />

      <ThreadDetailModal
        post={selectedPost}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onLikeToggle={handleLike}
        onReport={handleOpenReport}
      />

      <ReportTopicModal
        post={reportPost}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      {/* Upgrade Gate Modal for Free Members trying to create new topics */}
      {upgradePromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-border text-center space-y-4">
            <button
              onClick={() => setUpgradePromptOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-text-secondary hover:bg-surface hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-xs">
              <Crown className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-text-primary">
                Unlock Discussion Publishing
              </h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Starting new discussion threads is an exclusive privilege reserved for verified Paid Members (Basic, Premium, Enterprise) and Community Ambassadors to maintain zero-spam and high mentorship standards.
              </p>
            </div>

            <div className="rounded-2xl bg-surface/60 p-3.5 border border-border/80 text-left text-xs text-text-secondary space-y-1">
              <span className="font-bold text-text-primary block">Free Members can always:</span>
              <p>• Read all specialized circles and topics</p>
              <p>• Post helpful replies &amp; participate in discussions</p>
              <p>• Like and bookmark sisterhood conversations</p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link href="/member/membership" className="w-full">
                <Button variant="primary" size="lg" className="w-full justify-center gap-2 shadow-button">
                  <Sparkles className="h-4 w-4" />
                  <span>Upgrade via ZiniPay (From ৳499)</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUpgradePromptOpen(false)}
                className="text-xs font-bold text-text-secondary"
              >
                Close &amp; Keep Exploring
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
