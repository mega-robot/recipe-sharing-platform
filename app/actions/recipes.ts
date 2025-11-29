'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Recipe, Ingredient, RecipeStep, RecipeCategory, Difficulty } from '@/lib/types/database';

const categories: RecipeCategory[] = [
  'appetizers',
  'main-courses',
  'desserts',
  'beverages',
  'salads',
  'soups',
  'breakfast',
  'snacks',
];

export async function createRecipe(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a recipe' };
  }

  const title = formData.get('title') as string | null;
  const description = formData.get('description') as string | null;
  const category = formData.get('category') as string | null;
  const prepTime = formData.get('prepTime') as string | null;
  const cookTime = formData.get('cookTime') as string | null;
  const servings = formData.get('servings') as string | null;
  const difficulty = formData.get('difficulty') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;

  // Parse ingredients from form data
  const ingredients: Ingredient[] = [];
  const ingredientCountStr = formData.get('ingredientCount') as string | null;
  const ingredientCount = ingredientCountStr ? parseInt(ingredientCountStr) || 0 : 0;
  
  for (let i = 0; i < ingredientCount; i++) {
    const name = formData.get(`ingredient_${i}_name`) as string | null;
    const amount = formData.get(`ingredient_${i}_amount`) as string | null;
    const unit = formData.get(`ingredient_${i}_unit`) as string | null;
    
    if (name && amount) {
      ingredients.push({ name, amount, unit: unit || '' });
    }
  }

  // Parse steps from form data
  const steps: RecipeStep[] = [];
  const stepCountStr = formData.get('stepCount') as string | null;
  const stepCount = stepCountStr ? parseInt(stepCountStr) || 0 : 0;
  
  for (let i = 0; i < stepCount; i++) {
    const instruction = formData.get(`step_${i}`) as string | null;
    
    if (instruction) {
      steps.push({ step_number: i + 1, instruction });
    }
  }

  // Validation
  if (!title || !category) {
    return { error: 'Title and category are required' };
  }

  if (!category || !categories.includes(category as RecipeCategory)) {
    return { error: 'Invalid category selected' };
  }

  const { error, data } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      ingredients,
      steps,
      category: category as RecipeCategory,
      prep_time: prepTime ? parseInt(prepTime) : null,
      cook_time: cookTime ? parseInt(cookTime) : null,
      servings: servings ? parseInt(servings) : null,
      difficulty: (difficulty as Difficulty) || null,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/recipes');
  revalidatePath('/dashboard');
  redirect(`/recipes/${data.id}?success=true`);
}

export async function getAllRecipes() {
  const supabase = await createClient();

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (recipesError) {
    return { error: recipesError.message, data: null };
  }

  if (!recipes || recipes.length === 0) {
    return { data: [], error: null };
  }

  // Get user IDs
  const userIds = [...new Set(recipes.map((r) => r.user_id))];

  // Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds);

  if (profilesError) {
    return { error: profilesError.message, data: null };
  }

  // Combine recipes with profiles
  const data = recipes.map((recipe) => ({
    ...recipe,
    profiles: profiles?.find((p) => p.id === recipe.user_id) || null,
  }));

  return { data, error: null };
}

export async function getRecipesByCategory(category: RecipeCategory) {
  const supabase = await createClient();

  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (recipesError) {
    return { error: recipesError.message, data: null };
  }

  if (!recipes || recipes.length === 0) {
    return { data: [], error: null };
  }

  // Get user IDs
  const userIds = [...new Set(recipes.map((r) => r.user_id))];

  // Fetch profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds);

  if (profilesError) {
    return { error: profilesError.message, data: null };
  }

  // Combine recipes with profiles
  const data = recipes.map((recipe) => ({
    ...recipe,
    profiles: profiles?.find((p) => p.id === recipe.user_id) || null,
  }));

  return { data, error: null };
}

export async function getRecipeById(id: string) {
  const supabase = await createClient();

  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (recipeError) {
    return { error: recipeError.message, data: null };
  }

  if (!recipe) {
    return { error: 'Recipe not found', data: null };
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio')
    .eq('id', recipe.user_id)
    .single();

  if (profileError) {
    return { error: profileError.message, data: null };
  }

  const data = {
    ...recipe,
    profiles: profile || null,
  };

  return { data, error: null };
}

export async function getUserRecipes(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, data: null };
  }

  return { data, error: null };
}

export async function deleteRecipe(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to delete a recipe' };
  }

  // First, verify the user owns this recipe
  const { data: recipe, error: fetchError } = await supabase
    .from('recipes')
    .select('user_id')
    .eq('id', recipeId)
    .single();

  if (fetchError || !recipe) {
    return { error: 'Recipe not found' };
  }

  if (recipe.user_id !== user.id) {
    return { error: 'You can only delete your own recipes' };
  }

  // Delete the recipe
  const { error: deleteError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId);

  if (deleteError) {
    return { error: deleteError.message };
  }

  revalidatePath('/recipes');
  revalidatePath('/dashboard');
  revalidatePath('/recipes/my-recipes');
  redirect('/recipes/my-recipes');
}
