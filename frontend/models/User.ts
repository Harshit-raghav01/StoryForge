import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;                            // Display name shown across the app
  email: string;                           // Unique login email (stored lowercase)
  passwordHash?: string;                   // bcrypt hash — undefined for OAuth-only accounts
  googleId?: string;                       // Google OAuth sub claim (unique per Google account)
  avatarUrl?: string;                      // Profile picture CDN URL
  role: 'USER' | 'ADMIN';                 // Access control — no separate Author role; authors are USERs with an AuthorProfile
  isVerified: boolean;                     // True after email verification link is clicked
  verificationToken?: string;              // Signed token sent in the verification email
  verificationExpires?: Date;              // Expiry for the verification token (e.g. 24 hours)
  resetPasswordToken?: string;             // Hashed token for password reset flow
  resetPasswordExpires?: Date;             // Expiry for reset token — typically 1 hour
  coinBalance: number;                     // Denormalized mirror of Wallet.balance for fast UI reads
  authorProfile?: mongoose.Types.ObjectId; // Set when user creates an AuthorProfile
  isActive: boolean;                       // Soft-disable without deletion (admin use)
  lastSeenAt?: Date;                       // Updated on each authenticated API request
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:                 { type: String,  required: true, trim: true, maxlength: 100 },
    email:                { type: String,  required: true, unique: true, lowercase: true, trim: true },
    passwordHash:         { type: String },
    googleId:             { type: String },
    avatarUrl:            { type: String, default: '' },
    role:                 { type: String,  enum: ['USER', 'ADMIN'], default: 'USER' },
    isVerified:           { type: Boolean, default: false },
    verificationToken:    { type: String },
    verificationExpires:  { type: Date },
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
    coinBalance:          { type: Number,  default: 0, min: 0 },
    authorProfile:        { type: Schema.Types.ObjectId, ref: 'AuthorProfile' },
    isActive:             { type: Boolean, default: true },
    lastSeenAt:           { type: Date },
  },
  { timestamps: true }
);

// Indexes
// Note: email already has a unique index from `unique: true` on the field definition above.
// Defining it again via UserSchema.index() would create a duplicate — hence it's omitted here.
UserSchema.index({ googleId: 1 }, { sparse: true });   // OAuth lookup (sparse = skip docs without googleId)
UserSchema.index({ role: 1 });                         // Admin panel user list filter
UserSchema.index({ isActive: 1 });                     // Filter suspended/inactive users

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
