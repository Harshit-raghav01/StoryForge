import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/authHelpers';
import { adminApproveBook } from '@/services/bookService';

// POST /api/admin/books/[bookId]/approve — admin approves a book under review
// Transitions: UNDER_REVIEW → APPROVED
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });

    const { bookId } = await params;
    const result = await adminApproveBook(auth.sub, bookId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.startsWith('Cannot approve')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('POST /api/admin/books/[bookId]/approve error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
