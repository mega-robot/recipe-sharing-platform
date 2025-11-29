import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserMenu } from '@/app/components/user-menu';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, bio, created_at')
    .eq('id', user.id)
    .single();

  // Get user's recipes count
  const { count: recipesCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || 'User';

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
          <Link
            href="/dashboard"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium mb-6 inline-block"
          >
            ← Back to Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 px-6 py-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayName}</h1>
                  {profile?.username && (
                    <p className="text-gray-600">@{profile.username}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.full_name || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {profile?.username || 'Not set'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              {profile?.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                  <p className="text-sm text-gray-900">{profile.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500">Recipes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {recipesCount || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500">Account Status</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-500">Member For</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {Math.floor(
                        (Date.now() - new Date(user.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      days
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/recipes/my-recipes"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View My Recipes
                  </Link>
                  <Link
                    href="/recipes/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                  >
                    Create New Recipe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

