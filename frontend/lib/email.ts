import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Verify your StoryForge account',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0f0e13;color:#e9e4d4;border-radius:12px">
        <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Welcome to StoryForge 📖</h1>
        <p style="color:#a09880;margin-bottom:24px">Please verify your email address to activate your account.</p>
        <a href="${url}" style="display:inline-block;background:#7c5cbf;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
        <p style="margin-top:24px;font-size:12px;color:#6b6454">This link expires in 24 hours. If you did not create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your StoryForge password',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0f0e13;color:#e9e4d4;border-radius:12px">
        <h1 style="font-size:22px;font-weight:700;margin-bottom:8px">Password Reset Request</h1>
        <p style="color:#a09880;margin-bottom:24px">Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;background:#7c5cbf;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
        <p style="margin-top:24px;font-size:12px;color:#6b6454">If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  });
}
