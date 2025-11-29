'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signUp(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const username = formData.get('username') as string;

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    revalidatePath('/', 'layout');
    redirect('/dashboard');
  }

  return { success: true };
}

export async function signIn(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function resetPassword(
  prevState: { error?: string; success?: boolean; message?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password/confirm`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Password reset email sent! Check your inbox.' };
}

export async function updatePassword(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

