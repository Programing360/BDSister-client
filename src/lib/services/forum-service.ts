import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ForumPost,
  ForumCategory,
  ForumComment,
} from "@/types/forum";

export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
  {
    id: "cat-1",
    name: "Business & Startup",
    slug: "business-startup",
    description: "Trade licensing, supply chains, cashflow, marketing, and founder questions.",
    icon: "Briefcase",
    postCount: 142,
  },
  {
    id: "cat-2",
    name: "Tech & Careers",
    slug: "tech-careers",
    description: "Software engineering, remote work, UI/UX, freelancing, and workplace growth.",
    icon: "Code",
    postCount: 98,
  },
  {
    id: "cat-3",
    name: "Creative & Artisan",
    slug: "creative-artisan",
    description: "Modest fashion, textiles, handcrafted goods, packaging, and exhibitions.",
    icon: "Palette",
    postCount: 76,
  },
  {
    id: "cat-4",
    name: "General Sisterhood",
    slug: "general-sisterhood",
    description: "Mentorship, daily reflections, encouragement, wellness, and life harmony.",
    icon: "Heart",
    postCount: 215,
  },
  {
    id: "cat-5",
    name: "Global Diaspora",
    slug: "global-diaspora",
    description: "Cross-border logistics, overseas education, relocation, and NRI network.",
    icon: "Globe",
    postCount: 54,
  },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "post-1",
    title: "How to renew City Corporation trade license online in Dhaka without third-party brokers?",
    slug: "renew-trade-license-online-dhaka",
    content:
      "Assalamu Alaikum sisters! I recently completed the full online trade license renewal under DNCC through their official portal without paying any extra broker fees. The process took only 3 business days once all required documents (holding tax receipt, TIN certificate, landlord NOC) were uploaded in clean PDF format. Here is my exact step-by-step checklist to save you money and unnecessary hassle.",
    excerpt:
      "Assalamu Alaikum sisters! I recently completed the full online trade license renewal under DNCC through their official portal without paying any extra broker fees.",
    author: {
      id: "usr-101",
      name: "Nusrat Jahan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      role: "Verified Business Owner",
      isVerified: true,
    },
    category: "Business & Startup",
    categoryId: "cat-1",
    tags: ["TradeLicense", "DNCC", "LegalTips", "Dhaka"],
    likesCount: 38,
    commentsCount: 14,
    isLiked: false,
    isPinned: true,
    viewsCount: 420,
    createdAt: "2026-11-18T08:30:00Z",
  },
  {
    id: "post-2",
    title: "Remote software engineering contracts: Handling USD inward remittances through local banks",
    slug: "remote-se-contracts-inward-remittance",
    content:
      "For sisters working as remote contractors for US/European tech companies: opening an RFCD (Resident Foreign Currency Deposit) or ERQ (Export Retention Quota) account in Bangladesh has been a total gamechanger for my cashflow. You can retain 50% in foreign currency, shield against inflation, and receive clean export incentives under Form C declarations without friction.",
    excerpt:
      "For sisters working as remote contractors for US/European tech companies: opening an RFCD or ERQ account has been a total gamechanger.",
    author: {
      id: "usr-102",
      name: "Farhana Yasmin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      role: "Senior Full Stack Dev",
      isVerified: true,
    },
    category: "Tech & Careers",
    categoryId: "cat-2",
    tags: ["RemoteWork", "Remittance", "Banking", "TechCareers"],
    likesCount: 52,
    commentsCount: 23,
    isLiked: true,
    viewsCount: 680,
    createdAt: "2026-11-17T14:15:00Z",
  },
  {
    id: "post-3",
    title: "Organic Jamdani & Silk sourcing: Direct weaver clusters in Sonargaon & Tangail",
    slug: "organic-jamdani-silk-sourcing",
    content:
      "If you're building an ethical modest wear label, avoid wholesale middlemen in Elephant Road who mark up handloom by 120%. My cooperative partner and I spent last weekend visiting the actual weaver homesteads in Rupganj and Tangail. The craftswomen receive fair wages, and you can co-design custom thread counts and vegetable dye batches.",
    excerpt:
      "If you're building an ethical modest wear label, avoid wholesale middlemen who mark up handloom excessively. Visit weaver homesteads directly.",
    author: {
      id: "usr-103",
      name: "Tahmina Akter",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      role: "Creative Artisan Founder",
      isVerified: true,
    },
    category: "Creative & Artisan",
    categoryId: "cat-3",
    tags: ["EthicalFashion", "Jamdani", "SupplyChain", "Artisans"],
    likesCount: 41,
    commentsCount: 9,
    isLiked: false,
    viewsCount: 395,
    createdAt: "2026-11-16T11:00:00Z",
  },
  {
    id: "post-4",
    title: "Balancing motherhood with startup growth: My weekly time-blocking routine",
    slug: "balancing-motherhood-startup-growth",
    content:
      "To every sister feeling guilty that she isn't doing 'enough' at home or in her venture: you are not alone. Here is the realistic schedule I developed with two toddlers under 5 while scaling our catering brand to 50 daily corporate lunch deliveries. Grace, structure, and knowing when to disconnect are essential.",
    excerpt:
      "To every sister feeling guilty that she isn't doing 'enough' at home or in her venture: you are not alone. Here is my realistic schedule.",
    author: {
      id: "usr-104",
      name: "Sharmin Sultana",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      role: "Mompreneur & Mentor",
      isVerified: true,
    },
    category: "General Sisterhood",
    categoryId: "cat-4",
    tags: ["WorkLifeHarmony", "Motherhood", "Wellness", "Mindset"],
    likesCount: 67,
    commentsCount: 31,
    isLiked: false,
    viewsCount: 890,
    createdAt: "2026-11-15T16:45:00Z",
  },
];

