import mongoose, { Schema, Document } from 'mongoose';

// Category is a sub-tag within a Genre.
// Example: Genre = "Romance" → Categories = "Second Chance", "Billionaire", "Enemies to Lovers"
export interface ICategory extends Document {
  name: string;                          // Display name — e.g. "Second Chance"
  slug: string;                          // URL-safe — e.g. "second-chance" (unique per genre)
  genre: mongoose.Types.ObjectId;        // Parent genre this category belongs to
  description?: string;                  // Optional tooltip/description shown in admin or filter UI
  isActive: boolean;                     // Soft-disable without removing the category from books
  bookCount: number;                     // Denormalized count of PUBLISHED books using this category
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name:        { type: String, required: true, trim: true, maxlength: 80 },
    slug:        { type: String, required: true, lowercase: true, trim: true },
    genre:       { type: Schema.Types.ObjectId, ref: 'Genre', required: true },
    description: { type: String, maxlength: 500 },
    isActive:    { type: Boolean, default: true },
    bookCount:   { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ genre: 1 });                                    // All categories under a genre
CategorySchema.index({ slug: 1, genre: 1 }, { unique: true });         // Slug unique per genre (not globally)
CategorySchema.index({ isActive: 1, genre: 1 });                       // Active categories for a genre

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
