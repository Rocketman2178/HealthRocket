import { supabase } from './supabase';

export async function uploadProfileImage(file: File, userId: string) {
  const maxSize = 5 * 1024 * 1024; // 5MB limit

  try {
    // Validate file size
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Upload image to storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      throw new Error('Failed to get public URL');
    }

    // Update user profile with avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
}