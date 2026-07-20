import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType =
  | 'NEW_CHAPTER'       // Author published a new chapter for a book the user has in library/follows
  | 'NEW_FOLLOWER'      // Someone followed the author
  | 'BOOK_COMPLETED'    // Book marked as complete
  | 'REVIEW_RECEIVED'   // Reader wrote a review on author's book
  | 'COIN_EARNED'       // Author earned coins from reader unlocking chapter
  | 'SYSTEM';           // System notice

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;   // Recipient user
  type: NotificationType;
  title: string;                        // Headline message
  message: string;                      // Full description
  isRead: boolean;
  actionUrl?: string;                   // URL to redirect on click
  referenceModel?: string;              // Polymorphic source model (Book, Chapter, etc.)
  referenceId?: mongoose.Types.ObjectId; // Source document ID
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type:           { type: String, enum: ['NEW_CHAPTER', 'NEW_FOLLOWER', 'BOOK_COMPLETED', 'REVIEW_RECEIVED', 'COIN_EARNED', 'SYSTEM'], required: true },
    title:          { type: String, required: true, maxlength: 150 },
    message:        { type: String, required: true, maxlength: 500 },
    isRead:         { type: Boolean, default: false },
    actionUrl:      { type: String },
    referenceModel: { type: String },
    referenceId:    { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

// Indexes
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });      // Notification tray query
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL: Auto-purge after 90 days

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);