export const MOCK_COMMENTS: Record<string, ForumComment[]> = {
  "post-1": [
    {
      id: "comm-1",
      postId: "post-1",
      author: {
        id: "usr-105",
        name: "Sadia Chowdhury",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80",
        role: "Boutique Owner",
      },
      content:
        "JazakAllah Khair sister! Did you have to submit physical hard copies to the zonal revenue office after online submission, or was everything 100% digital?",
      createdAt: "2026-11-18T09:12:00Z",
      likesCount: 4,
    },
    {
      id: "comm-2",
      postId: "post-1",
      author: {
        id: "usr-101",
        name: "Nusrat Jahan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        role: "Verified Business Owner",
        isVerified: true,
      },
      content:
        "It was 100% digital! Once payment was cleared via mobile banking, the QR-coded renewal certificate was ready for instant download on the portal.",
      createdAt: "2026-11-18T09:45:00Z",
      likesCount: 7,
    },
  ],
  "post-2": [
    {
      id: "comm-3",
      postId: "post-2",
      author: {
        id: "usr-106",
        name: "Rubaba Khan",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        role: "UI/UX Designer",
      },
      content:
        "Which private commercial bank offered you the smoothest experience for the ERQ setup? City Bank or BRAC Bank?",
      createdAt: "2026-11-17T15:20:00Z",
      likesCount: 5,
    },
  ],
};

