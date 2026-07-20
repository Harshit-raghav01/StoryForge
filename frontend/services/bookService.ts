import connectToDatabase from '@/lib/db';
import Book, { BookStatus } from '@/models/Book';
import AuthorProfile from '@/models/AuthorProfile';
import User from '@/models/User';
import BookVersion from '@/models/BookVersion';
import { BookEvents } from '@/lib/events';
import { generateBookSlug, resolveSlugCollision } from '@/lib/slugify';
import { z } from 'zod';
import mongoose from 'mongoose';

// ─── Zod Validation Schemas ────────────────────────────────────────────────

export const CreateBookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  synopsis: z.string()
    .min(20, 'Synopsis must be at least 20 words')
    .max(1000, 'Synopsis too long'),
  coverUrl: z.string().url('Cover must be a valid URL').or(z.literal('')).optional().default(''),
  genreId: z.string().min(1, 'Genre is required'),
  categories: z.array(z.string()).max(5).optional().default([]),
  tags: z.array(z.string().max(40)).max(10).optional().default([]),
  language: z.string().default('en'),
  contentRating: z.enum(['EVERYONE', 'TEEN', 'MATURE']).default('EVERYONE'),
  targetAudience: z.enum(['FEMALE', 'MALE', 'GENERAL']).default('GENERAL'),
  novelType: z.enum(['ORIGINAL', 'ADAPTATION']).default('ORIGINAL'),
  defaultChapterPrice: z.number().min(0).default(0),
});

export const UpdateBookSchema = CreateBookSchema.partial();

