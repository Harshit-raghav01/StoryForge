import mongoose, { Schema, Document } from 'mongoose';

export interface IAuthorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  penName: string;
  bio: string;
  isVerified: boolean;
  followerCount: number;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorProfileSchema = new Schema<IAuthorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    penName: { type: String, required: true, unique: true, trim: true },
    bio: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    followerCount: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.AuthorProfile || mongoose.model<IAuthorProfile>('AuthorProfile', AuthorProfileSchema);
