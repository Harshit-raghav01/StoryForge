'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/Button';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  notifications: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const { currentUser } = useUserStore();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      notifications: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
          Account Settings
        </h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Manage your personal details and app configuration.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-lg bg-success/15 border border-success text-success text-sm font-body">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface rounded-card border border-border p-6 shadow-soft">
        {/* Profile Details Section */}
        <div className="space-y-4">
          <h2 className="font-display text-base font-semibold text-text-primary border-b border-border pb-2">
            Profile Details
          </h2>
          
          <div>
            <label htmlFor="settings-name" className="block text-sm font-semibold font-body text-text-primary mb-1.5">
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-body text-danger">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="settings-email" className="block text-sm font-semibold font-body text-text-primary mb-1.5">
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-xs font-body text-danger">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="space-y-4 pt-4">
          <h2 className="font-display text-base font-semibold text-text-primary border-b border-border pb-2">
            Preferences
          </h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-body font-semibold text-text-primary">Email Notifications</p>
              <p className="text-xs font-body text-text-secondary mt-0.5">Receive updates about followed books and promo campaigns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('notifications')} className="sr-only peer" />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="submit" size="md" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
