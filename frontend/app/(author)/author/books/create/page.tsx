'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { genres, tags } from '@/lib/mockData';
import { Button } from '@/components/Button';
import { WaxSealIcon } from '@/components/WaxSealIcon';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(60, 'Max 60 characters'),
  language: z.string().min(1),
  targetAudience: z.enum(['female', 'male', 'general']),
  contentRating: z.enum(['4+', '12+', '16+', '18+']),
  novelType: z.enum(['original', 'adaptation']),
  genreId: z.string().min(1, 'Please select a genre'),
  synopsis: z.string()
    .min(1, 'Synopsis is required')
    .refine((v) => v.trim().split(/\s+/).length >= 20, 'Minimum 20 words')
    .refine((v) => v.trim().split(/\s+/).length <= 300, 'Maximum 300 words'),
});
type FormData = z.infer<typeof schema>;

const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese'];

export default function CreateBookPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [synopsisWordCount, setSynopsisWordCount] = useState(0);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: 'English', targetAudience: 'female', contentRating: '12+', novelType: 'original' },
  });

  const synopsis = watch('synopsis') || '';
  const titleVal = watch('title') || '';

  const onSubmit = async (data: FormData) => {
    console.log('Create book:', data, 'tags:', selectedTags);
    window.location.href = '/author/books/b1/editor';
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Create a new book</h1>
        <p className="text-text-secondary font-body text-sm mt-1">Fill in the details below — you can always edit later.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cover upload */}
        <div>
          <label className="block text-sm font-semibold font-body text-text-primary mb-3">Book cover</label>
          <div className="flex gap-4 flex-wrap">
            {/* Upload own */}
            <label
              className="flex flex-col items-center justify-center w-32 h-44 rounded-card border-2 border-dashed border-border hover:border-primary/40 bg-surface-alt cursor-pointer transition-colors group"
              id="cover-upload-own"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-secondary group-hover:text-primary transition-colors mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              <span className="text-xs font-body text-text-secondary group-hover:text-primary transition-colors text-center px-2">Upload your own</span>
              <span className="text-[10px] font-body text-text-secondary mt-1">600×800px JPG/PNG</span>
              <input type="file" accept=".jpg,.jpeg,.png" className="hidden" />
            </label>

            {/* Template picker placeholder */}
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-32 h-44 rounded-card border border-border bg-gradient-to-br from-primary/20 to-support/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:shadow-card transition-all"
              >
                <WaxSealIcon size={28} />
                <span className="text-[10px] font-body text-text-secondary">Template {n}</span>
              </div>
            ))}
          </div>
          <p className="text-xs font-body text-text-secondary mt-2">Recommended: 600×800px, JPG or PNG.</p>
        </div>

        {/* Book Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="book-title" className="text-sm font-semibold font-body text-text-primary">Book title</label>
            <span className={`text-xs font-mono tabular-nums ${titleVal.length > 55 ? 'text-danger' : 'text-text-secondary'}`}>{titleVal.length}/60</span>
          </div>
          <input id="book-title" type="text" placeholder="Give your story a compelling title…" {...register('title')}
            className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors" />
          {errors.title && <p className="mt-1 text-xs font-body text-danger">{errors.title.message}</p>}
        </div>

        {/* Language + Audience row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-semibold font-body text-text-primary mb-1.5">Language</label>
            <select id="language" {...register('language')} className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              {languages.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="target-audience" className="block text-sm font-semibold font-body text-text-primary mb-1.5">Target audience</label>
            <select id="target-audience" {...register('targetAudience')} className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Content rating + Novel type row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="content-rating" className="block text-sm font-semibold font-body text-text-primary mb-1.5">Content rating</label>
            <select id="content-rating" {...register('contentRating')} className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              {['4+', '12+', '16+', '18+'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="novel-type" className="block text-sm font-semibold font-body text-text-primary mb-1.5">Novel type</label>
            <select id="novel-type" {...register('novelType')} className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="original">Original</option>
              <option value="adaptation">Adaptation</option>
            </select>
          </div>
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-semibold font-body text-text-primary mb-1.5">Genre</label>
          <select id="genre" {...register('genreId')} className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
            <option value="">Select a genre…</option>
            {genres.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
          {errors.genreId && <p className="mt-1 text-xs font-body text-danger">{errors.genreId.message}</p>}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold font-body text-text-primary">Tags / Tropes</label>
            <button type="button" onClick={() => setTagModalOpen(true)} className="text-xs font-body text-primary hover:text-primary-pop transition-colors">
              Edit tags
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[36px] p-3 rounded-input border border-border bg-surface-alt">
            {selectedTags.length === 0 ? (
              <span className="text-text-secondary text-sm font-body">No tags selected. Click &quot;Edit tags&quot; to add tropes.</span>
            ) : selectedTags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-pill text-xs font-medium font-body bg-support/15 text-support">
                {tag} <button type="button" onClick={() => toggleTag(tag)} className="ml-1 opacity-60 hover:opacity-100">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Synopsis */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="synopsis" className="text-sm font-semibold font-body text-text-primary">Synopsis</label>
            <span className={`text-xs font-mono tabular-nums ${synopsisWordCount < 20 || synopsisWordCount > 300 ? 'text-danger' : 'text-success'}`}>
              {synopsisWordCount} / 300 words
            </span>
          </div>
          <textarea
            id="synopsis"
            rows={5}
            placeholder="Write your synopsis here. Include your genre, tone, and key tropes to help readers find your story (20–300 words)…"
            {...register('synopsis')}
            onChange={(e) => {
              setSynopsisWordCount(e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0);
            }}
            className="w-full px-4 py-3 rounded-input border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors resize-none leading-relaxed"
          />
          {errors.synopsis && <p className="mt-1 text-xs font-body text-danger">{errors.synopsis.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" size="lg" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create book'}
          </Button>
          <Button type="button" size="lg" variant="secondary" onClick={() => window.location.href = '/author/books/b1/editor'}>
            Skip for now
          </Button>
        </div>
      </form>

      {/* Tag modal */}
      {tagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setTagModalOpen(false)} />
          <div className="relative w-full max-w-md bg-surface rounded-card border border-border shadow-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-text-primary">Edit tags</h2>
              <button onClick={() => setTagModalOpen(false)} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-pill text-sm font-body transition-colors ${selectedTags.includes(tag) ? 'bg-primary text-white' : 'bg-surface-alt text-text-secondary hover:bg-support/15 hover:text-support border border-border'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <Button fullWidth variant="primary" onClick={() => setTagModalOpen(false)}>
              Done ({selectedTags.length} selected)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
