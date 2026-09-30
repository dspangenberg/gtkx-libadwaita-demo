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
import { typeFromName } from '@gtkx/runtime'
import { useState } from 'react'

const indicatorNames = ['Dots', 'Lines']

let orientationType: bigint | null = null
let orientationExpression: Gtk.Expression | null = null

const getOrientationType = () => {
  orientationType ??= typeFromName('GtkOrientation')
  orientationExpression ??= Gtk.PropertyExpression.new(Adw.EnumListItem, null, 'nick')

  return orientationType
}

const getOrientationExpression = () => {
  getOrientationType()

  return orientationExpression
}

export const CarouselDemo = () => {
  const [carousel, setCarousel] = useState<Adw.Carousel | null>(null)
  const [page, setPage] = useState(0)
  const [orientation, setOrientation] = useState(Gtk.Orientation.HORIZONTAL)
  const [indicator, setIndicator] = useState(0)
  const [scrollWheel, setScrollWheel] = useState(true)
  const [longSwipes, setLongSwipes] = useState(false)

  const scrollToPage = (index: number) => {
    if (carousel === null || index < 0 || index >= 3) {
      return
    }

    carousel.scrollTo(carousel.getNthPage(index), true)
  }

  return (
    <GtkBox
      orientation={orientation === Gtk.Orientation.HORIZONTAL ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL}
      vexpand
      marginBottom={24}
    >
      <AdwCarousel
        ref={setCarousel}
        vexpand
        hexpand
        orientation={orientation}
        allowLongSwipes={longSwipes}
        revealDuration={300}
        allowScrollWheel={scrollWheel}
        onPageChanged={index => setPage(index < 0 ? 0 : index)}
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
              model={<AdwEnumListModel enumType={getOrientationType()} />}
              expression={getOrientationExpression()}
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
