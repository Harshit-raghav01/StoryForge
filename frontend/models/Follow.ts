import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;       // User who follows
  authorProfile: mongoose.Types.ObjectId; // AuthorProfile being followed
  createdAt: Date;
  updatedAt: Date;
}

const FollowSchema = new Schema<IFollow>(
  {
    follower:      { type: Schema.Types.ObjectId, ref: 'User',          required: true },
    authorProfile: { type: Schema.Types.ObjectId, ref: 'AuthorProfile', required: true },
  },
  { timestamps: true }
);

// Indexes
FollowSchema.index({ follower: 1, authorProfile: 1 }, { unique: true });  // Prevent double-follow
FollowSchema.index({ authorProfile: 1 });                                  // List author followers
FollowSchema.index({ follower: 1 });                                       // List authors user is following

export default mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);
