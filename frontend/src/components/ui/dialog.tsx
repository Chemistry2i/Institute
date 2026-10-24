import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({
  className = '',
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="ui-dialog-overlay" />
      <DialogPrimitive.Content className={`ui-dialog-content ${className}`} {...props}>
        {children}
        <DialogPrimitive.Close className="ui-dialog-close" aria-label="Close dialog">
          <X size={17} aria-hidden="true" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function DialogHeader({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`ui-dialog-header ${className}`} {...props} />
}

export function DialogTitle({ className = '', ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={`ui-dialog-title ${className}`} {...props} />
}

export function DialogDescription({ className = '', ...props }: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={`ui-dialog-description ${className}`} {...props} />
}

export function DialogFooter({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`ui-dialog-footer ${className}`} {...props} />
}
