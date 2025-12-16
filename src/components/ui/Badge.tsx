'use client'

import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

export default function Badge({
  children,
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'px-2 py-0.5 rounded-full',
        'text-xs font-semibold',
        {
          'bg-white/10 text-white': variant === 'default',
          'bg-primary-500 text-white': variant === 'primary',
          'bg-green-500 text-white': variant === 'success',
          'bg-amber-500 text-white': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
