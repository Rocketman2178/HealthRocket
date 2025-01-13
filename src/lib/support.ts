import { supabase } from './supabase';

export async function submitSupportMessage(message: string) {
  try {
    // First submit message to database
    const { data, error: dbError } = await supabase
      .rpc('submit_support_message', {
        p_message: message
      });

    if (dbError) throw dbError;

    // Get user details for email
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    // Call edge function to send email
    const { error: emailError } = await supabase.functions.invoke('send-support-email', {
      body: {
        messageId: data.message_id,
        userId: user?.id,
        userName: user?.user_metadata.name || 'Unknown User',
        userEmail: user?.email,
        message,
        createdAt: new Date().toISOString()
      }
    });

    if (emailError) throw emailError;

    return { success: true };
  } catch (err) {
    console.error('Error submitting support message:', err);
    throw err;
  }
}