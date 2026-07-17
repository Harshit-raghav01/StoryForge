'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/Button';
import { WaxSealIcon } from '@/components/WaxSealIcon';
import { motion } from 'framer-motion';

const schema = z.object({
  penName: z.string()
    .min(2, 'Pen name must be at least 2 characters')
    .max(30, 'Pen name cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Pen name can only contain letters, numbers, spaces, or underscores'),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio cannot exceed 500 characters'),
});

type FormData = z.infer<typeof schema>;

export default function BecomeAuthorPage() {
  const { currentUser, becomeAuthor } = useUserStore();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!currentUser) return null;

  const onSubmit = async (data: FormData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    becomeAuthor(data.penName, data.bio);
    setSuccess(true);
  };

  if (success || currentUser.authorProfile) {
    const penName = currentUser.authorProfile?.penName || '';
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12 px-6 bg-surface rounded-card border border-border shadow-soft"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <WaxSealIcon size={36} />
          </div>
        </div>
        <h2 className="font-display text-2xl font-semibold text-text-primary mb-3">
          Congratulations, {currentUser.name}!
        </h2>
        <p className="text-sm font-body text-text-secondary mb-6 leading-relaxed">
          Your author profile for <strong className="text-primary font-semibold">{penName}</strong> is now active. You have unlocked access to:
        </p>
        <div className="text-left max-w-xs mx-auto space-y-3 bg-surface-alt p-4 rounded-lg border border-border mb-8">
          <p className="text-xs font-body text-text-primary flex items-center gap-2">
            <span>📚</span> <span>Book Manager & Serialization</span>
          </p>
          <p className="text-xs font-body text-text-primary flex items-center gap-2">
            <span>📝</span> <span>Rich Chapter Editor (Tiptap)</span>
          </p>
          <p className="text-xs font-body text-text-primary flex items-center gap-2">
            <span>💰</span> <span>Earnings and Payout Statements</span>
          </p>
          <p className="text-xs font-body text-text-primary flex items-center gap-2">
            <span>📈</span> <span>Reader Retention Analytics</span>
          </p>
        </div>
        <Button href="/dashboard" variant="primary" size="md" fullWidth>
          Go to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
          Create Author Profile
        </h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Sign up to begin publishing serialized novels and earning coins from unlocks.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface rounded-card border border-border p-6 shadow-soft">
        {/* Pen Name */}
        <div>
          <label htmlFor="pen-name" className="block text-sm font-semibold font-body text-text-primary mb-1.5">
            Pen Name / Author Name
          </label>
          <input
            id="pen-name"
            type="text"
            placeholder="e.g. Raven Blackwell"
            {...register('penName')}
            className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
          />
          {errors.penName && (
            <p className="mt-1.5 text-xs font-body text-danger">{errors.penName.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-semibold font-body text-text-primary mb-1.5">
            Short Biography
          </label>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell your readers about yourself, your writing genres, and release schedules..."
            {...register('bio')}
            className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors resize-none leading-relaxed"
          />
          {errors.bio && (
            <p className="mt-1.5 text-xs font-body text-danger">{errors.bio.message}</p>
          )}
        </div>

        {/* Note on guidelines */}
        <div className="p-4 rounded-lg bg-surface-alt border border-border text-xs font-body text-text-secondary leading-relaxed">
          <p className="font-semibold text-text-primary mb-1">Writer Agreement Rules:</p>
          By establishing a pen name, you agree to serialize only original fiction or legally authorized adaptations. Chapters priced for coins generate earnings based on reader unlocks.
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" size="lg" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Activate Author Profile'}
          </Button>
          <Button href="/dashboard" type="button" size="lg" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
