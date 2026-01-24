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