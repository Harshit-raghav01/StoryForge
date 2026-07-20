import mongoose, { Schema, Document } from 'mongoose';

export interface IBookVersion extends Document {
  book: mongoose.Types.ObjectId;      // Reference to the Book being modified
  editedBy: mongoose.Types.ObjectId;  // Reference to the User (author or admin) who performed the edit
  changes: {
    field: string;                    // Name of the modified field (e.g., 'title', 'synopsis', 'coverUrl')
    oldValue?: any;                   // Value before the edit
    newValue?: any;                   // Value after the edit
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BookVersionSchema = new Schema<IBookVersion>(
  {
    book:     { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    editedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changes:  [
      {
        field:    { type: String, required: true },
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Only track creation time
);

// Indexes
BookVersionSchema.index({ book: 1, createdAt: -1 }); // Fast loading of revision history for a book

export default mongoose.models.BookVersion ||
  mongoose.model<IBookVersion>('BookVersion', BookVersionSchema);