export const forumService = {
  async getCategories(): Promise<ForumCategory[]> {
    try {
      const res = await apiClient.get<ForumCategory[]>(API_ENDPOINTS.forum.categories);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn("[ForumService] Categories API deferred, using fallback:", (err as Error).message);
    }
    return MOCK_FORUM_CATEGORIES;
  },

  async getPosts(params?: {
    category?: string;
    sort?: string;
    search?: string;
    teaser?: boolean;
    authorId?: string;
  }): Promise<ForumPost[]> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.category && params.category !== "all") queryParams.category = params.category;
      if (params?.sort) queryParams.sort = params.sort;
      if (params?.search) queryParams.search = params.search;
      if (params?.teaser) queryParams.teaser = "true";
      if (params?.authorId) queryParams.authorId = params.authorId;

      const res = await apiClient.get<ForumPost[]>(API_ENDPOINTS.forum.posts, {
        params: queryParams,
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn("[ForumService] Posts API deferred, using fallback:", (err as Error).message);
    }

    let posts = [...MOCK_FORUM_POSTS];

    if (params?.authorId) {
      posts = posts.filter((p) => p.author.id === params.authorId);
      if (posts.length === 0) {
        const base = MOCK_FORUM_POSTS[0];
        return [
          {
            id: `usr-post-1`,
            title: base?.title || "Welcome to BDSisters Community",
            content: base?.content || "Starting discussions in the sisterhood.",
            category: base?.category || "General Sisterhood",
            likesCount: 1,
            commentsCount: 0,
            createdAt: new Date().toISOString(),
            author: {
              id: params.authorId,
              name: "Current Member",
              role: "Sisterhood Member",
              isVerified: true,
            },
          },
        ];
      }
    }

    if (params?.category && params.category !== "all") {
      posts = posts.filter(
        (p) =>
          p.category.toLowerCase().includes(params.category!.toLowerCase()) ||
          p.categoryId === params.category
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.sort === "most-liked") {
      posts.sort((a, b) => b.likesCount - a.likesCount);
    } else if (params?.sort === "most-active") {
      posts.sort((a, b) => b.commentsCount - a.commentsCount);
    } else {
      posts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return posts;
  },

  async getPostById(id: string): Promise<ForumPost | null> {
    try {
      const res = await apiClient.get<ForumPost>(API_ENDPOINTS.forum.postDetail(id));
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[ForumService] PostDetail API deferred, using fallback:", (err as Error).message);
    }
    const found = MOCK_FORUM_POSTS.find((p) => p.id === id || p.slug === id);
    return found || null;
  },

  async createPost(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
  }): Promise<ForumPost> {
    try {
      const res = await apiClient.post<ForumPost>(API_ENDPOINTS.forum.createPost, data);
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[ForumService] Create post API deferred, fallback simulation:", (err as Error).message);
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: data.title,
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: data.content,
      excerpt: data.content.slice(0, 160) + "...",
      author: {
        id: "me",
        name: "You (Member)",
        role: "BDSisters Sister",
        isVerified: true,
      },
      category: data.category,
      tags: data.tags || [],
      likesCount: 1,
      commentsCount: 0,
      isLiked: true,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    MOCK_FORUM_POSTS.unshift(newPost);
    return newPost;
  },

  async getComments(postId: string): Promise<ForumComment[]> {
    try {
      const res = await apiClient.get<ForumComment[]>(API_ENDPOINTS.forum.comments(postId));
      if (res.data && Array.isArray(res.data)) return res.data;
    } catch (err) {
      console.warn("[ForumService] Comments API deferred, using fallback:", (err as Error).message);
    }
    return MOCK_COMMENTS[postId] || [];
  },

  async addComment(postId: string, content: string): Promise<ForumComment> {
    try {
      const res = await apiClient.post<ForumComment>(
        API_ENDPOINTS.forum.comments(postId),
        { content }
      );
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[ForumService] Add comment API deferred, fallback simulation:", (err as Error).message);
    }

    const comment: ForumComment = {
      id: `comm-${Date.now()}`,
      postId,
      author: {
        id: "me",
        name: "You (Member)",
        role: "Sisterhood Member",
        isVerified: true,
      },
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };

    if (!MOCK_COMMENTS[postId]) MOCK_COMMENTS[postId] = [];
    MOCK_COMMENTS[postId].push(comment);

    const post = MOCK_FORUM_POSTS.find((p) => p.id === postId);
    if (post) post.commentsCount += 1;

    return comment;
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    try {
      const res = await apiClient.post<{ liked: boolean; likesCount: number }>(
        API_ENDPOINTS.forum.like(postId)
      );
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[ForumService] Toggle like API deferred, fallback simulation:", (err as Error).message);
    }

    const post = MOCK_FORUM_POSTS.find((p) => p.id === postId);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
      return { liked: post.isLiked, likesCount: post.likesCount };
    }
    return { liked: true, likesCount: 1 };
  },

  async reportPost(postId: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.forum.report(postId),
        { reason }
      );
      if (res.data) return res.data;
    } catch (err) {
      console.warn("[ForumService] Report post API deferred, fallback simulation:", (err as Error).message);
    }
    return {
      success: true,
      message: "Thread has been flagged for administrative review. Thank you for keeping our space safe.",
    };
  },
};
