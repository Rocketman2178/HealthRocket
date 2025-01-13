import { supabase } from '../supabase/client';
import { DatabaseError } from '../errors';

export class OnboardingService {
  static async completeOnboarding(userId: string): Promise<void> {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Update user's onboarding status
      const { error: updateError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Verify update was successful
      const { data: userData, error: verifyError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (verifyError) throw verifyError;
      if (!userData?.onboarding_completed) {
        throw new Error('Failed to verify onboarding completion');
      }

      // Trigger refresh events
      window.dispatchEvent(new CustomEvent('onboardingCompleted'));
      window.dispatchEvent(new CustomEvent('dashboardUpdate'));

      // Navigate to dashboard
      window.location.replace('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error instanceof Error ? error : new DatabaseError('Failed to complete onboarding');
    }
  }
}