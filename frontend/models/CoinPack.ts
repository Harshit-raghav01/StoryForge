import mongoose, { Schema, Document } from 'mongoose';

export interface ICoinPack extends Document {
  name: string;             // Pack name, e.g. "Starter Pack", "Double Deal"
  coins: number;            // Coins granted
  bonusCoins: number;       // Promotional bonus coins added
  price: number;            // Cost in smallest currency unit (e.g. paisa for INR to prevent float rounding errors)
  currency: string;         // ISO 4217 code (e.g. "INR", "USD")
  discountPercent: number;  // Display-only label percent
  isActive: boolean;        // Available for purchase
  isFeatured: boolean;      // Highlighted bundle in UI
  sortOrder: number;        // Placement order in coin store
  createdAt: Date;
  updatedAt: Date;
}

const CoinPackSchema = new Schema<ICoinPack>(
  {
    name:            { type: String,  required: true, trim: true, maxlength: 80 },
    coins:           { type: Number,  required: true, min: 1 },
    bonusCoins:      { type: Number,  default: 0, min: 0 },
    price:           { type: Number,  required: true, min: 0 },
    currency:        { type: String,  default: 'INR', uppercase: true, maxlength: 3 },
    discountPercent: { type: Number,  default: 0, min: 0, max: 100 },
    isActive:        { type: Boolean, default: true },
    isFeatured:      { type: Boolean, default: false },
    sortOrder:       { type: Number,  default: 0 },
  },
  { timestamps: true }
);

// Indexes
CoinPackSchema.index({ isActive: 1, sortOrder: 1 }); // Sorted lists on purchase screen

export default mongoose.models.CoinPack || mongoose.model<ICoinPack>('CoinPack', CoinPackSchema);
