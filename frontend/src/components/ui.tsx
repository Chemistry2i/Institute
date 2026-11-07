import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' | 'soft' | 'danger'; size?: 'sm' | 'md' }) {
  return <button className={cn('ui-button', `ui-button-${variant}`, `ui-button-${size}`, className)} {...props} />
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-card', className)} {...props} />
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; className?: string }) {
  return <span className={cn('ui-badge', `ui-badge-${tone}`, className)}>{children}</span>
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
