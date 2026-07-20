import mongoose, { Schema, Document } from 'mongoose';

// Publishing lifecycle states:
// DRAFT             → author is writing, not submitted
// READY_FOR_REVIEW  → author submitted, waiting for admin pickup
// UNDER_REVIEW      → admin is actively reviewing
// APPROVED          → admin approved, author may now create chapters
// PUBLISHED         → at least one chapter is published (readers can read)
// REJECTED          → admin rejected with notes, author must revise and resubmit
// HIATUS            → author temporarily paused an ongoing series
// ARCHIVED          → soft-deleted by author or admin, hidden from all views
export type BookStatus =
  | 'DRAFT'
  | 'READY_FOR_REVIEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'HIATUS'
  | 'ARCHIVED';

export interface IBook extends Document {
  title: string;                           // Book display title (max 200 chars)
  slug: string;                            // Unique SEO-friendly URL slug — e.g. "the-dragons-lair-raven-blackwell"
  synopsis: string;                        // Short description shown on book card and detail page
  coverUrl: string;                        // Cover image CDN URL (URL-only in Phase 4; file upload in Phase 5)
  authorProfile: mongoose.Types.ObjectId;  // Ref to AuthorProfile — used for author page display
  author: mongoose.Types.ObjectId;         // Denormalized Ref to User — for fast permission checks
  genre: mongoose.Types.ObjectId;          // Primary genre (required)
  categories: mongoose.Types.ObjectId[];   // Sub-genre tags (max ~5, not enforced at schema level)
  tags: string[];                          // Free-form search tags — e.g. ["dragon", "royalty"]
  language: string;                        // ISO 639-1 language code — default 'en'
  contentRating: 'EVERYONE' | 'TEEN' | 'MATURE'; // Content warning level
  targetAudience: 'FEMALE' | 'MALE' | 'GENERAL'; // Target reader demographic
  novelType: 'ORIGINAL' | 'ADAPTATION';   // Whether story is original or adapted work
  status: BookStatus;                      // Publishing lifecycle state (7 states)
  isFeatured: boolean;                     // Admin-curated flag for hero/homepage sections
  isDeleted: boolean;                      // Soft-delete flag — never hard-delete books
  // Moderation workflow fields
  reviewNotes?: string;                    // Admin rejection reason shown to author (required on REJECTED)
  submittedAt?: Date;                      // When author last submitted for review
  reviewedAt?: Date;                       // When admin last approved or rejected
  publishedAt?: Date;                      // Set when first chapter is published
  // Denormalized counters — updated via atomic $inc operations in service layer
  chapterCount: number;                    // Total chapters (all statuses)
  freeChapterCount: number;                // Chapters where isFree = true
  totalViews: number;                      // Sum of all chapter viewCounts
  ratingAvg: number;                       // Weighted average of Review.rating (0–5)
  ratingCount: number;                     // Total number of reviews (for recalculating ratingAvg)
  // Monetisation
  defaultChapterPrice: number;             // Default coins per paid chapter (author-configurable)
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title:               { type: String, required: true, trim: true, maxlength: 200 },
    slug:                { type: String, required: true, unique: true, lowercase: true, trim: true },
    synopsis:            { type: String, required: true, maxlength: 1000 },
    coverUrl:            { type: String, default: '' },
    authorProfile:       { type: Schema.Types.ObjectId, ref: 'AuthorProfile', required: true },
    author:              { type: Schema.Types.ObjectId, ref: 'User', required: true },
    genre:               { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    categories:          [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    tags:                [{ type: String, lowercase: true, trim: true, maxlength: 40 }],
    language:            { type: String, default: 'en', maxlength: 5 },
    contentRating:       { type: String, enum: ['EVERYONE', 'TEEN', 'MATURE'], default: 'EVERYONE' },
    targetAudience:      { type: String, enum: ['FEMALE', 'MALE', 'GENERAL'], default: 'GENERAL' },
    novelType:           { type: String, enum: ['ORIGINAL', 'ADAPTATION'], default: 'ORIGINAL' },
    status:              {
      type: String,
      enum: ['DRAFT', 'READY_FOR_REVIEW', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED', 'HIATUS', 'ARCHIVED'],
      default: 'DRAFT',
    },
    isFeatured:          { type: Boolean, default: false },
    isDeleted:           { type: Boolean, default: false },
    reviewNotes:         { type: String, maxlength: 1000 },
    submittedAt:         { type: Date },
    reviewedAt:          { type: Date },
    publishedAt:         { type: Date },
    chapterCount:        { type: Number, default: 0, min: 0 },
    freeChapterCount:    { type: Number, default: 0, min: 0 },
    totalViews:          { type: Number, default: 0, min: 0 },
    ratingAvg:           { type: Number, default: 0, min: 0, max: 5 },
    ratingCount:         { type: Number, default: 0, min: 0 },
    defaultChapterPrice: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Performance-critical compound and single-field indexes
BookSchema.index({ genre: 1, status: 1, isDeleted: 1 });               // Genre browse with status filter
BookSchema.index({ author: 1, isDeleted: 1 });                          // Author's book management dashboard
BookSchema.index({ authorProfile: 1, isDeleted: 1 });                   // Author public profile page
BookSchema.index({ status: 1, isFeatured: 1, isDeleted: 1 });          // Homepage featured section
BookSchema.index({ totalViews: -1, status: 1, isDeleted: 1 });         // Trending books
BookSchema.index({ ratingAvg: -1, status: 1, isDeleted: 1 });          // Top-rated books
BookSchema.index({ publishedAt: -1, status: 1, isDeleted: 1 });        // Newest releases
BookSchema.index({ tags: 1 });                                           // Tag search/filter
BookSchema.index({ status: 1 });                                         // Admin moderation queue
BookSchema.index({ title: 'text', synopsis: 'text', tags: 'text' });   // Full-text search

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
