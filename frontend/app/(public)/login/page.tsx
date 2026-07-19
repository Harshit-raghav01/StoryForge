'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WaxSealIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';
import { DemoLoginPanel } from '@/components/DemoLoginPanel';
import { useUserStore } from '@/store/userStore';
import { Suspense } from 'react';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

function LoginContent() {
  const { setCurrentUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const errorParam = searchParams.get('error');
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const json = await res.json();

      if (!res.ok) {
        setApiError(json.error || 'Sign in failed. Please try again.');
        return;
      }

      // Hydrate store from the API response
      setCurrentUser({
        _id: json.user._id,
        name: json.user.name,
        email: json.user.email,
        avatar: json.user.avatar || '',
        role: json.user.role,
        coinBalance: json.user.coinBalance,
        authorProfile: json.user.authorProfile || null,
      });

      router.push('/dashboard');
    } catch (err) {
      setApiError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface rounded-card border border-border shadow-card p-8 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <WaxSealIcon size={52} />
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-text-primary">Welcome back</h1>
              <p className="text-text-secondary text-sm font-body mt-1">Sign in to continue reading</p>
            </div>
          </div>

          {/* Verification & error banners */}
          {verified === 'true' && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-body">
              ✓ Email verified! You can now sign in.
            </div>
          )}
          {errorParam === 'google_failed' && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-body">
              Google sign-in failed. Please try again.
            </div>
          )}
          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-body">
              {apiError}
            </div>
          )}

          {/* Google OAuth */}
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-input border border-border bg-surface hover:bg-surface-alt text-text-primary font-body text-sm font-medium transition-colors mb-5"
            id="login-google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-body text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium font-body text-text-primary mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs font-body text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium font-body text-text-primary">Password</label>
                <Link href="/forgot-password" className="text-xs font-body text-primary hover:text-primary-pop transition-colors">Forgot password?</Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              />
              {errors.password && <p className="mt-1 text-xs font-body text-danger">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth size="lg" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm font-body text-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary-pop font-medium transition-colors">Create one</Link>
          </p>

          {/* Demo Login */}
          <DemoLoginPanel />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-surface rounded-card border border-border shadow-card p-8 md:p-10 text-center text-text-secondary font-body">
          Loading login...
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
