import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthorProfile extends Document {
  userId: mongoose.Types.ObjectId;        // 1:1 back-reference to the User document
  penName: string;                        // Public author name shown on all public pages (unique)
  slug: string;                           // URL-safe unique pen name slug (e.g. "harshit-raghav")
  bio: string;                            // Rich-text-safe author description shown on profile page
  avatarUrl?: string;                     // Author-specific avatar (can override User.avatarUrl)
  coverImageUrl?: string;                 // Wide banner image for the author profile page
  website?: string;                       // Personal or publisher website URL
  socialLinks: {                          // Optional social media handles (stored as plain usernames/URLs)
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  isVerified: boolean;                    // Verified badge shown next to pen name
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED'; // Author account lifecycle managed by admin
  followerCount: number;                  // Denormalized — incremented/decremented on Follow create/delete
  totalEarnings: number;                  // Lifetime coins earned from chapter unlocks by readers
  totalBooks: number;                     // Denormalized count of PUBLISHED books (not drafts)
  profileCompleted: boolean;              // Tracks full profile completion (avatar, bio, social links, etc.)
  createdAt: Date;
  updatedAt: Date;
}

const AuthorProfileSchema = new Schema<IAuthorProfile>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    penName:          { type: String, required: true, unique: true, trim: true, maxlength: 60 },
    slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio:              { type: String, default: '', maxlength: 2000 },
    avatarUrl:        { type: String },
    coverImageUrl:    { type: String },
    website:          { type: String },
    socialLinks: {
      twitter:   { type: String },
      instagram: { type: String },
      facebook:  { type: String },
    },
    isVerified:       { type: Boolean, default: false },
    status:           { type: String, enum: ['PENDING', 'ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    followerCount:    { type: Number, default: 0, min: 0 },
    totalEarnings:    { type: Number, default: 0, min: 0 },
    totalBooks:       { type: Number, default: 0, min: 0 },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AuthorProfileSchema.index({ userId: 1 });
AuthorProfileSchema.index({ penName: 1 });
AuthorProfileSchema.index({ slug: 1 }, { unique: true });
AuthorProfileSchema.index({ status: 1 });
AuthorProfileSchema.index({ followerCount: -1 }); // Top authors leaderboard / discovery

export default mongoose.models.AuthorProfile ||
  mongoose.model<IAuthorProfile>('AuthorProfile', AuthorProfileSchema);
