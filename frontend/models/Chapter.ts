import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  book: mongoose.Types.ObjectId;    // Parent book reference
  author: mongoose.Types.ObjectId;  // Denormalized User ref — avoids joining Book for permission checks
  title: string;                    // Chapter title displayed in chapter list and reader header
  chapterNumber: number;            // Display order (1, 2, 3…) — unique per book
  content: string;                  // Full chapter body (HTML-safe or Markdown)
  wordCount: number;                // Auto-computed from content length on save
  isFree: boolean;                  // If true, any reader can access without spending coins
  coinPrice: number;                // Coins required to unlock; always 0 when isFree = true
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'; // Content visibility state
  scheduledAt?: Date;               // Used when status = 'SCHEDULED'; processed by cron/edge function
  publishedAt?: Date;               // Set when status transitions to PUBLISHED
  viewCount: number;                // Incremented on each unique read event (not strictly unique)
  isDeleted: boolean;               // Soft delete — keeps reader progress intact
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    book:          { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    author:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:         { type: String, required: true, trim: true, maxlength: 200 },
    chapterNumber: { type: Number, required: true, min: 1 },
    content:       { type: String, required: true },
    wordCount:     { type: Number, default: 0, min: 0 },
    isFree:        { type: Boolean, default: false },
    coinPrice:     { type: Number, default: 0, min: 0 },
    status:        { type: String, enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED'], default: 'DRAFT' },
    scheduledAt:   { type: Date },
    publishedAt:   { type: Date },
    viewCount:     { type: Number, default: 0, min: 0 },
    isDeleted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

ChapterSchema.index({ book: 1, chapterNumber: 1 }, { unique: true }); // Prevent duplicate chapter numbers per book
ChapterSchema.index({ book: 1, status: 1 });                           // Published chapters list for readers
ChapterSchema.index({ book: 1, isFree: 1 });                          // Count free chapters for book card
ChapterSchema.index({ author: 1, status: 1 });                         // Author's chapter management dashboard
ChapterSchema.index({ scheduledAt: 1 }, { sparse: true });             // Scheduled publish cron query

export default mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);
