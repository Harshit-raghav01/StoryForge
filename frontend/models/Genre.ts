import mongoose, { Schema, Document } from 'mongoose';

export interface IGenre extends Document {
  name: string;        // Display name shown in UI — e.g. "Romance", "Dark Fantasy"
  slug: string;        // URL-safe identifier used in routes — e.g. "romance", "dark-fantasy"
  description?: string; // Optional short description shown on browse/genre pages
  icon?: string;       // Emoji or CDN icon URL for genre pills/cards
  isActive: boolean;   // Soft-disable: hide genre from browse without deleting books under it
  bookCount: number;   // Denormalized count of PUBLISHED books in this genre
  createdAt: Date;
  updatedAt: Date;
}

const GenreSchema = new Schema<IGenre>(
  {
    name:        { type: String, required: true, unique: true, trim: true, maxlength: 80 },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, maxlength: 500 },
    icon:        { type: String },
    isActive:    { type: Boolean, default: true },
    bookCount:   { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

GenreSchema.index({ slug: 1 });        // Route lookup: /browse?genre=romance
GenreSchema.index({ isActive: 1 });    // Filter active genres for browse page

export default mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema);
