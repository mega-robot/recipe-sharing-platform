'use client';

import { useActionState } from 'react';
import { resetPassword } from '@/app/actions/auth';
import Link from 'next/link';

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, null);

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
            </div>
          </div>
        </div>
      )}
      {state?.success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{state.message}</h3>
            </div>
          </div>
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send reset link'}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="font-medium text-orange-600 hover:text-orange-500 text-sm"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}

