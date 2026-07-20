import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/authHelpers';
import { submitForReview } from '@/services/bookService';

// POST /api/author/books/[bookId]/submit — submit book for moderation review
// Transitions: DRAFT → READY_FOR_REVIEW  or  REJECTED → READY_FOR_REVIEW
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    const { bookId } = await params;
    const result = await submitForReview(auth.sub, bookId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (
      error.message?.startsWith('Cannot submit book for review from status') ||
      error.message?.startsWith('Cannot submit: missing required fields')
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('POST /api/author/books/[bookId]/submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
