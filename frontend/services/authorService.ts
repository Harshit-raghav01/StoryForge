import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import AuthorProfile from '@/models/AuthorProfile';
import { z } from 'zod';
import mongoose from 'mongoose';

// List of URL paths and system identifiers reserved to prevent user spoofing or route hijack
const RESERVED_NAMES = [
  'admin', 'dashboard', 'api', 'login', 'register', 'books', 'storyforge', 'auth',
  'user', 'settings', 'genre', 'genres', 'category', 'categories', 'wallet', 'coins',
  'browse', 'privacy', 'terms', 'about', 'support', 'help', 'search', 'notification',
  'notifications', 'profile', 'profiles', 'becoming-author', 'become-author', 'create-book'
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

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

  // 2b. Generate slug and check against reserved names
  const slug = slugify(validatedData.penName);
  if (RESERVED_NAMES.includes(slug)) {
    throw new Error('Pen name is a reserved term');
  }

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

    // 6. Check if penName or slug is already taken (case-insensitive check)
    const existingProfile = await AuthorProfile.findOne({
      $or: [
        { penName: { $regex: new RegExp(`^${validatedData.penName.trim()}$`, 'i') } },
        { slug }
      ]
    }).session(session);

    if (existingProfile) {
      throw new Error('Pen name or its URL slug is already taken');
    }

    // 7. Create the AuthorProfile document
    const [newProfile] = await AuthorProfile.create(
      [
        {
          userId: user._id,
          penName: validatedData.penName.trim(),
          slug,
          bio: validatedData.bio.trim(),
          isVerified: false,
          followerCount: 0,
          totalEarnings: 0,
          totalBooks: 0,
          status: 'ACTIVE',
          profileCompleted: false,
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
        slug: newProfile.slug,
        bio: newProfile.bio,
        verified: newProfile.isVerified,
        followers: newProfile.followerCount,
        earnings: newProfile.totalEarnings,
        profileCompleted: newProfile.profileCompleted,
      }
    };
  } catch (error) {
    // Abort transaction on error and clean up session
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
