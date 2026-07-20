import { NextRequest, NextResponse } from 'next/server';
import { getPublicBooks } from '@/services/bookService';

// GET /api/books — browse published books for readers
// Query params: ?genre=<id>&tags=tag1,tag2&search=dragon&page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const genre = searchParams.get('genre') || undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()) : undefined;
    const search = searchParams.get('search') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const result = await getPublicBooks({ genre, tags, search, page, limit });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
