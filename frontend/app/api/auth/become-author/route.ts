import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import { onboardAuthor } from '@/services/authorService';
import { ZodError } from 'zod';

// POST /api/auth/become-author — Protected author onboarding route
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to become an author' }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session token' }, { status: 401 });
    }

    // 2. Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Bad Request: Invalid JSON body' }, { status: 400 });
    }

    // 3. Call service layer
    const result = await onboardAuthor(decoded.sub, body);

    // 4. Return success response
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    // 5. Handle Zod Validation Errors
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      return NextResponse.json({ error: issue.message }, { status: 400 });
    }

    // 6. Handle Known Business Rule Violations
    if (
      error.message === 'Pen name or its URL slug is already taken' ||
      error.message === 'Pen name is a reserved term' ||
      error.message === 'User already has an author profile' ||
      error.message === 'User not found'
    ) {
      // 409 Conflict is best suited for duplicate resource names
      const status = error.message.includes('already') ? 409 : 400;
      return NextResponse.json({ error: error.message }, { status });
    }

    // 7. Handle Fallback/Internal Errors
    console.error('Author onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
