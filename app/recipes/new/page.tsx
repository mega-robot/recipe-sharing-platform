import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from '@/app/components/user-menu';
import { RecipeForm } from '@/app/components/recipe-form';

export default async function NewRecipePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

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
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Recipe</h1>
            <p className="text-gray-600 mt-2">Share your favorite recipe with the community</p>
          </div>

          <RecipeForm />
        </div>
      </main>
    </div>
  );
}

