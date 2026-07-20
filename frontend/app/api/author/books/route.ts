import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getAuthPayload } from '@/lib/authHelpers';
import { createBook, getMyBooks } from '@/services/bookService';

// GET /api/author/books — list all books for the authenticated author
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    const result = await getMyBooks(auth.sub);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/author/books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/author/books — create a new book (always starts as DRAFT)
export async function POST(req: NextRequest) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });

    let body;
    try { body = await req.json(); } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const result = await createBook(auth.sub, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    if (error.message === 'Author profile required') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message === 'Author account is not active') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('POST /api/author/books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
