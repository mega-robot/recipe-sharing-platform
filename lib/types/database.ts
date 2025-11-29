export type RecipeCategory =
  | 'appetizers'
  | 'main-courses'
  | 'desserts'
  | 'beverages'
  | 'salads'
  | 'soups'
  | 'breakfast'
  | 'snacks';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  image_url: string | null;
  category: RecipeCategory;
  prep_time: number | null;
  cook_time: number | null;
  servings: number | null;
  difficulty: Difficulty | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithProfile extends Recipe {
  profiles: Profile | null;
}

