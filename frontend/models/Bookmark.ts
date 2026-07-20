import mongoose, { Schema, Document } from 'mongoose';

// A bookmark can target either a whole book (chapter = undefined) or a specific chapter position.
export interface IBookmark extends Document {
  user: mongoose.Types.ObjectId;       // The user who created this bookmark
  book: mongoose.Types.ObjectId;       // The bookmarked book (always required)
  chapter?: mongoose.Types.ObjectId;   // Optional — bookmark a specific chapter within the book
  note?: string;                       // Reader's personal annotation / reminder note
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    user:    { type: Schema.Types.ObjectId, ref: 'User',    required: true },
    book:    { type: Schema.Types.ObjectId, ref: 'Book',    required: true },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    note:    { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Compound unique: user can bookmark a specific chapter once; also one book-level bookmark per user
BookmarkSchema.index({ user: 1, book: 1, chapter: 1 }, { unique: true, sparse: true });
BookmarkSchema.index({ user: 1, createdAt: -1 }); // User's bookmark list sorted by newest

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
