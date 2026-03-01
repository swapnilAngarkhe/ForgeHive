export type User = {
  user_id: string;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
};

export type Category = {
  category_id: number;
  category_name: string;
};

export type Tool = {
  id: number;
  name: string;
  slug?: string;
  description: string;
  url?: string;
  github_url?: string;
  logo_url?: string;
  category_id: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  categories: { category_name: string }; // For joins
};

export type Favorite = {
  favorite_id: number;
  user_id: string;
  tool_id: number;
  created_at: string;
};
