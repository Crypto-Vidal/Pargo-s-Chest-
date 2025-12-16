'use client'

import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void
  variant?: 'default' | 'primary'
}

export default function Tag({
  children,
  onRemove,
  className,
  variant = 'primary',
  ...props
}: TagProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1.5',
        'h-7 px-3 rounded-full',
        'text-xs font-medium',
        'border transition-colors duration-150',
        {
          'bg-primary-500/20 border-primary-500/40 text-primary-300 hover:bg-primary-500/30 hover:border-primary-500/60':
            variant === 'primary',
          'bg-white/5 border-white/10 text-white/70 hover:bg-white/10':
            variant === 'default',
        },
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Remove tag"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
