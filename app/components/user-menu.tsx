import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';

export async function UserMenu() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-gray-700 hover:text-orange-500 transition-colors px-4 py-2"
        >
          Log In
        </Link>
        <Link
          href="/signup"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/recipes/new"
        className="text-gray-700 hover:text-orange-500 transition-colors px-4 py-2"
      >
        Create Recipe
      </Link>
      <div className="relative group">
        <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors px-4 py-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden md:block">{displayName}</span>
          <svg
            className="w-4 h-4 hidden md:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Profile
          </Link>
          <Link
            href="/recipes/my-recipes"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            My Recipes
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

