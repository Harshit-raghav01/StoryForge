import mongoose, { Schema, Document } from 'mongoose';

// Tracks how far a user has read through a book.
// One record per (user, book) pair — enforced by unique compound index.
export interface IReadingProgress extends Document {
  user: mongoose.Types.ObjectId;            // The reading user
  book: mongoose.Types.ObjectId;            // The book being read
  lastChapterRead: mongoose.Types.ObjectId; // Most recently accessed chapter — drives "Continue reading" CTA
  chaptersRead: number;                     // Count of chapters accessed (not an array — avoids large doc growth)
  totalChapters: number;                    // Snapshot of Book.chapterCount at time of last read
  progressPercent: number;                  // Derived: (chaptersRead / totalChapters) * 100, stored for fast sort
  isCompleted: boolean;                     // True when chaptersRead >= totalChapters
  lastReadAt: Date;                         // Timestamp of most recent chapter access — used to sort "Continue reading"
  createdAt: Date;
  updatedAt: Date;
}

const ReadingProgressSchema = new Schema<IReadingProgress>(
  {
    user:             { type: Schema.Types.ObjectId, ref: 'User',    required: true },
    book:             { type: Schema.Types.ObjectId, ref: 'Book',    required: true },
    lastChapterRead:  { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    chaptersRead:     { type: Number, default: 1, min: 0 },
    totalChapters:    { type: Number, default: 0, min: 0 },
    progressPercent:  { type: Number, default: 0, min: 0, max: 100 },
    isCompleted:      { type: Boolean, default: false },
    lastReadAt:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ReadingProgressSchema.index({ user: 1, book: 1 }, { unique: true }); // Enforce one record per user+book
ReadingProgressSchema.index({ user: 1, lastReadAt: -1 });             // "Continue reading" list (sorted by recency)
ReadingProgressSchema.index({ book: 1, isCompleted: 1 });             // Count readers who finished (analytics)

export default mongoose.models.ReadingProgress ||
  mongoose.model<IReadingProgress>('ReadingProgress', ReadingProgressSchema);
