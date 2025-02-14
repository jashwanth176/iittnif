'use client';

import { useState } from 'react';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { HiEnvelope, HiLockClosed, HiUser } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Redirect to tasks page after successful auth
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <div className="mb-8">
          <Image
            src="/images/IITT_InIf_svg2-01.png"
            alt="IITT Logo"
            width={300}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white/20 backdrop-blur-[2px] rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-primary mb-6">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-primary">
                    Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                      <HiUser className="text-primary/50 w-5 h-5" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-primary pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-primary">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                    <HiEnvelope className="text-primary/50 w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-primary pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-primary">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                    <HiLockClosed className="text-primary/50 w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-primary pl-10"
                    required
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                      <HiLockClosed className="text-primary/50 w-5 h-5" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-primary pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="btn-primary w-full bg-white hover:bg-gray-50 text-primary relative z-20"
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-primary">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 