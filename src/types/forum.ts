export interface ForumAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
}

export interface ForumComment {
  id: string;
  postId: string;
  author: ForumAuthor;
  content: string;
  createdAt: string;
  likesCount?: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  postCount?: number;
}

export interface ForumPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author: ForumAuthor;
  category: string;
  categoryId?: string;
  tags?: string[];
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  viewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}
