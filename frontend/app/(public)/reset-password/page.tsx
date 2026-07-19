'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WaxSealIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    if (!token) {
      setApiError('Invalid or missing reset token. Please request a new link.');
      return;
    }
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Reset failed. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 bg-bg">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card border border-border shadow-card p-8 md:p-10">
          <div className="flex flex-col items-center gap-3 mb-8">
            <WaxSealIcon size={52} />
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-text-primary">Reset Password</h1>
              <p className="text-text-secondary text-sm font-body mt-1">
                Enter your new password below
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Password Reset Successfully</h2>
              <p className="text-text-secondary text-sm font-body leading-relaxed">
                Your password has been updated. You can now use your new password to sign in.
              </p>
              <div className="pt-4">
                <Link href="/login" className="inline-flex items-center px-6 py-2.5 rounded-pill bg-primary hover:bg-primary-pop text-white text-sm font-bold font-body transition-colors">
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-body">
                  {apiError}
                </div>
              )}
              {!token && (
                <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-body">
                  No reset token found. Please use the link sent to your email.
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium font-body text-text-primary mb-1.5">New Password</label>
                <input id="password" type="password" placeholder="••••••••" {...register('password')}
                  className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
                {errors.password && <p className="mt-1 text-xs font-body text-danger">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium font-body text-text-primary mb-1.5">Confirm Password</label>
                <input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')}
                  className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
                {errors.confirmPassword && <p className="mt-1 text-xs font-body text-danger">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" fullWidth size="lg" variant="primary" disabled={isSubmitting || !token}>
                {isSubmitting ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
