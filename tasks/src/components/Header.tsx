'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HiOutlineLogout, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

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
          >
            {isDark ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>
          <button className="btn-primary">
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
} 