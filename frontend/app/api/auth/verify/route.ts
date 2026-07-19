import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    await connectDB();
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
