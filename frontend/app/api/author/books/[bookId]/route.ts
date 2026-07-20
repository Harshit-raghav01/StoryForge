import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAuthPayload } from '@/lib/authHelpers';
import { getMyBook, updateBook, softDeleteBook } from '@/services/bookService';

// GET /api/author/books/[bookId] — get a single book by ID (owner only)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    const { bookId } = await params;
    const result = await getMyBook(auth.sub, bookId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error('GET /api/author/books/[bookId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/author/books/[bookId] — update book metadata (DRAFT or REJECTED only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { bookId } = await params;
    const result = await updateBook(auth.sub, bookId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error.message?.startsWith('Cannot edit book while status is')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('PATCH /api/author/books/[bookId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/author/books/[bookId] — soft-delete a book (sets isDeleted=true)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    const { bookId } = await params;
    const result = await softDeleteBook(auth.sub, bookId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error('DELETE /api/author/books/[bookId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
