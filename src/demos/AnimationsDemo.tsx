import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import * as Pango from '@gtkx/gi/pango'
import {
  AdwClamp,
  AdwComboRow,
  AdwInlineViewSwitcher,
  AdwPreferencesGroup,
  AdwSpinRow,
  AdwSwitchRow,
  AdwViewStack,
  AdwViewStackPage
} from '@gtkx/jsx/adw'
import { GtkAdjustment, GtkBox, GtkButton, GtkFixed, GtkLabel, GtkScrolledWindow } from '@gtkx/jsx/gtk'
import { useCallback, useEffect, useState } from 'react'

import '@/styles.js'

// The easings are listed in the same order as the AdwEasing enum values.
const easings: Adw.Easing[] = [
  Adw.Easing.LINEAR,
  Adw.Easing.EASE_IN_QUAD,
  Adw.Easing.EASE_OUT_QUAD,
  Adw.Easing.EASE_IN_OUT_QUAD,
  Adw.Easing.EASE_IN_CUBIC,
  Adw.Easing.EASE_OUT_CUBIC,
  Adw.Easing.EASE_IN_OUT_CUBIC,
  Adw.Easing.EASE_IN_QUART,
  Adw.Easing.EASE_OUT_QUART,
  Adw.Easing.EASE_IN_OUT_QUART,
  Adw.Easing.EASE_IN_QUINT,
  Adw.Easing.EASE_OUT_QUINT,
  Adw.Easing.EASE_IN_OUT_QUINT,
  Adw.Easing.EASE_IN_SINE,
  Adw.Easing.EASE_OUT_SINE,
  Adw.Easing.EASE_IN_OUT_SINE,
  Adw.Easing.EASE_IN_EXPO,
  Adw.Easing.EASE_OUT_EXPO,
  Adw.Easing.EASE_IN_OUT_EXPO,
  Adw.Easing.EASE_IN_CIRC,
  Adw.Easing.EASE_OUT_CIRC,
  Adw.Easing.EASE_IN_OUT_CIRC,
  Adw.Easing.EASE_IN_ELASTIC,
  Adw.Easing.EASE_OUT_ELASTIC,
  Adw.Easing.EASE_IN_OUT_ELASTIC,
  Adw.Easing.EASE_IN_BACK,
  Adw.Easing.EASE_OUT_BACK,
  Adw.Easing.EASE_IN_OUT_BACK,
  Adw.Easing.EASE_IN_BOUNCE,
  Adw.Easing.EASE_OUT_BOUNCE,
  Adw.Easing.EASE_IN_OUT_BOUNCE,
  Adw.Easing.EASE,
  Adw.Easing.EASE_IN,
  Adw.Easing.EASE_OUT
]

const easingNames = [
  'Linear',
  'Ease-in (Quadratic)',
  'Ease-out (Quadratic)',
  'Ease-in-out (Quadratic)',
  'Ease-in (Cubic)',
  'Ease-out (Cubic)',
  'Ease-in-out (Cubic)',
  'Ease-in (Quartic)',
  'Ease-out (Quartic)',
  'Ease-in-out (Quartic)',
  'Ease-in (Quintic)',
  'Ease-out (Quintic)',
  'Ease-in-out (Quintic)',
  'Ease-in (Sine)',
  'Ease-out (Sine)',
  'Ease-in-out (Sine)',
  'Ease-in (Exponential)',
  'Ease-out (Exponential)',
  'Ease-in-out (Exponential)',
  'Ease-in (Circular)',
  'Ease-out (Circular)',
  'Ease-in-out (Circular)',
  'Ease-in (Elastic)',
  'Ease-out (Elastic)',
  'Ease-in-out (Elastic)',
  'Ease-in (Back)',
  'Ease-out (Back)',
  'Ease-in-out (Back)',
  'Ease-in (Bounce)',
  'Ease-out (Bounce)',
  'Ease-in-out (Bounce)',
  'Ease',
  'Ease-in',
  'Ease-out'
]

type Animations = {
  timed: Adw.TimedAnimation
  spring: Adw.SpringAnimation
}

type AnimationStates = {
  timed: Adw.AnimationState
  spring: Adw.AnimationState
}

const initialStates: AnimationStates = {
  timed: Adw.AnimationState.IDLE,
  spring: Adw.AnimationState.IDLE
}

