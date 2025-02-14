import { createClient } from '@supabase/supabase-js';
import { auth } from './firebase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export const signInToSupabase = async () => {
  const user = auth.currentUser;
  if (!user) return;

  // Set the Supabase auth context with the user ID
  supabase.auth.setSession({
    access_token: user.uid,
    refresh_token: '',
  });
}; 