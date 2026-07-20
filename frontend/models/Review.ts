import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;  // Reviewer user
  book: mongoose.Types.ObjectId;  // Reviewed book
  rating: number;                 // 1-5 star rating
  content?: string;               // Written review content (max 2000 chars)
  likes: number;                  // Number of helpful votes
  isEdited: boolean;              // True if content was modified after creation
  isDeleted: boolean;             // Soft delete for admin safety
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book:      { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    content:   { type: String, maxlength: 2000 },
    likes:     { type: Number, default: 0, min: 0 },
    isEdited:  { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
ReviewSchema.index({ user: 1, book: 1 }, { unique: true });  // Limit to one review per user per book
ReviewSchema.index({ book: 1, isDeleted: 1, createdAt: -1 }); // Book reviews page feed
ReviewSchema.index({ book: 1, rating: 1 });                    // Rating aggregates calculation

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
