import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/jwt';

// GET /api/auth/me — returns current user from access token cookie
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    await connectDB();
    // Populate the author profile document reference
    const user = await User.findById(decoded.sub)
      .populate('authorProfile')
      .select('-passwordHash -verificationToken -resetPasswordToken');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const authorProfileData = user.authorProfile
      ? {
          penName: (user.authorProfile as any).penName,
          bio: (user.authorProfile as any).bio,
          verified: (user.authorProfile as any).isVerified || false,
          followers: (user.authorProfile as any).followerCount || 0,
          earnings: (user.authorProfile as any).totalEarnings || (user.authorProfile as any).earnings || 0,
        }
      : null;

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl || '',
        role: user.role.toLowerCase(),
        coinBalance: user.coinBalance,
        authorProfile: authorProfileData,
      },
    });
  } catch (error) {
    console.error('Auth/me error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
