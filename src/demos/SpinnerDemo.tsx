import type * as Adw from '@gtkx/gi/adw'
import { AdwSpinnerPaintable, AdwStatusPage } from '@gtkx/jsx/adw'
import { useEffect, useRef } from 'react'

export const SpinnerDemo = () => {
  const statusPageRef = useRef<Adw.StatusPage | null>(null)
  const spinnerRef = useRef<Adw.SpinnerPaintable | null>(null)

  useEffect(() => {
    spinnerRef.current?.setWidget(statusPageRef.current)
  }, [])

  return (
    <AdwStatusPage
      ref={statusPageRef}
      paintable={<AdwSpinnerPaintable ref={spinnerRef} />}
      title="Spinner"
      description="A modern spinner widget"
    />
  )
}
