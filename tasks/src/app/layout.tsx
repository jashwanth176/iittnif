import { Inter } from 'next/font/google';
import AnimatedBackground from '@/components/AnimatedBackground';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background text-foreground`}>
        <AnimatedBackground />
        <main className="container mx-auto p-4 h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
