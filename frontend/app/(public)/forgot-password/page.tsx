'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WaxSealIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error || 'Something went wrong. Please try again.');
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
              <h1 className="font-display text-2xl font-semibold text-text-primary">Password Recovery</h1>
              <p className="text-text-secondary text-sm font-body mt-1">
                Enter your email address and we&apos;ll send you a recovery link
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center mx-auto text-xl font-bold">✓</div>
              <h2 className="font-display font-semibold text-lg text-text-primary">Check your email</h2>
              <p className="text-text-secondary text-sm font-body leading-relaxed">
                If an account exists with that address, we sent a password reset link. Check your inbox and spam folder.
              </p>
              <div className="pt-4">
                <Link href="/login" className="inline-flex items-center text-sm font-semibold font-body text-primary hover:text-primary-pop transition-colors">
                  ← Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {apiError && (
                <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-body">
                  {apiError}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium font-body text-text-primary mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm  focus:outline-none focus:ring-2 focus:ring-primary/30  transition-colors"
                />
                {errors.email && <p className="mt-1 text-xs font-body text-danger">{errors.email.message}</p>}
              </div>

              <Button type="submit" fullWidth size="lg" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending link…' : 'Send recovery link'}
              </Button>

              <p className="text-center text-sm font-body text-text-secondary mt-6">
                Remember your password?{' '}
                <Link href="/login" className="text-primary hover:text-primary-pop font-medium transition-colors">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
