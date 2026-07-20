import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/authHelpers';
import { adminPickupBook } from '@/services/bookService';

// POST /api/admin/books/[bookId]/pickup — admin manually picks up a book for review
// Transitions: READY_FOR_REVIEW → UNDER_REVIEW
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });

    const { bookId } = await params;
    const result = await adminPickupBook(auth.sub, bookId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.startsWith('Cannot start review')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('POST /api/admin/books/[bookId]/pickup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
