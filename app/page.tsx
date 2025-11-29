import Link from "next/link";
import { UserMenu } from "./components/user-menu";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users to dashboard
  if (user) {
    redirect('/dashboard');
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
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome to RecipeShare
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join our community of food lovers. Share your favorite recipes and discover new culinary delights.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/signup"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Start Creating
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or</span>
              </div>
            </div>
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold text-white">RecipeShare</span>
              </div>
              <p className="text-sm">
                Share and discover amazing recipes from food lovers around the world.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/recipes" className="hover:text-orange-400 transition-colors">
                    Browse Recipes
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-orange-400 transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/popular" className="hover:text-orange-400 transition-colors">
                    Popular Recipes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/signup" className="hover:text-orange-400 transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-orange-400 transition-colors">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-orange-400 transition-colors">
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-orange-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-orange-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-orange-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} RecipeShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
