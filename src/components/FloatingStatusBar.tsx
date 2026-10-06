import * as GLib from '@gtkx/gi/glib'
import * as Gtk from '@gtkx/gi/gtk'
import * as Pango from '@gtkx/gi/pango'
import { AdwSpinner } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkEventControllerMotion, GtkLabel, GtkOverlay } from '@gtkx/jsx/gtk'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const HOVER_HIDE_INTERVAL_MS = 100

type Bounds = { x: number; y: number; width: number; height: number }

export type FloatingStatusBarProps = {
  children?: ReactNode
  primary?: string | null
  details?: string | null
  showSpinner?: boolean
  showStop?: boolean
  hideOnHover?: boolean
  onStop?: () => void
}

export const FloatingStatusBar = ({
  children,
  primary = null,
  details = null,
  showSpinner = false,
  showStop = false,
  hideOnHover = true,
  onStop
}: FloatingStatusBarProps) => {
  const overlayRef = useRef<Gtk.Overlay | null>(null)
  const barRef = useRef<Gtk.Box | null>(null)
  const hoverTimeoutRef = useRef(0)
  const boundsRef = useRef<Bounds | null>(null)
  const pointerRef = useRef({ x: -1, y: -1 })
  const [hovered, setHovered] = useState(false)

  const stopHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current !== 0) {
      GLib.Source.remove(hoverTimeoutRef.current)
      hoverTimeoutRef.current = 0
    }
  }, [])

  const pointerIsOverBar = () => {
    const bounds = boundsRef.current
    if (bounds === null) {
      return false
    }

    const { x, y, width, height } = bounds
    const { x: pointerX, y: pointerY } = pointerRef.current
    return pointerX >= x && pointerX <= x + width && pointerY >= y && pointerY <= y + height
  }

  const onMotion = (x: number, y: number) => {
    pointerRef.current = { x, y }

    if (!hideOnHover || showStop) {
      return
    }

    const bar = barRef.current
    const overlay = overlayRef.current
    if (bar === null || overlay === null || !bar.visible) {
      return
    }

    const [computed, rect] = bar.computeBounds(overlay)
    if (!computed) {
      return
    }

    boundsRef.current = { x: rect.getX(), y: rect.getY(), width: rect.getWidth(), height: rect.getHeight() }

    if (!pointerIsOverBar() || hoverTimeoutRef.current !== 0) {
      return
    }

    hoverTimeoutRef.current = GLib.timeoutAdd(GLib.PRIORITY_DEFAULT, HOVER_HIDE_INTERVAL_MS, () => {
      const overBar = pointerIsOverBar()
      setHovered(overBar)

      if (overBar) {
        return GLib.SOURCE_CONTINUE
      }

      hoverTimeoutRef.current = 0
      return GLib.SOURCE_REMOVE
    })
  }

  const onLeave = () => {
    pointerRef.current = { x: -1, y: -1 }
  }

  useEffect(() => stopHoverTimeout, [stopHoverTimeout])

  useEffect(() => {
    if (hovered && (!hideOnHover || showStop)) {
      stopHoverTimeout()
      setHovered(false)
    }
  }, [hovered, hideOnHover, showStop, stopHoverTimeout])

  const hasStatus = Boolean(primary) || Boolean(details) || showSpinner

  return (
    <GtkOverlay
      ref={overlayRef}
      controllers={
        <GtkEventControllerMotion
          propagationPhase={Gtk.PropagationPhase.CAPTURE}
          onMotion={onMotion}
          onLeave={onLeave}
        />
      }
      overlays={
        <GtkBox
          ref={barRef}
          cssClasses={['floating-bar']}
          spacing={8}
          halign={Gtk.Align.END}
          valign={Gtk.Align.END}
          marginTop={4}
          marginBottom={4}
          marginStart={4}
          marginEnd={4}
          visible={hasStatus && !hovered}
        >
          {showSpinner && <AdwSpinner widthRequest={16} heightRequest={16} marginStart={8} valign={Gtk.Align.CENTER} />}
          <GtkBox spacing={6} marginTop={2} marginBottom={2} marginStart={8} marginEnd={8}>
            <GtkLabel
              label={primary ?? ''}
              visible={Boolean(primary)}
              singleLineMode
              ellipsize={Pango.EllipsizeMode.MIDDLE}
            />
            <GtkLabel label={details ?? ''} visible={Boolean(details)} singleLineMode />
          </GtkBox>
          {showStop && (
            <GtkButton
              iconName="process-stop-symbolic"
              cssClasses={['circular', 'flat']}
              tooltipText="Stop"
              accessibleLabel="Stop"
              valign={Gtk.Align.CENTER}
              onClicked={onStop}
            />
          )}
        </GtkBox>
      }
    >
      {children}
    </GtkOverlay>
  )
}
