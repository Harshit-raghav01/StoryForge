import mongoose, { Schema, Document } from 'mongoose';

// Append-only financial audit ledger. Never update a record after creation.
// This preserves a complete, tamper-evident history of every coin movement.
export type TransactionType =
  | 'PURCHASE'         // User bought coins via a CoinPack
  | 'CHAPTER_UNLOCK'   // User spent coins to unlock a paid chapter
  | 'AUTHOR_EARNING'   // Author received coins when a reader unlocked their chapter
  | 'REFUND'           // Coins refunded to user (admin action or failed purchase)
  | 'BONUS'            // Promotional free coins granted by admin
  | 'ADMIN_ADJUST';    // Manual balance correction by admin

export interface IWalletTransaction extends Document {
  user: mongoose.Types.ObjectId;           // The user whose wallet was affected
  type: TransactionType;
  amount: number;                          // Positive = credit (coins added), negative = debit (coins removed)
  balanceBefore: number;                   // Wallet.balance snapshot before this transaction
  balanceAfter: number;                    // Wallet.balance snapshot after — useful for dispute resolution
  description: string;                     // Human-readable summary, e.g. "Unlocked Chapter 5 of The Dragon's Lair"
  // Polymorphic reference for full traceability
  referenceModel?: 'Chapter' | 'CoinPack' | 'Book'; // Which collection the referenceId points to
  referenceId?: mongoose.Types.ObjectId;             // The specific document that triggered this transaction
  // Payment gateway fields (only populated for PURCHASE transactions)
  paymentGateway?: 'RAZORPAY' | 'STRIPE' | 'PAYPAL';
  paymentOrderId?: string;                 // Gateway-issued order ID for reconciliation
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['PURCHASE', 'CHAPTER_UNLOCK', 'AUTHOR_EARNING', 'REFUND', 'BONUS', 'ADMIN_ADJUST'],
      required: true,
    },
    amount:          { type: Number, required: true },
    balanceBefore:   { type: Number, required: true },
    balanceAfter:    { type: Number, required: true },
    description:     { type: String, required: true, maxlength: 300 },
    referenceModel:  { type: String, enum: ['Chapter', 'CoinPack', 'Book'] },
    referenceId:     { type: Schema.Types.ObjectId },
    paymentGateway:  { type: String, enum: ['RAZORPAY', 'STRIPE', 'PAYPAL'] },
    paymentOrderId:  { type: String },
    paymentStatus:   { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'] },
  },
  { timestamps: true }
);

WalletTransactionSchema.index({ user: 1, createdAt: -1 });            // Paginated transaction history per user
WalletTransactionSchema.index({ type: 1, createdAt: -1 });            // Admin analytics by transaction type
WalletTransactionSchema.index({ referenceId: 1 }, { sparse: true });  // Trace all transactions for a chapter/pack
WalletTransactionSchema.index({ paymentOrderId: 1 }, { sparse: true }); // Payment gateway reconciliation

export default mongoose.models.WalletTransaction ||
  mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
