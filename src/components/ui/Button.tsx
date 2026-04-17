import { useReducedMotion } from 'framer-motion'
import { useRipple } from '../../hooks/useRipple'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-400 hover:to-violet-400',
  secondary: 'border border-white/20 text-slate-200 hover:bg-white/8 hover:border-white/30',
  ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  ...props
}: ButtonProps) {
  const { ripples, createRipple } = useRipple()
  const shouldReduceMotion = useReducedMotion()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!shouldReduceMotion) createRipple(e)
    onClick?.(e)
  }

  return (
    <button
      className={`
        relative overflow-hidden rounded-lg font-medium
        transition-all duration-150 select-none
        focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {!shouldReduceMotion &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

      <span className="relative z-10">{children}</span>
    </button>
  )
}
