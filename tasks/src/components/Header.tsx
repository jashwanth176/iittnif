'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiOutlineLogout, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { auth } from '@/lib/firebase';
import { toast } from 'react-toastify';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only check localStorage, ignore system preference
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.info('See you next time! 👋', {
        position: "top-right",
        autoClose: 3000,
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-secondary/20 py-4 mb-8">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/IITT_InIf_svg2-01.png"
            alt="IITT Logo"
            width={300}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="btn-icon"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>
          <button onClick={handleLogout} className="btn-primary">
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
} 