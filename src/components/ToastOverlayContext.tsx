import type * as Adw from '@gtkx/gi/adw'
import { createContext, type ReactNode, type RefObject, useContext } from 'react'

const ToastOverlayContext = createContext<RefObject<Adw.ToastOverlay | null> | null>(null)

/**
 * Shares the toast overlay reference with descendants that need `Adw.ToastOverlay.addToast()`
 * directly, which `useToast` does not expose. Re-adding a displayed toast
 * resets its timeout.
 */
export const ToastOverlayRefProvider = ({
  overlayRef,
  children
}: {
  overlayRef: RefObject<Adw.ToastOverlay | null>
  children: ReactNode
}) => <ToastOverlayContext.Provider value={overlayRef}>{children}</ToastOverlayContext.Provider>

export const useToastOverlayRef = () => {
  const overlayRef = useContext(ToastOverlayContext)

  if (overlayRef === null) {
    throw new Error('useToastOverlayRef must be used within a ToastOverlayRefProvider')
  }

  return overlayRef
}