export const RejectBookSchema = z.object({
  reviewNotes: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(1000, 'Rejection reason too long'),
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;
export type RejectBookInput = z.infer<typeof RejectBookSchema>;

// Statuses where an author is allowed to edit book metadata
const EDITABLE_STATUSES: BookStatus[] = ['DRAFT', 'REJECTED'];

// ─── Helper: Format book for API response ──────────────────────────────────

function formatBook(book: any) {
  return {
    _id: book._id.toString(),
    title: book.title,
    slug: book.slug,
    synopsis: book.synopsis,
    coverUrl: book.coverUrl,
    status: book.status,
    reviewNotes: book.reviewNotes || null,
    submittedAt: book.submittedAt || null,
    reviewedAt: book.reviewedAt || null,
    publishedAt: book.publishedAt || null,
    genre: book.genre,
    categories: book.categories,
    tags: book.tags,
    language: book.language,
    contentRating: book.contentRating,
    targetAudience: book.targetAudience,
    novelType: book.novelType,
    defaultChapterPrice: book.defaultChapterPrice,
    chapterCount: book.chapterCount,
    freeChapterCount: book.freeChapterCount,
    totalViews: book.totalViews,
    ratingAvg: book.ratingAvg,
    ratingCount: book.ratingCount,
    isFeatured: book.isFeatured,
    authorProfile: book.authorProfile,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

// ─── Author Services ────────────────────────────────────────────────────────

/**
 * Create a new book. Always starts as DRAFT.
 * Requires user to have an AuthorProfile.
 */
export async function createBook(userId: string, input: CreateBookInput) {
  await connectToDatabase();
  const validatedData = CreateBookSchema.parse(input);

  // 1. Fetch user + their AuthorProfile
  const user = await User.findById(userId).select('authorProfile');
  if (!user) throw new Error('User not found');
  if (!user.authorProfile) throw new Error('Author profile required');

  const authorProfile = await AuthorProfile.findById(user.authorProfile).select('slug penName totalBooks');
  if (!authorProfile || authorProfile.status === 'SUSPENDED') {
    throw new Error('Author account is not active');
  }

  // 2. Generate slug: title + author slug, resolve collisions
  const baseSlug = generateBookSlug(validatedData.title, authorProfile.slug);
  const slug = await resolveSlugCollision(baseSlug, async (s) => !!(await Book.exists({ slug: s })));

  // 3. Create book document
  const book = await Book.create({
    title: validatedData.title,
    slug,
    synopsis: validatedData.synopsis,
    coverUrl: validatedData.coverUrl || '',
    authorProfile: authorProfile._id,
    author: userId,
    genre: new mongoose.Types.ObjectId(validatedData.genreId),
    categories: (validatedData.categories || []).map((id) => new mongoose.Types.ObjectId(id)),
    tags: validatedData.tags || [],
    language: validatedData.language,
    contentRating: validatedData.contentRating,
    targetAudience: validatedData.targetAudience,
    novelType: validatedData.novelType,
    defaultChapterPrice: validatedData.defaultChapterPrice,
    status: 'DRAFT',
    isDeleted: false,
  });

  // 4. Increment author's totalBooks counter
  await AuthorProfile.findByIdAndUpdate(authorProfile._id, { $inc: { totalBooks: 1 } });

  return { book: formatBook(book) };
}

/**
 * Get all non-deleted books for the authenticated author.
 */
export async function getMyBooks(userId: string) {
  await connectToDatabase();
  const books = await Book.find({ author: userId, isDeleted: false })
    .populate('genre', 'name slug')
    .sort({ updatedAt: -1 })
    .lean();
  return { books: books.map(formatBook) };
}

/**
 * Get a single book by ID. Verifies author ownership.
 */
export async function getMyBook(userId: string, bookId: string) {
  await connectToDatabase();
  const book = await Book.findOne({ _id: bookId, author: userId, isDeleted: false })
    .populate('genre', 'name slug')
    .populate('categories', 'name slug')
    .populate('authorProfile', 'penName slug');
  if (!book) throw new Error('Book not found');
  return { book: formatBook(book) };
}

/**
 * Update book metadata. Only allowed when status is DRAFT or REJECTED.
 */
export async function updateBook(userId: string, bookId: string, input: UpdateBookInput) {
  await connectToDatabase();
  const validatedData = UpdateBookSchema.parse(input);

  const book = await Book.findOne({ _id: bookId, author: userId, isDeleted: false });
  if (!book) throw new Error('Book not found');
  if (!EDITABLE_STATUSES.includes(book.status)) {
    throw new Error(`Cannot edit book while status is ${book.status}. Only DRAFT or REJECTED books can be edited.`);
  }

  // Capture what changed to create a BookVersion log
  const changes: { field: string; oldValue?: any; newValue?: any }[] = [];
  const fieldsToCheck = [
    { name: 'title', val: validatedData.title },
    { name: 'synopsis', val: validatedData.synopsis },
    { name: 'coverUrl', val: validatedData.coverUrl },
    { name: 'genreId', val: validatedData.genreId, dbName: 'genre' },
    { name: 'categories', val: validatedData.categories },
    { name: 'tags', val: validatedData.tags },
    { name: 'language', val: validatedData.language },
    { name: 'contentRating', val: validatedData.contentRating },
    { name: 'targetAudience', val: validatedData.targetAudience },
    { name: 'novelType', val: validatedData.novelType },
    { name: 'defaultChapterPrice', val: validatedData.defaultChapterPrice },
  ];

  for (const f of fieldsToCheck) {
    if (f.val !== undefined) {
      const dbKey = f.dbName || f.name;
      const oldVal = (book as any)[dbKey];
      let isDifferent = false;
      if (Array.isArray(oldVal) && Array.isArray(f.val)) {
        isDifferent = JSON.stringify(oldVal.map(x => x.toString())) !== JSON.stringify(f.val.map(x => x.toString()));
      } else if (oldVal instanceof mongoose.Types.ObjectId) {
        isDifferent = oldVal.toString() !== f.val.toString();
      } else {
        isDifferent = oldVal !== f.val;
      }
      
      if (isDifferent) {
        changes.push({
          field: f.name,
          oldValue: oldVal,
          newValue: f.val,
        });
      }
    }
  }

  // Build update payload — only include provided fields
  const update: Record<string, any> = {};
  if (validatedData.title !== undefined) update.title = validatedData.title;
  if (validatedData.synopsis !== undefined) update.synopsis = validatedData.synopsis;
  if (validatedData.coverUrl !== undefined) update.coverUrl = validatedData.coverUrl;
  if (validatedData.genreId !== undefined) update.genre = new mongoose.Types.ObjectId(validatedData.genreId);
  if (validatedData.categories !== undefined) {
    update.categories = validatedData.categories.map((id) => new mongoose.Types.ObjectId(id));
  }
  if (validatedData.tags !== undefined) update.tags = validatedData.tags;
  if (validatedData.language !== undefined) update.language = validatedData.language;
  if (validatedData.contentRating !== undefined) update.contentRating = validatedData.contentRating;
  if (validatedData.targetAudience !== undefined) update.targetAudience = validatedData.targetAudience;
  if (validatedData.novelType !== undefined) update.novelType = validatedData.novelType;
  if (validatedData.defaultChapterPrice !== undefined) update.defaultChapterPrice = validatedData.defaultChapterPrice;

  const updated = await Book.findByIdAndUpdate(bookId, { $set: update }, { new: true })
    .populate('genre', 'name slug');

  // Create BookVersion if there are modifications
  if (changes.length > 0) {
    await BookVersion.create({
      book: book._id,
      editedBy: new mongoose.Types.ObjectId(userId),
      changes,
    });
  }

  return { book: formatBook(updated) };
}

/**
 * Soft-delete a book. Sets isDeleted=true and status=ARCHIVED.
 * Never hard-deletes — reading progress and transactions must stay intact.
 */
export async function softDeleteBook(userId: string, bookId: string) {
  await connectToDatabase();
  const book = await Book.findOne({ _id: bookId, author: userId, isDeleted: false });
  if (!book) throw new Error('Book not found');

  await Book.findByIdAndUpdate(bookId, { isDeleted: true, status: 'ARCHIVED' });

  // Decrement author totalBooks counter
  await AuthorProfile.findOneAndUpdate(
    { userId },
    { $inc: { totalBooks: -1 } }
  );

  return { message: 'Book archived successfully' };
}

/**
 * Author submits book for moderation review.
 * Transitions: DRAFT → READY_FOR_REVIEW  or  REJECTED → READY_FOR_REVIEW
 */
export async function submitForReview(userId: string, bookId: string) {
  await connectToDatabase();
  const book = await Book.findOne({ _id: bookId, author: userId, isDeleted: false });
  if (!book) throw new Error('Book not found');

  if (!EDITABLE_STATUSES.includes(book.status)) {
    throw new Error(`Cannot submit book for review from status: ${book.status}`);
  }

  // Validate minimum required fields before submission
  const missing: string[] = [];
  if (!book.title?.trim()) missing.push('title');
  if (!book.synopsis?.trim()) missing.push('synopsis');
  if (!book.coverUrl?.trim()) missing.push('coverUrl');
  if (!book.genre) missing.push('genre');
  if (missing.length > 0) {
    throw new Error(`Cannot submit: missing required fields — ${missing.join(', ')}`);
  }

  const updated = await Book.findByIdAndUpdate(
    bookId,
    {
      status: 'READY_FOR_REVIEW',
      submittedAt: new Date(),
      $unset: { reviewNotes: '' },  // clear previous rejection notes on resubmission
    },
    { new: true }
  );

  // Trigger status change event hook
  await BookEvents.emitBookSubmitted(bookId, userId);

  return {
    message: 'Book submitted for review',
    book: { status: updated!.status, submittedAt: updated!.submittedAt },
  };
}

// ─── Admin Services ─────────────────────────────────────────────────────────

/**
 * Get books in the moderation queue (READY_FOR_REVIEW + UNDER_REVIEW).
 * Admins can filter by status via query param.
 */
export async function adminGetPendingBooks(statusFilter?: string) {
  await connectToDatabase();

  const allowedStatuses: BookStatus[] = ['READY_FOR_REVIEW', 'UNDER_REVIEW'];
  const query: Record<string, any> = {
    isDeleted: false,
    status: { $in: allowedStatuses },
  };

  // Allow filtering to a specific queue status
  if (statusFilter && allowedStatuses.includes(statusFilter as BookStatus)) {
    query.status = statusFilter;
  }

  const books = await Book.find(query)
    .populate('authorProfile', 'penName slug isVerified')
    .populate('genre', 'name')
    .sort({ submittedAt: 1 }) // oldest first — FIFO queue
    .lean();

  return { books: books.map(formatBook), total: books.length };
}

/**
 * Admin starts reviewing a book. READY_FOR_REVIEW → UNDER_REVIEW.
 * Manual pickup — admin explicitly clicks "Start Review".
 */
export async function adminPickupBook(adminId: string, bookId: string) {
  await connectToDatabase();
  const book = await Book.findOne({ _id: bookId, isDeleted: false });
  if (!book) throw new Error('Book not found');
  if (book.status !== 'READY_FOR_REVIEW') {
    throw new Error(`Cannot start review: book status is ${book.status}`);
  }

  const updated = await Book.findByIdAndUpdate(
    bookId,
    {
      status: 'UNDER_REVIEW',
      reviewStartedAt: new Date(),
    },
    { new: true }
  );

  // Trigger status change event hook
  await BookEvents.emitBookUnderReview(bookId, adminId);

  return { message: 'Book picked up for review', book: { status: updated!.status } };
}

/**
 * Admin approves a book. UNDER_REVIEW → APPROVED.
 * Author may now create chapters.
 */
export async function adminApproveBook(adminId: string, bookId: string) {
  await connectToDatabase();
  const book = await Book.findOne({ _id: bookId, isDeleted: false });
  if (!book) throw new Error('Book not found');
  if (book.status !== 'UNDER_REVIEW') {
    throw new Error(`Cannot approve: book status is ${book.status}. Must be UNDER_REVIEW.`);
  }

  const updated = await Book.findByIdAndUpdate(
    bookId,
    {
      status: 'APPROVED',
      approvedAt: new Date(),
      reviewedAt: new Date(),
      $unset: { reviewNotes: '' }
    },
    { new: true }
  );

  // Trigger status change event hook
  await BookEvents.emitBookApproved(bookId, adminId);

  return {
    message: 'Book approved. Author may now create chapters.',
    book: { status: updated!.status, reviewedAt: updated!.reviewedAt },
  };
}

/**
 * Admin rejects a book with mandatory review notes.
 * UNDER_REVIEW → REJECTED. reviewNotes is shown to the author.
 */
export async function adminRejectBook(adminId: string, bookId: string, input: RejectBookInput) {
  await connectToDatabase();
  const { reviewNotes } = RejectBookSchema.parse(input);

  const book = await Book.findOne({ _id: bookId, isDeleted: false });
  if (!book) throw new Error('Book not found');
  if (book.status !== 'UNDER_REVIEW') {
    throw new Error(`Cannot reject: book status is ${book.status}. Must be UNDER_REVIEW.`);
  }

  const updated = await Book.findByIdAndUpdate(
    bookId,
    {
      status: 'REJECTED',
      rejectedAt: new Date(),
      reviewedAt: new Date(),
      reviewNotes
    },
    { new: true }
  );

  // Trigger status change event hook
  await BookEvents.emitBookRejected(bookId, adminId, reviewNotes);

  return {
    message: 'Book rejected. Author will be notified.',
    book: { status: updated!.status, reviewNotes: updated!.reviewNotes },
  };
}

// ─── Public Services ─────────────────────────────────────────────────────────

/**
 * Browse published books for readers. Supports genre and tag filters.
 */
export async function getPublicBooks(filters: {
  genre?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}) {
  await connectToDatabase();
  const { genre, tags, search, page = 1, limit = 20 } = filters;

  const query: Record<string, any> = { status: 'PUBLISHED', isDeleted: false };
  if (genre) query.genre = new mongoose.Types.ObjectId(genre);
  if (tags && tags.length > 0) query.tags = { $in: tags };
  if (search) query.$text = { $search: search };

  const books = await Book.find(query)
    .populate('genre', 'name slug')
    .populate('authorProfile', 'penName slug avatarUrl isVerified')
    .select('-reviewNotes -submittedAt -reviewedAt')
    .sort({ totalViews: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Book.countDocuments(query);

  return { books: books.map(formatBook), total, page, limit };
}

/**
 * Get a single published book by slug for readers.
 */
export async function getPublicBook(slug: string) {
  await connectToDatabase();
  const book = await Book.findOne({ slug, status: 'PUBLISHED', isDeleted: false })
    .populate('genre', 'name slug')
    .populate('categories', 'name slug')
    .populate('authorProfile', 'penName slug avatarUrl isVerified followerCount');
  if (!book) throw new Error('Book not found');
  return { book: formatBook(book) };
}

// ─── Chapter Authorization Guard ─────────────────────────────────────────────

/**
 * Gate function called at the start of every chapter creation request.
 * A chapter cannot be created unless book.status === APPROVED or PUBLISHED.
 * This will be called from Chapter route handlers in Phase 5.
 */
export async function checkChapterAllowed(bookId: string, authorId: string): Promise<void> {
  await connectToDatabase();
  const book = await Book.findById(bookId).select('status isDeleted author');
  if (!book || book.isDeleted) throw new Error('Book not found');

  // Verify ownership before checking status
  if (book.author.toString() !== authorId) {
    throw new Error('You do not own this book');
  }

  if (book.status !== 'APPROVED' && book.status !== 'PUBLISHED') {
    throw new Error(
      `Chapters cannot be created until the book is approved by an admin. Current status: ${book.status}`
    );
  }
}
