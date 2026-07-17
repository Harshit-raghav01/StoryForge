'use client';

import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-pop',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-alt',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-alt',
  accent: 'bg-accent text-white hover:opacity-90',
  danger: 'bg-danger text-white hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  icon,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `
    inline-flex items-center justify-center gap-2
    rounded-pill font-body font-medium
    transition-all duration-200 ease-out
    cursor-pointer select-none
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}{children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon}{children}
    </button>
  );
}

/** Badge — small pill for genre, content rating, status, language */
export function Badge({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'support' | 'success' | 'accent' | 'danger';
  className?: string;
}) {
  const variantMap = {
    default: 'bg-surface-alt text-text-secondary border border-border',
    support: 'bg-support/15 text-support',
    success: 'bg-success/15 text-success',
    accent: 'bg-accent/15 text-accent',
    danger: 'bg-danger/15 text-danger',
  };

  return (
    <span className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium font-body ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}
