'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Add a small delay to show the loading animation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  if (!user) return null;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <Header />
      <TaskList />
    </div>
  );
}
