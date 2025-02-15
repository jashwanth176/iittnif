import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background text-foreground`}>
        <AuthProvider>
          <AnimatedBackground />
          <main className="container mx-auto p-4 h-full">
            {children}
          </main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
