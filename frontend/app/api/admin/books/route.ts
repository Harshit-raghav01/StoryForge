import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '@/lib/authHelpers';
import { adminGetPendingBooks } from '@/services/bookService';

// GET /api/admin/books — fetch the moderation queue
// Supports ?status=READY_FOR_REVIEW or ?status=UNDER_REVIEW
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthPayload(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    if (auth.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });

    const statusFilter = req.nextUrl.searchParams.get('status') || undefined;
    const result = await adminGetPendingBooks(statusFilter);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/admin/books error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
