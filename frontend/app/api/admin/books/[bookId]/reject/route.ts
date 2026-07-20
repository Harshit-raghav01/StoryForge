import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAuthPayload } from '@/lib/authHelpers';
import { adminRejectBook } from '@/services/bookService';

// POST /api/admin/books/[bookId]/reject — admin rejects a book with mandatory notes
// Transitions: UNDER_REVIEW → REJECTED
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { bookId } = await params;
    const result = await adminRejectBook(auth.sub, bookId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.startsWith('Cannot reject')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('POST /api/admin/books/[bookId]/reject error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
