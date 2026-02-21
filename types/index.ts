// types/index.ts

export type PostFrontEnd = {
  id: string;
  title: string;
  summary: string;
  thumbnail?: string | null;
  createdAt: string;
};

export type TUser = {
  id: string;
  username: string;
  name: string;
  image: string;
}

export type TPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
}

export type TProfileUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  level: "Basic" | "Admin" | "Premium" | string;
  phone_number: string | null

  facebook_link: string | null;
  linkedin_link: string | null;
  github_link: string | null;
  telegram_link: string | null;
  tiktok_link: string | null;
  youtube_link: string | null;
};