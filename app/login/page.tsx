import Link from 'next/link';
import { LoginForm } from '@/app/components/auth-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logged-in users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">RecipeShare</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* Website Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About RecipeShare</h3>
          <p className="text-sm text-gray-600 mb-4">
            RecipeShare is a vibrant community where food lovers come together to share and discover amazing recipes. 
            Whether you're a seasoned chef or just starting your culinary journey, you'll find inspiration and connect 
            with fellow cooking enthusiasts.
          </p>
          <div className="space-y-2">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-gray-600">Share your favorite recipes with the community</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-gray-600">Discover new recipes from talented home cooks</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-gray-600">Organize and manage your recipe collection</p>
            </div>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

