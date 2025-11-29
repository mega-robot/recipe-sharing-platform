import { getRecipeById } from '@/app/actions/recipes';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from '@/app/components/user-menu';
import { DeleteRecipeButton } from '@/app/components/delete-recipe-button';
import type { RecipeWithProfile } from '@/lib/types/database';

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  const result = await getRecipeById(id);

  if (result.error || !result.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Recipe not found</p>
          <Link href="/recipes" className="text-orange-600 hover:text-orange-700 mt-4 inline-block">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  const recipe = result.data as RecipeWithProfile;
  const authorName =
    recipe.profiles?.full_name ||
    recipe.profiles?.username ||
    'Unknown';
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const isOwner = user && user.id === recipe.user_id;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RecipeShare</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/recipes" className="text-gray-700 hover:text-orange-500 transition-colors">
                Browse Recipes
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-orange-500 transition-colors">
                Categories
              </Link>
            </nav>

            {/* Auth Buttons / User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {success && (
            <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Recipe successfully added!
                  </p>
                </div>
              </div>
            </div>
          )}
          <Link
            href="/recipes"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium mb-6 inline-block"
          >
            ← Back to Recipes
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Recipe Image */}
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Header Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    {formatCategory(recipe.category)}
                  </span>
                  {recipe.difficulty && (
                    <span className="text-sm text-gray-600 capitalize">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {recipe.title}
                </h1>
                {recipe.description && (
                  <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>By {authorName}</span>
                  </div>
                  {recipe.prep_time && (
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Prep: {recipe.prep_time} min</span>
                    </div>
                  )}
                  {recipe.cook_time && (
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Cook: {recipe.cook_time} min</span>
                    </div>
                  )}
                  {totalTime > 0 && (
                    <div className="flex items-center gap-1">
                      <span>Total: {totalTime} min</span>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span className="text-gray-700">
                          {ingredient.amount} {ingredient.unit && ingredient.unit + ' '}
                          {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {recipe.steps
                      .sort((a, b) => a.step_number - b.step_number)
                      .map((step) => (
                        <li key={step.step_number} className="flex gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                            {step.step_number}
                          </span>
                          <p className="text-gray-700 pt-1">{step.instruction}</p>
                        </li>
                      ))}
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">
                    Created on{' '}
                    {new Date(recipe.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {isOwner && <DeleteRecipeButton recipeId={recipe.id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

