import mongoose, { Schema, Document } from 'mongoose';

export interface ILibrary extends Document {
  user: mongoose.Types.ObjectId;  // Ref to User who added the book
  book: mongoose.Types.ObjectId;  // Ref to the saved Book
  createdAt: Date;
  updatedAt: Date;
}

const LibrarySchema = new Schema<ILibrary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

// Indexes
LibrarySchema.index({ user: 1, book: 1 }, { unique: true });  // Prevent duplicates
LibrarySchema.index({ user: 1, createdAt: -1 });               // User library dashboard sorted by date
LibrarySchema.index({ book: 1 });                              // Count how many users saved a book

export default mongoose.models.Library || mongoose.model<ILibrary>('Library', LibrarySchema);
