// Environment configuration and validation
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL as string,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  },
  
  // Validate all required environment variables
  validate() {
    const missing: string[] = [];
    
    if (!this.supabase.url?.startsWith('https://')) {
      missing.push('VITE_SUPABASE_URL (must start with https://)');
    }
    
    if (!this.supabase.anonKey) {
      missing.push('VITE_SUPABASE_ANON_KEY');
    }
    
    if (missing.length > 0) {
      throw new Error(
        'Missing or invalid environment variables:\n' +
        missing.map(var => `- ${var}`).join('\n')
      );
    }
  }
};