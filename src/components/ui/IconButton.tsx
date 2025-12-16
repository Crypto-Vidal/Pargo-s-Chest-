'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary'
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg',
          'transition-all duration-150 ease-out focus-ring',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'w-8 h-8 text-sm': size === 'sm',
            'w-10 h-10 text-base': size === 'md',
            'w-12 h-12 text-lg': size === 'lg',
            'bg-transparent text-white/70 hover:bg-white/5 hover:text-white':
              variant === 'default',
            'bg-primary-500 text-white hover:bg-primary-600':
              variant === 'primary',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
