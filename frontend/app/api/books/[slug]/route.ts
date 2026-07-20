import { NextRequest, NextResponse } from 'next/server';
import { getPublicBook } from '@/services/bookService';

// GET /api/books/[slug] — get a single published book by slug for readers
// No authentication required — public endpoint
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await getPublicBook(slug);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    console.error('GET /api/books/[slug] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
