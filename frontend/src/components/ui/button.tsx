import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonStyles = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button-default',
      secondary: 'ui-button-secondary',
      outline: 'ui-button-outline',
      ghost: 'ui-button-ghost',
      destructive: 'ui-button-destructive',
    },
    size: {
      default: 'ui-button-md',
      sm: 'ui-button-sm',
      icon: 'ui-button-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>

export function Button({ className, size, variant, ...props }: ButtonProps) {
  const classes = [buttonStyles({ size, variant }), className].filter(Boolean).join(' ')
  return <button className={classes} {...props} />
}