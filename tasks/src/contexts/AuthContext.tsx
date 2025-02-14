'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { signInToSupabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await signInToSupabase();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 