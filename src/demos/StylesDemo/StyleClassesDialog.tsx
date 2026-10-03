import * as Adw from '@gtkx/gi/adw'
import * as Gio from '@gtkx/gi/gio'
import * as Gtk from '@gtkx/gi/gtk'
import * as Pango from '@gtkx/gi/pango'
import {
  AdwActionRow,
  AdwBin,
  AdwBreakpoint,
  AdwDialog,
  AdwHeaderBar,
  AdwPreferencesGroup,
  AdwPreferencesPage,
  AdwSwitchRow,
  AdwToggle,
  AdwToggleGroup,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import {
  GtkAdjustment,
  GtkBox,
  GtkButton,
  GtkCheckButton,
  GtkEntry,
  GtkFrame,
  GtkGrid,
  GtkGridLayoutChild,
  GtkImage,
  GtkLabel,
  GtkListBox,
  GtkMenuButton,
  GtkOverlay,
  GtkProgressBar,
  GtkScale,
  GtkScaleButton,
  GtkSeparator,
  GtkToggleButton
} from '@gtkx/jsx/gtk'
import { useRef, useState } from 'react'

type StyleClassesDialogProps = {
  onClosed: () => void
  onOpenStatusPages: () => void
  onOpenSidebar: () => void
}

const buildMenu = () => {
  const menu = new Gio.Menu()
  menu.append('Item 1', null)
  menu.append('Item 2', null)
  menu.append('Item 3', null)
  return menu
}

type StyledLabelProps = {
  label: string
  style: string
}

const TitleLabel = ({ label, style }: StyledLabelProps) => (
  <GtkLabel label={label} xalign={0} ellipsize={Pango.EllipsizeMode.END} tooltipText={style} cssClasses={[style]} />
)

const WrappedLabel = ({ label, style }: StyledLabelProps) => (
  <GtkLabel
    label={label}
    xalign={0}
    wrap={true}
    wrapMode={Pango.WrapMode.WORD_CHAR}
    maxWidthChars={25}
    tooltipText={style}
    cssClasses={[style]}
  />
)

const CenteredLabel = ({ label }: { label: string }) => (
  <GtkLabel label={label} wrap={true} wrapMode={Pango.WrapMode.WORD_CHAR} />
)

export const StyleClassesDialog = ({ onClosed, onOpenStatusPages, onOpenSidebar }: StyleClassesDialogProps) => {
  const [isNarrow, setIsNarrow] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [isDevel, setIsDevel] = useState(false)
  const [menu] = useState(buildMenu)
  const dialogRef = useRef<Adw.Dialog | null>(null)
  const narrowOrientation = isNarrow ? Gtk.Orientation.VERTICAL : Gtk.Orientation.HORIZONTAL

  const setDevelStyle = (active: boolean) => {
    const root = dialogRef.current?.getRoot()

    if (root instanceof Gtk.Widget) {
      if (active) {
        root.addCssClass('devel')
      } else {
        root.removeCssClass('devel')
      }
    }
  }

  return (
    <AdwDialog
      ref={dialogRef}
      title="Style Classes"
      contentWidth={800}
      widthRequest={360}
      heightRequest={150}
      breakpoints={
        <AdwBreakpoint
          condition={Adw.BreakpointCondition.parse('max-width: 550sp')}
          onApply={() => setIsNarrow(true)}
          onUnapply={() => setIsNarrow(false)}
        />
      }
      onClosed={onClosed}
    >
      <AdwToolbarView topBar={<AdwHeaderBar />}>
        <GtkOverlay
          overlays={
            <GtkProgressBar
              valign={Gtk.Align.START}
              fraction={0.5}
              tooltipText="osd"
              visible={showProgress}
              cssClasses={['osd']}
            />
          }
        >
          <AdwPreferencesPage widthRequest={360} description="Hover over widgets to see their exact style class names">
            <AdwPreferencesGroup
              title="Buttons"
              description='The "flat", "suggested-action" and "destructive" style classes action can be used together with "pill" or "circular".&#10;&#10;The "opaque" style class allows to create buttons with custom colors that look similar to "suggested-action".'
            >
              <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={6}>
                <GtkBox spacing={6} homogeneous={true} orientation={narrowOrientation}>
                  <GtkBox spacing={6} homogeneous={true} orientation={narrowOrientation}>
                    <GtkButton label="Regular" canShrink={true} />
                    <GtkButton label="Flat" tooltipText="flat" canShrink={true} cssClasses={['flat']} />
                  </GtkBox>
                  <GtkBox spacing={6} homogeneous={true} orientation={narrowOrientation}>
                    <GtkButton
                      label="Suggested"
                      tooltipText="suggested-action"
                      canShrink={true}
                      cssClasses={['suggested-action']}
                    />
                    <GtkButton
                      label="Destructive"
                      tooltipText="destructive-action"
                      canShrink={true}
                      cssClasses={['destructive-action']}
                    />
                  </GtkBox>
                </GtkBox>

                <GtkBox spacing={6} marginTop={12}>
                  <GtkBox
                    spacing={6}
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    hexpand={true}
                    tooltipText="circular"
                    orientation={narrowOrientation}
                  >
                    <GtkButton
                      label="Pill Button"
                      halign={Gtk.Align.CENTER}
                      valign={Gtk.Align.CENTER}
                      tooltipText="pill"
                      iconName="list-add-symbolic"
                      cssClasses={['circular']}
                    />
                    <GtkButton label="A" tooltipText="circular" cssClasses={['circular']} />
                  </GtkBox>
                  <GtkButton
                    label="Pill Button"
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    hexpand={true}
                    tooltipText="pill"
                    canShrink={true}
                    cssClasses={['pill']}
                  />
                  <GtkBox spacing={6} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} hexpand={true}>
                    <GtkButton iconName="go-previous-symbolic" tooltipText="osd" cssClasses={['osd']} />
                    <GtkButton iconName="go-next-symbolic" tooltipText="osd" cssClasses={['osd']} />
                  </GtkBox>
                </GtkBox>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup title="Entries">
              <GtkBox spacing={6} orientation={Gtk.Orientation.VERTICAL}>
                <GtkBox spacing={6} homogeneous={true} hexpand={true} orientation={narrowOrientation}>
                  <GtkEntry placeholderText="Regular" text="Regular" secondaryIconName="edit-copy-symbolic" />
                  <GtkEntry
                    placeholderText="Success"
                    text="Success"
                    tooltipText="success"
                    secondaryIconName="edit-copy-symbolic"
                    cssClasses={['success']}
                  />
                </GtkBox>
                <GtkBox spacing={6} homogeneous={true} hexpand={true} orientation={narrowOrientation}>
                  <GtkEntry
                    placeholderText="Warning"
                    text="Warning"
                    tooltipText="warning"
                    secondaryIconName="edit-copy-symbolic"
                    cssClasses={['warning']}
                  />
                  <GtkEntry
                    placeholderText="Error"
                    text="Error"
                    tooltipText="error"
                    secondaryIconName="edit-copy-symbolic"
                    cssClasses={['error']}
                  />
                </GtkBox>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Toggle Groups"
              description='The "flat", "round" and "osd" style classes action can all be used together'
            >
              <GtkBox spacing={6} homogeneous={true} orientation={narrowOrientation}>
                <AdwToggleGroup tooltipText="flat" cssClasses={['flat']}>
                  <AdwToggle label="Flat" />
                  <AdwToggle label="Flat" />
                </AdwToggleGroup>
                <AdwToggleGroup tooltipText="round" cssClasses={['round']}>
                  <AdwToggle label="Round" />
                  <AdwToggle label="Round" />
                </AdwToggleGroup>
                <AdwToggleGroup tooltipText="osd" cssClasses={['osd']}>
                  <AdwToggle label="OSD" />
                  <AdwToggle label="OSD" />
                </AdwToggleGroup>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Linked Controls"
              description='The "linked" style on GtkBox and similar containers allows to visually join related button-like and entry-like widgets'
            >
              <GtkBox spacing={6} orientation={narrowOrientation}>
                <GtkBox tooltipText="linked" cssClasses={['linked']}>
                  <GtkToggleButton iconName="view-grid-symbolic" active={true} />
                  <GtkToggleButton iconName="view-list-symbolic" />
                </GtkBox>
                <GtkBox tooltipText="linked" cssClasses={['linked']}>
                  <GtkEntry placeholderText="Entry" hexpand={true} />
                  <GtkEntry placeholderText="Entry" hexpand={true} />
                  <GtkButton label="Button" canShrink={true} />
                </GtkBox>
              </GtkBox>

              <GtkBox spacing={6} marginTop={6} orientation={narrowOrientation}>
                <GtkBox orientation={Gtk.Orientation.VERTICAL} tooltipText="linked" cssClasses={['linked']}>
                  <GtkButton iconName="edit-cut-symbolic" />
                  <GtkButton iconName="edit-copy-symbolic" />
                  <GtkButton iconName="edit-paste-symbolic" />
                </GtkBox>
                <GtkBox
                  orientation={Gtk.Orientation.VERTICAL}
                  hexpand={true}
                  tooltipText="linked"
                  cssClasses={['linked']}
                >
                  <GtkEntry placeholderText="Street" />
                  <GtkEntry placeholderText="City" />
                  <GtkEntry placeholderText="Province" />
                </GtkBox>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup title="Labels">
              <GtkBox spacing={18} orientation={narrowOrientation}>
                <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12} hexpand={true}>
                  <TitleLabel label="Title 1" style="title-1" />
                  <TitleLabel label="Title 2" style="title-2" />
                  <TitleLabel label="Title 3" style="title-3" />
                  <TitleLabel label="Title 4" style="title-4" />
                  <TitleLabel label="Monospace" style="monospace" />
                  <TitleLabel label="Numeric (1234567890)" style="numeric" />
                  <TitleLabel label="Accent" style="accent" />
                  <TitleLabel label="Success" style="success" />
                  <TitleLabel label="Warning" style="warning" />
                  <TitleLabel label="Error" style="error" />
                </GtkBox>
                <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12} hexpand={true}>
                  <WrappedLabel
                    label={"This is a document paragraph. It should be used for the app's main content."}
                    style="document"
                  />
                  <TitleLabel label="Heading" style="heading" />
                  <WrappedLabel
                    label={
                      'This is a paragraph of a body copy, to be used for medium-long text such as descriptions in the UI.'
                    }
                    style="body"
                  />
                  <TitleLabel label="Caption Heading" style="caption-heading" />
                  <WrappedLabel
                    label={'Caption body text, to be used for body copy on image captions and the like'}
                    style="caption"
                  />
                  <WrappedLabel
                    label={'This is a dimmed paragraph, mostly used for secondary labels or descriptions.'}
                    style="dimmed"
                  />
                </GtkBox>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Cards and Boxed Lists"
              description='The "boxed-list" style class can be used with GtkListBox to create boxed lists.&#10;&#10;The "card" style class can be used to achieve the same style with GtkBox or similar containers, and with GtkButton. If used together with "activatable" style class, or on a GtkButton, the card will also have hover and press styles.'
            >
              <GtkBox homogeneous={true} heightRequest={100} marginBottom={12} spacing={12}>
                <AdwBin tooltipText="card" cssClasses={['card']}>
                  <CenteredLabel label="Card" />
                </AdwBin>
                <AdwBin tooltipText="card, activatable" focusable={true} cssClasses={['card', 'activatable']}>
                  <CenteredLabel label="Card (Activatable)" />
                </AdwBin>
                <GtkButton tooltipText="card" cssClasses={['card']}>
                  <CenteredLabel label="Card (Button)" />
                </GtkButton>
              </GtkBox>
              <GtkListBox tooltipText="boxed-list" selectionMode={Gtk.SelectionMode.NONE} cssClasses={['boxed-list']}>
                <AdwActionRow title="Row" />
                <AdwActionRow title="Row (Activatable)" activatable={true} />
              </GtkListBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="App Icons"
              description='The "icon-dropshadow" style class ensures legibility when displaying app icons. For 32x32 and smaller app icons, "lowres-icon" should be used instead.'
            >
              <GtkGrid rowSpacing={6} columnSpacing={12}>
                <GtkGridLayoutChild column={0} row={0}>
                  <GtkImage
                    iconName="org.gnome.Boxes"
                    pixelSize={128}
                    valign={Gtk.Align.END}
                    tooltipText="icon-dropshadow"
                    cssClasses={['icon-dropshadow']}
                  />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={0} row={1}>
                  <GtkLabel label="128" xalign={0.5} />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={1} row={0}>
                  <GtkImage
                    iconName="org.gnome.Boxes"
                    pixelSize={64}
                    valign={Gtk.Align.END}
                    tooltipText="icon-dropshadow"
                    cssClasses={['icon-dropshadow']}
                  />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={1} row={1}>
                  <GtkLabel label="64" xalign={0.5} />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={2} row={0}>
                  <GtkImage
                    iconName="org.gnome.Boxes"
                    pixelSize={32}
                    valign={Gtk.Align.END}
                    tooltipText="lowres-icon"
                    cssClasses={['lowres-icon']}
                  />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={2} row={1}>
                  <GtkLabel label="32" xalign={0.5} />
                </GtkGridLayoutChild>
              </GtkGrid>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Check Buttons"
              description='The "selection-mode" style class can be used with GtkCheckButton to make them large and round'
            >
              <GtkGrid halign={Gtk.Align.START} rowSpacing={6} columnSpacing={12}>
                <GtkGridLayoutChild column={0} row={0}>
                  <GtkCheckButton halign={Gtk.Align.END} valign={Gtk.Align.END} active={true} />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={1} row={0}>
                  <GtkCheckButton halign={Gtk.Align.START} valign={Gtk.Align.END} />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={0} row={1} columnSpan={2}>
                  <GtkLabel label="Regular" xalign={0.5} marginStart={12} marginEnd={12} wrap={true} />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={0} row={2}>
                  <GtkCheckButton
                    halign={Gtk.Align.END}
                    valign={Gtk.Align.END}
                    active={true}
                    tooltipText="selection-mode"
                    cssClasses={['selection-mode']}
                  />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={1} row={2}>
                  <GtkCheckButton
                    halign={Gtk.Align.START}
                    valign={Gtk.Align.END}
                    tooltipText="selection-mode"
                    cssClasses={['selection-mode']}
                  />
                </GtkGridLayoutChild>
                <GtkGridLayoutChild column={0} row={3} columnSpan={2}>
                  <GtkLabel label="Selection Mode" xalign={0.5} marginStart={12} marginEnd={12} wrap={true} />
                </GtkGridLayoutChild>
              </GtkGrid>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Toolbars"
              description='The "toolbar" style class on GtkBox and similar containers gives the same padding, spacing and button appearance as GtkHeaderBar and GtkActionBar have. A toolbar can additionally have the "osd" style class, useful for floating media controls. The "raised" style class can be used to make a button inside a toolbar use default appearance instead.'
            >
              <GtkFrame marginBottom={12} cssClasses={['toolbar-demo']}>
                <GtkBox tooltipText="toolbar" cssClasses={['toolbar']}>
                  <GtkMenuButton label="Open" menuModel={menu} />
                  <GtkButton iconName="tab-new-symbolic" />
                  <GtkSeparator hexpand={true} cssClasses={['spacer']} />
                  <GtkButton iconName="edit-undo-symbolic" />
                  <GtkButton iconName="edit-redo-symbolic" />
                  <GtkSeparator cssClasses={['spacer']} />
                  <GtkMenuButton iconName="view-more-symbolic" menuModel={menu} />
                </GtkBox>
              </GtkFrame>
              <GtkBox tooltipText="toolbar, osd" cssClasses={['toolbar', 'osd']}>
                <GtkButton iconName="media-skip-backward-symbolic" />
                <GtkButton iconName="media-playback-pause-symbolic" />
                <GtkButton iconName="media-skip-forward-symbolic" />
                <GtkScale hexpand={true} adjustment={<GtkAdjustment lower={0} upper={100} value={50} />} />
                <GtkScaleButton
                  icons={['audio-volume-muted', 'audio-volume-high', 'audio-volume-low', 'audio-volume-medium']}
                />
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup
              title="Backgrounds"
              description="These style classes can be applied to any widgets that need the specific background and text color"
            >
              <GtkBox homogeneous={true} heightRequest={100}>
                <AdwBin tooltipText="background" cssClasses={['background']}>
                  <CenteredLabel label="Background" />
                </AdwBin>
                <AdwBin tooltipText="view" cssClasses={['view']}>
                  <CenteredLabel label="View" />
                </AdwBin>
                <AdwBin tooltipText="osd" cssClasses={['osd']}>
                  <CenteredLabel label="OSD" />
                </AdwBin>
              </GtkBox>
            </AdwPreferencesGroup>

            <AdwPreferencesGroup title="Misc">
              <AdwActionRow
                title="Status Pages"
                activatable={true}
                onActivated={onOpenStatusPages}
                suffix={<GtkImage iconName="go-next-symbolic" cssClasses={['dimmed']} />}
              />
              <AdwActionRow
                title="Sidebar"
                activatable={true}
                onActivated={onOpenSidebar}
                suffix={<GtkImage iconName="go-next-symbolic" cssClasses={['dimmed']} />}
              />
              <AdwSwitchRow
                title="Development Window"
                subtitle='"devel" style class on GtkWindow'
                active={isDevel}
                onNotifyActive={active => {
                  const value = active ?? false
                  setIsDevel(value)
                  setDevelStyle(value)
                }}
              />
              <AdwSwitchRow
                title="OSD Progress Bar"
                subtitle='"osd" style class on GtkProgressBar'
                active={showProgress}
                onNotifyActive={active => setShowProgress(active ?? false)}
              />
            </AdwPreferencesGroup>
          </AdwPreferencesPage>
        </GtkOverlay>
      </AdwToolbarView>
    </AdwDialog>
  )
}
