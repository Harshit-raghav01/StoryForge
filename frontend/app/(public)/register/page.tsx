'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WaxSealIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';
import { DemoLoginPanel } from '@/components/DemoLoginPanel';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log('Register attempted', data);
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card border border-border shadow-card p-8 md:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <WaxSealIcon size={52} />
            <div className="text-center">
              <h1 className="font-display text-2xl font-semibold text-text-primary">Create your account</h1>
              <p className="text-text-secondary text-sm font-body mt-1">
                Start as a reader. Become an author when ready.
              </p>
            </div>
          </div>

          {/* Google OAuth */}
          <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-input border border-border bg-surface hover:bg-surface-alt text-text-primary font-body text-sm font-medium transition-colors mb-5" id="register-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-body text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium font-body text-text-primary mb-1.5">Display name</label>
              <input id="name" type="text" autoComplete="name" placeholder="Your name" {...register('name')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
              {errors.name && <p className="mt-1 text-xs font-body text-danger">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium font-body text-text-primary mb-1.5">Email address</label>
              <input id="reg-email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
              {errors.email && <p className="mt-1 text-xs font-body text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium font-body text-text-primary mb-1.5">Password</label>
              <input id="reg-password" type="password" autoComplete="new-password" placeholder="Min. 8 characters" {...register('password')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
              {errors.password && <p className="mt-1 text-xs font-body text-danger">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium font-body text-text-primary mb-1.5">Confirm password</label>
              <input id="confirm-password" type="password" autoComplete="new-password" placeholder="Repeat password" {...register('confirmPassword')}
                className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
              {errors.confirmPassword && <p className="mt-1 text-xs font-body text-danger">{errors.confirmPassword.message}</p>}
            </div>

            {/* Role note */}
            <div className="bg-surface-alt rounded-lg border border-border p-3 text-xs font-body text-text-secondary leading-relaxed">
              <strong className="text-text-primary">You&apos;re signing up as a reader.</strong> You can apply to publish your own stories after registration via the Author Programme.
            </div>

            <Button type="submit" fullWidth size="lg" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm font-body text-text-secondary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-pop font-medium transition-colors">Sign in</Link>
          </p>

          {/* Demo Login */}
          <DemoLoginPanel />
        </div>
      </div>
    </div>
  );
}