export const AnimationsDemo = () => {
  const [preferencesPage, setPreferencesPage] = useState('Timed')
  const [stack, setStack] = useState<Adw.ViewStack | null>(null)

  const [easing, setEasing] = useState(Adw.Easing.EASE_IN_OUT_CUBIC)
  const [duration, setDuration] = useState(500)
  const [repeatCount, setRepeatCount] = useState(1)
  const [reverse, setReverse] = useState(false)
  const [alternate, setAlternate] = useState(false)

  const [velocity, setVelocity] = useState(0)
  const [damping, setDamping] = useState(10)
  const [mass, setMass] = useState(1)
  const [stiffness, setStiffness] = useState(100)
  const [epsilon, setEpsilon] = useState(0.001)
  const [clampSpring, setClampSpring] = useState(false)

  const [animations, setAnimations] = useState<Animations | null>(null)
  const [states, setStates] = useState<AnimationStates>(initialStates)

  const [easingModel] = useState(() => Gtk.StringList.new(easingNames))

  // The animations are created as the sample mounts, since both of them need the sample as their widget.
  const createAnimations = useCallback((sample: Gtk.Box | null) => {
    if (sample === null) {
      return
    }

    // The sample is offset with a pair of opposing margins, so that its position doesn't change the
    // size request of the page.
    const target = Adw.CallbackAnimationTarget.new(value => {
      const parent = sample.getParent()

      if (parent === null) {
        return
      }

      const available = parent.getWidth()
      const [, natural] = sample.measure(Gtk.Orientation.HORIZONTAL, -1)
      const offset = Math.round((available - natural) * value)

      sample.setMarginStart(offset)
      sample.setMarginEnd(-offset)
    })

    const timed = Adw.TimedAnimation.new(sample, 0, 1, 500, target) as Adw.TimedAnimation
    const spring = Adw.SpringAnimation.new(
      sample,
      0,
      1,
      Adw.SpringParams.newFull(10, 1, 100),
      target
    ) as Adw.SpringAnimation

    timed.setEasing(Adw.Easing.EASE_IN_OUT_CUBIC)
    timed.setFollowEnableAnimationsSetting(false)
    spring.setFollowEnableAnimationsSetting(false)

    const updateStates = () =>
      setStates({
        timed: timed.getState(),
        spring: spring.getState()
      })

    timed.connect('notify::state', updateStates)
    spring.connect('notify::state', updateStates)

    setAnimations({ timed, spring })
  }, [])

  const attachStack = useCallback((node: Adw.ViewStack | null) => {
    if (node !== null) {
      setStack(node)
    }
  }, [])

  const currentAnimation = useCallback(() => {
    if (animations === null) {
      return null
    }

    return preferencesPage === 'Timed' ? animations.timed : animations.spring
  }, [animations, preferencesPage])

  const playPause = () => {
    const animation = currentAnimation()

    if (animation === null) {
      return
    }

    switch (animation.getState()) {
      case Adw.AnimationState.IDLE:
      case Adw.AnimationState.FINISHED:
        animation.play()
        break
      case Adw.AnimationState.PAUSED:
        animation.resume()
        break
      case Adw.AnimationState.PLAYING:
        animation.pause()
        break
      default:
        break
    }
  }

  const reset = () => {
    animations?.timed.reset()
    animations?.spring.reset()
  }

  const skip = () => {
    animations?.timed.skip()
    animations?.spring.skip()
  }

  useEffect(() => {
    if (animations === null) {
      return
    }

    animations.timed.setDuration(duration)
    animations.timed.setRepeatCount(repeatCount)
    animations.timed.setReverse(reverse)
    animations.timed.setAlternate(alternate)
    animations.timed.setEasing(easing)
  }, [animations, alternate, duration, easing, repeatCount, reverse])

  useEffect(() => {
    if (animations === null) {
      return
    }

    animations.spring.setInitialVelocity(velocity)
    animations.spring.setEpsilon(epsilon)
    animations.spring.setClamp(clampSpring)
    animations.spring.setSpringParams(Adw.SpringParams.newFull(damping, mass, stiffness))
  }, [animations, clampSpring, damping, epsilon, mass, stiffness, velocity])

  const playing = states.timed === Adw.AnimationState.PLAYING || states.spring === Adw.AnimationState.PLAYING
  const canReset = states.timed !== Adw.AnimationState.IDLE || states.spring !== Adw.AnimationState.IDLE
  const canSkip = states.timed !== Adw.AnimationState.FINISHED && states.spring !== Adw.AnimationState.FINISHED

  return (
    <GtkScrolledWindow vexpand hscrollbarPolicy={Gtk.PolicyType.NEVER} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}>
      <GtkBox orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
        <AdwClamp>
          <GtkFixed heightRequest={80} marginTop={40} marginBottom={36}>
            <GtkBox ref={createAnimations} cssClasses={['animation-sample']} />
          </GtkFixed>
        </AdwClamp>

        <GtkLabel
          label="Animations"
          cssClasses={['title-1']}
          justify={Gtk.Justification.CENTER}
          wrap
          wrapMode={Pango.WrapMode.WORD}
        />
        <GtkLabel label="Simple transitions" cssClasses={['body']} justify={Gtk.Justification.CENTER} useMarkup wrap />

        <GtkBox spacing={18} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} marginTop={30} marginBottom={30}>
          <GtkButton
            iconName="media-skip-backward-symbolic"
            cssClasses={['circular', 'flat']}
            sensitive={canReset}
            valign={Gtk.Align.CENTER}
            onClicked={reset}
          />
          <GtkButton
            iconName={playing ? 'media-playback-pause-symbolic' : 'media-playback-start-symbolic'}
            cssClasses={['circular', 'suggested-action']}
            widthRequest={48}
            heightRequest={48}
            onClicked={playPause}
          />
          <GtkButton
            iconName="media-skip-forward-symbolic"
            cssClasses={['circular', 'flat']}
            sensitive={canSkip}
            valign={Gtk.Align.CENTER}
            onClicked={skip}
          />
        </GtkBox>

        <AdwPreferencesGroup>
          {stack !== null && (
            <AdwInlineViewSwitcher
              stack={stack}
              homogeneous
              halign={Gtk.Align.CENTER}
              widthRequest={250}
              cssClasses={['navigation-sidebar']}
            />
          )}
        </AdwPreferencesGroup>

        <AdwClamp>
          <AdwViewStack
            ref={attachStack}
            visibleChildName={preferencesPage}
            onNotifyVisibleChildName={name => setPreferencesPage(name ?? 'Timed')}
          >
            <AdwViewStackPage name="Timed" title="Timed">
              <AdwPreferencesGroup valign={Gtk.Align.START}>
                <AdwComboRow
                  title="Easing"
                  model={easingModel}
                  selected={easings.indexOf(easing)}
                  onNotifySelected={index => setEasing(easings[index ?? 0])}
                />
                <AdwSpinRow
                  title="Duration"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={100}
                      upper={4000}
                      value={duration}
                      pageIncrement={100}
                      stepIncrement={50}
                      onNotifyValue={value => setDuration(value ?? 500)}
                    />
                  }
                />
                <AdwSpinRow
                  title="Repeat Count"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={0}
                      upper={10}
                      value={repeatCount}
                      stepIncrement={1}
                      pageIncrement={1}
                      onNotifyValue={value => setRepeatCount(value ?? 1)}
                    />
                  }
                />
                <AdwSwitchRow title="Reverse" active={reverse} onNotifyActive={value => setReverse(value ?? false)} />
                <AdwSwitchRow
                  title="Alternate"
                  active={alternate}
                  onNotifyActive={value => setAlternate(value ?? false)}
                />
              </AdwPreferencesGroup>
            </AdwViewStackPage>

            <AdwViewStackPage name="Spring" title="Spring">
              <AdwPreferencesGroup valign={Gtk.Align.START}>
                <AdwSpinRow
                  title="Initial Velocity"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={-1000}
                      upper={1000}
                      value={velocity}
                      stepIncrement={10}
                      pageIncrement={100}
                      onNotifyValue={value => setVelocity(value ?? 0)}
                    />
                  }
                />
                <AdwSpinRow
                  title="Damping"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={0}
                      upper={1000}
                      value={damping}
                      stepIncrement={1}
                      pageIncrement={10}
                      onNotifyValue={value => setDamping(value ?? 0)}
                    />
                  }
                />
                <AdwSpinRow
                  title="Mass"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={0}
                      upper={100}
                      value={mass}
                      stepIncrement={1}
                      pageIncrement={10}
                      onNotifyValue={value => setMass(value ?? 0)}
                    />
                  }
                />
                <AdwSpinRow
                  title="Stiffness"
                  digits={0}
                  adjustment={
                    <GtkAdjustment
                      lower={0}
                      upper={1000}
                      value={stiffness}
                      stepIncrement={1}
                      pageIncrement={10}
                      onNotifyValue={value => setStiffness(value ?? 0)}
                    />
                  }
                />
                <AdwSpinRow
                  title="Epsilon"
                  digits={4}
                  adjustment={
                    <GtkAdjustment
                      lower={0.0001}
                      upper={0.01}
                      value={epsilon}
                      stepIncrement={0.001}
                      pageIncrement={0.001}
                      onNotifyValue={value => setEpsilon(value ?? 0.001)}
                    />
                  }
                />
                <AdwSwitchRow
                  title="Clamp"
                  active={clampSpring}
                  onNotifyActive={value => setClampSpring(value ?? false)}
                />
              </AdwPreferencesGroup>
            </AdwViewStackPage>
          </AdwViewStack>
        </AdwClamp>
      </GtkBox>
    </GtkScrolledWindow>
  )
}
