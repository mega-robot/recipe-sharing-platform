import { getAllRecipes, getRecipesByCategory } from '@/app/actions/recipes';
import Link from 'next/link';
import { UserMenu } from '@/app/components/user-menu';
import type { RecipeCategory, RecipeWithProfile } from '@/lib/types/database';

const categories: { value: RecipeCategory; label: string; emoji: string }[] = [
  { value: 'appetizers', label: 'Appetizers', emoji: '🥗' },
  { value: 'main-courses', label: 'Main Courses', emoji: '🍽️' },
  { value: 'desserts', label: 'Desserts', emoji: '🍰' },
  { value: 'beverages', label: 'Beverages', emoji: '🥤' },
  { value: 'salads', label: 'Salads', emoji: '🥙' },
  { value: 'soups', label: 'Soups', emoji: '🍲' },
  { value: 'breakfast', label: 'Breakfast', emoji: '🥞' },
  { value: 'snacks', label: 'Snacks', emoji: '🍿' },
];

function formatCategory(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selectedCategory = category as RecipeCategory | undefined;

  // Get recipes based on selected category
  const result = selectedCategory
    ? await getRecipesByCategory(selectedCategory)
    : await getAllRecipes();

  if (result.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading recipes: {result.error}</p>
        </div>
      </div>
    );
  }

  const recipes = (result.data || []) as RecipeWithProfile[];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Categories</h1>
            <p className="text-gray-600">Browse recipes by category</p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                <Link
                  href="/categories"
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    !selectedCategory
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Recipes
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/categories?category=${cat.value}`}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      selectedCategory === cat.value
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Selected Category Info */}
          {selectedCategory && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {categories.find((c) => c.value === selectedCategory)?.emoji}{' '}
                {categories.find((c) => c.value === selectedCategory)?.label}
              </h2>
              <p className="text-gray-600 mt-1">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
              </p>
            </div>
          )}

          {/* Recipes Grid */}
          {recipes.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedCategory
                  ? `No recipes in ${categories.find((c) => c.value === selectedCategory)?.label} category yet`
                  : 'No recipes yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedCategory
                  ? 'Be the first to share a recipe in this category!'
                  : 'Be the first to share a recipe!'}
              </p>
              <Link
                href="/recipes/new"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => {
                const authorName =
                  recipe.profiles?.full_name ||
                  recipe.profiles?.username ||
                  'Unknown';
                const totalTime =
                  (recipe.prep_time || 0) + (recipe.cook_time || 0);

                return (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-orange-400"
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
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          {formatCategory(recipe.category)}
                        </span>
                        {recipe.difficulty && (
                          <span className="text-xs text-gray-500 capitalize">
                            {recipe.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                        {recipe.title}
                      </h3>
                      {recipe.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recipe.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {authorName}</span>
                        {totalTime > 0 && <span>{totalTime} min</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

