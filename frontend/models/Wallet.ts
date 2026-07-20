import mongoose, { Schema, Document } from 'mongoose';

// One wallet per user. User.coinBalance is a denormalized mirror of Wallet.balance.
// Both must always be updated together in the service layer using a transaction or atomic ops.
export interface IWallet extends Document {
  user: mongoose.Types.ObjectId; // 1:1 reference to User (unique)
  balance: number;               // Current coin balance — source of truth for billing logic
  totalPurchased: number;        // Lifetime total coins bought via CoinPacks (purchase history)
  totalEarned: number;           // Lifetime coins earned as author royalties from chapter unlocks
  totalSpent: number;            // Lifetime coins spent unlocking chapters
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
  {
    user:           { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance:        { type: Number, default: 0, min: 0 },
    totalPurchased: { type: Number, default: 0, min: 0 },
    totalEarned:    { type: Number, default: 0, min: 0 },
    totalSpent:     { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

WalletSchema.index({ user: 1 }); // Direct lookup by user when loading dashboard wallet card

export default mongoose.models.Wallet || mongoose.model<IWallet>('Wallet', WalletSchema);
