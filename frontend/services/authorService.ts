import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import AuthorProfile from '@/models/AuthorProfile';
import { z } from 'zod';
import mongoose from 'mongoose';

// Server-side onboarding schema matching the client validation exactly
export const AuthorOnboardSchema = z.object({
  penName: z.string()
    .min(2, 'Pen name must be at least 2 characters')
    .max(30, 'Pen name cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_ ]+$/, 'Pen name can only contain letters, numbers, spaces, or underscores'),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio cannot exceed 500 characters'),
});

export type AuthorOnboardInput = z.infer<typeof AuthorOnboardSchema>;

export async function onboardAuthor(userId: string, input: AuthorOnboardInput) {
  // 1. Connect to database
  await connectToDatabase();

  // 2. Validate using Zod
  const validatedData = AuthorOnboardSchema.parse(input);

  // 3. Start a Mongoose Session/Transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4. Fetch the user within the transaction session
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    // 5. Prevent duplicate author profiles for the same user
    if (user.authorProfile) {
      throw new Error('User already has an author profile');
    }

    // 6. Check if penName is already taken (case-insensitive check)
    const existingPenName = await AuthorProfile.findOne({
      penName: { $regex: new RegExp(`^${validatedData.penName.trim()}$`, 'i') }
    }).session(session);

    if (existingPenName) {
      throw new Error('Pen name is already taken');
    }

    // 7. Create the AuthorProfile document
    const [newProfile] = await AuthorProfile.create(
      [
        {
          userId: user._id,
          penName: validatedData.penName.trim(),
          bio: validatedData.bio.trim(),
          isVerified: false,
          followerCount: 0,
          totalEarnings: 0,
          totalBooks: 0,
          status: 'ACTIVE',
        }
      ],
      { session }
    );

    // 8. Update User document with the AuthorProfile reference
    user.authorProfile = newProfile._id;
    await user.save({ session });

    // 9. Commit transaction and end session
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      authorProfile: {
        penName: newProfile.penName,
        bio: newProfile.bio,
        verified: newProfile.isVerified,
        followers: newProfile.followerCount,
        earnings: newProfile.totalEarnings,
      }
    };
  } catch (error) {
    // Abort transaction on error and clean up session
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
