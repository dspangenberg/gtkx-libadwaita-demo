import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwCarousel,
  AdwCarouselIndicatorDots,
  AdwCarouselIndicatorLines,
  AdwClamp,
  AdwComboRow,
  AdwEnumListModel,
  AdwPreferencesGroup,
  AdwStatusPage,
  AdwSwitchRow
} from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkStack, GtkStackPage, GtkStringList } from '@gtkx/jsx/gtk'
import { peekTypeClass, typeFromName } from '@gtkx/runtime'
import { useState } from 'react'

const indicatorNames = ['Dots', 'Lines']

const flip = (orientation: Gtk.Orientation) =>
  orientation === Gtk.Orientation.HORIZONTAL ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL

export const CarouselDemo = () => {
  const [carousel, setCarousel] = useState<Adw.Carousel | null>(null)
  const [orientation, setOrientation] = useState(Gtk.Orientation.HORIZONTAL)
  const [indicator, setIndicator] = useState(0)
  const [scrollWheel, setScrollWheel] = useState(true)
  const [longSwipes, setLongSwipes] = useState(false)

  // GObjects erst nach Gtk.init() erzeugen, aber über Renders hinweg stabil halten.
  const [orientationType] = useState(() => {
    // GtkOrientation's GType is registered lazily when a class using it is initialized.
    // Without the guard typeFromName returns G_TYPE_INVALID, which segfaults in
    // adw_enum_list_model_new().
    peekTypeClass(Gtk.Box)
    return typeFromName('GtkOrientation')
  })
  const [orientationLabel] = useState(() => Gtk.PropertyExpression.new(Adw.EnumListItem, null, 'nick'))

  const scrollToPage = (index: number) => {
    if (carousel === null || index < 0 || index >= 3) {
      return
    }

    carousel.scrollTo(carousel.getNthPage(index), true)
  }

  return (
    <GtkBox orientation={flip(orientation)} vexpand marginBottom={24}>
      <AdwCarousel
        ref={setCarousel}
        vexpand
        hexpand
        orientation={orientation}
        allowLongSwipes={longSwipes}
        revealDuration={300}
        allowScrollWheel={scrollWheel}
      >
        <AdwStatusPage
          iconName="widget-carousel-symbolic"
          title="Carousel"
          description="A widget for paginated scrolling"
          vexpand
          hexpand
        />
        <AdwClamp
          marginBottom={32}
          marginStart={12}
          marginEnd={12}
          maximumSize={400}
          tighteningThreshold={300}
          valign={Gtk.Align.CENTER}
        >
          <AdwPreferencesGroup>
            <AdwComboRow
              title="Orientation"
              model={<AdwEnumListModel enumType={orientationType} />}
              expression={orientationLabel}
              selected={orientation}
              onNotifySelected={value => setOrientation(value ?? Gtk.Orientation.HORIZONTAL)}
            />
            <AdwComboRow
              title="Page Indicators"
              model={<GtkStringList strings={indicatorNames} />}
              selected={indicator}
              onNotifySelected={value => setIndicator(value ?? 0)}
            />
            <AdwSwitchRow
              title="Scroll Wheel"
              active={scrollWheel}
              onNotifyActive={active => setScrollWheel(active ?? false)}
            />
            <AdwSwitchRow
              title="Long Swipes"
              active={longSwipes}
              onNotifyActive={active => setLongSwipes(active ?? false)}
            />
          </AdwPreferencesGroup>
        </AdwClamp>

        <AdwStatusPage title="Another Page" vexpand hexpand>
          <GtkButton
            label="Return to the first page"
            cssClasses={['suggested-action', 'pill']}
            halign={Gtk.Align.CENTER}
            canShrink
            onClicked={() => scrollToPage(0)}
          />
        </AdwStatusPage>
      </AdwCarousel>

      <GtkStack
        visibleChildName={indicatorNames[indicator]}
        vhomogeneous={false}
        marginTop={6}
        marginBottom={6}
        marginStart={6}
        marginEnd={6}
      >
        <GtkStackPage name={indicatorNames[0]}>
          <AdwCarouselIndicatorDots carousel={carousel} orientation={orientation} />
        </GtkStackPage>
        <GtkStackPage name={indicatorNames[1]}>
          <AdwCarouselIndicatorLines carousel={carousel} orientation={orientation} />
        </GtkStackPage>
      </GtkStack>
    </GtkBox>
  )
}
