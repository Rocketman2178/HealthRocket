import { supabase } from './client';
import { AuthError } from '../errors';

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
  } catch (err) {
    console.error('Password reset error:', err);
    throw new AuthError('Failed to send reset email', err);
  }
}

export async function updatePassword(token: string, newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  } catch (err) {
    console.error('Password update error:', err);
    throw new AuthError('Failed to update password', err);
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      if (error.message.includes('Invalid login')) {
        throw new AuthError('Invalid email or password');
      }
      throw error;
    }
  } catch (err) {
    console.error('Sign in error:', err);
    throw new AuthError('Failed to sign in', err);
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    // Create auth user
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (signUpError) throw signUpError;
    if (!data.user) throw new Error('No user returned from signup');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        name,
        plan: 'Free Plan',
        level: 1,
        fuel_points: 0,
        burn_streak: 0,
        health_score: 7.8,
        healthspan_years: 0,
        onboarding_completed: false
      });

    if (profileError) throw profileError;

  } catch (err) {
    console.error('Sign up error:', err);
    throw new AuthError('Failed to create account', err);
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}