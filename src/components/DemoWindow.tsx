import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwHeaderBar,
  AdwSidebar,
  AdwSidebarItem,
  AdwSidebarSection,
  AdwStatusPage,
  AdwToolbarView,
  AdwWindowTitle
} from '@gtkx/jsx/adw'
import { GMenu } from '@gtkx/jsx/gio'
import { GtkButton, GtkMenuButton, GtkSearchBar, GtkSearchEntry, GtkStringFilter, GtkToggleButton } from '@gtkx/jsx/gtk'
import {
  createDrawerNavigator,
  DrawerActions,
  type DrawerContentProps,
  type DrawerHeaderProps,
  type NavigationHelpers
} from '@gtkx/navigation'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AboutDialogDemo } from '@/demos/AboutDialogDemo.js'
import { AlertDialogDemo } from '@/demos/AlertDialogDemo.js'
import { AnimationsDemo } from '@/demos/AnimationsDemo.js'
import { AvatarDemo } from '@/demos/AvatarDemo.js'
import { BannerDemo } from '@/demos/BannerDemo.js'
import { BottomSheetDemo } from '@/demos/BottomSheetDemo.js'
import { BoxedListDemo } from '@/demos/BoxedListDemo.js'
import { ButtonsDemo } from '@/demos/ButtonsDemo.js'
import { CarouselDemo } from '@/demos/CarouselDemo.js'
import { ClampDemo } from '@/demos/ClampDemo.js'
import { DragDropDemo } from '@/demos/DragDropDemo.js'
import { FloatingBarDemo } from '@/demos/FloatingBarDemo.js'
import { MultiLayoutDemo } from '@/demos/MultiLayoutDemo.js'
import { NavigationViewDemoPage } from '@/demos/NavigationViewDemo/NavigationViewDemoPage.js'
import { SpinnerDemo } from '@/demos/SpinnerDemo.js'
import { SplitViewsDemoPage } from '@/demos/SplitViewsDemo/SplitViewsDemoPage.js'
import { StylesDemo } from '@/demos/StylesDemo/StylesDemo.js'
import { TabViewDemoPage } from '@/demos/TabViewDemo/TabViewDemoPage.js'
import { ToastDemo } from '@/demos/ToastDemo.js'
import { ToggleGroupsDemo } from '@/demos/ToggleGroupsDemo.js'
import { ViewSwitcherDemoPage } from '@/demos/ViewSwitcherDemo/ViewSwitcherDemoPage.js'
import { Welcome } from '@/demos/Welcome.js'
import { WrapBoxDemo } from '@/demos/WrapBoxDemo.js'
import { pascalCase } from '@/utils/format.js'

type RouteParams = {
  AboutDialog: undefined
  AlertDialog: undefined
  Animations: undefined
  Avatar: undefined
  Banner: undefined
  BottomSheet: undefined
  BoxedList: undefined
  Buttons: undefined
  Carousel: undefined
  Clamp: undefined
  DragAndDrop: undefined
  FloatingBar: undefined
  MultiLayoutView: undefined
  NavigationView: undefined
  Spinner: undefined
  StyleClasses: undefined
  SplitViews: undefined
  TabView: undefined
  Toasts: undefined
  ToggleGroups: undefined
  ViewSwitcher: undefined
  WrapBox: undefined
  Welcome: undefined
}

const Drawer = createDrawerNavigator<RouteParams>()

const DrawerToggle = ({ navigation }: Pick<DrawerHeaderProps, 'navigation'>) => (
  <GtkButton
    iconName="sidebar-show-symbolic"
    tooltipText="Toggle Sidebar"
    accessibleLabel="Toggle Sidebar"
    onClicked={() => {
      navigation.dispatch(DrawerActions.toggleDrawer())
    }}
  />
)

// The drawer's own context for this is not exported, and demoHeader is shared by every
// screen, so the flag travels from Navigation through here.
const CollapsedContext = createContext(false)

// The C app shows no title on its demo screens, so the default header would only add
// the route name on top. The toggle only appears once the sidebar has collapsed into an
// overlay, which is where it is the way back to the list.
const demoHeader = ({ navigation }: DrawerHeaderProps) => {
  const collapsed = useContext(CollapsedContext)

  return <AdwHeaderBar start={collapsed ? <DrawerToggle navigation={navigation} /> : undefined} />
}

const PrimaryMenu = () => (
  <GMenu
    items={[
      { section: [{ label: '_Inspector', action: 'app.inspector' }] },
      { section: [{ label: 'A_daptive Preview', action: 'win.adaptive-preview' }] },
      {
        section: [
          { label: '_Preferences', action: 'app.preferences' },
          { label: '_Keyboard Shortcuts', action: 'app.shortcuts' }
        ]
      },
      { section: [{ label: '_About GTKX Adwaita Demo', action: 'app.about' }] }
    ]}
  />
)

const Sidebar = ({ navigation }: Pick<DrawerContentProps, 'navigation'>) => {
  const sidebarRef = useRef<Adw.Sidebar | null>(null)
  const [searchMode, setSearchMode] = useState(false)
  const [search, setSearch] = useState('')
  const titleExpression = useMemo(() => Gtk.PropertyExpression.new(Adw.SidebarItem, null, 'title'), [])

  return (
    <AdwToolbarView
      topBar={
        <>
          <AdwHeaderBar
            // The window itself carries no title, so the app name lives here instead.
            titleWidget={<AdwWindowTitle title="GTKX Adwaita Demo" />}
            start={
              <GtkToggleButton
                iconName="edit-find-symbolic"
                active={searchMode}
                onNotifyActive={value => setSearchMode(value ?? false)}
              />
            }
            end={
              <GtkMenuButton
                tooltipText="Main Menu"
                iconName="open-menu-symbolic"
                primary
                menuModel={<PrimaryMenu />}
              />
            }
          />
          <GtkSearchBar searchModeEnabled={searchMode}>
            <GtkSearchEntry
              placeholderText="Find pages"
              hexpand
              text={search}
              onNotifyText={value => setSearch(value ?? '')}
              onActivate={() => sidebarRef.current?.grabFocus()}
            />
          </GtkSearchBar>
        </>
      }
    >
      <AdwSidebar
        ref={sidebarRef}
        cssClasses={['navigation-sidebar']}
        filter={<GtkStringFilter expression={titleExpression} search={search} />}
        placeholder={
          <AdwStatusPage iconName="edit-find-symbolic" title="No Results Found" description="Try a different search" />
        }
        onActivated={(index, self) => {
          const item = self.getItem(index)
          const routeName = pascalCase(item?.getTitle() as string)
          navigation.navigate(routeName as keyof RouteParams)
        }}
      >
        <AdwSidebarSection>
          <AdwSidebarItem iconName="welcome-symbolic" title="Welcome" key="welcome" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Navigation">
          <AdwSidebarItem iconName="widget-navigation-view-symbolic" title="Navigation View" />
          <AdwSidebarItem iconName="widget-split-views-symbolic" title="Split Views" />
          <AdwSidebarItem iconName="widget-view-switcher-symbolic" title="View Switcher" />
          <AdwSidebarItem iconName="widget-tab-view-symbolic" title="Tab View" />
          <AdwSidebarItem iconName="widget-bottom-sheet-symbolic" title="Bottom Sheet" />
          <AdwSidebarItem iconName="widget-carousel-symbolic" title="Carousel" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Controls">
          <AdwSidebarItem iconName="widget-list-symbolic" title="Boxed List" />
          <AdwSidebarItem iconName="widget-toggle-group-symbolic" title="Toggle Groups" />
          <AdwSidebarItem iconName="widget-buttons-symbolic" title="Buttons" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Display">
          <AdwSidebarItem iconName="widget-banner-symbolic" title="Banner" />
          <AdwSidebarItem iconName="widget-toast-symbolic" title="Toasts" />
          <AdwSidebarItem iconName="process-working-symbolic" title="Spinner" />
          <AdwSidebarItem iconName="format-justify-fill-symbolic" title="Floating Bar" />
          <AdwSidebarItem iconName="adw-avatar-symbolic" title="Avatar" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Dialogs">
          <AdwSidebarItem iconName="widget-dialog-symbolic" title="Alert Dialog" />
          <AdwSidebarItem iconName="widget-about-symbolic" title="About Dialog" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Layout">
          <AdwSidebarItem iconName="widget-clamp-symbolic" title="Clamp" />
          <AdwSidebarItem iconName="widget-wrap-box-symbolic" title="Wrap Box" />
          <AdwSidebarItem iconName="widget-multi-layout-symbolic" title="Multi-Layout View" />
        </AdwSidebarSection>
        <AdwSidebarSection title="Miscellaneous">
          <AdwSidebarItem iconName="style-classes-symbolic" title="Style Classes" />
          <AdwSidebarItem iconName="animations-symbolic" title="Animations" />
          <AdwSidebarItem iconName="edit-copy-symbolic" title="Drag and Drop" />
        </AdwSidebarSection>
      </AdwSidebar>
    </AdwToolbarView>
  )
}

export const Navigation = ({ collapsed = false }: { collapsed?: boolean }) => {
  const navigationRef = useRef<NavigationHelpers<RouteParams> | null>(null)

  useEffect(() => {
    const navigation = navigationRef.current

    if (navigation === null) {
      return
    }

    const action = collapsed ? DrawerActions.closeDrawer() : DrawerActions.openDrawer()

    navigation.dispatch({ ...action, target: navigation.getState().key })
  }, [collapsed])

  return (
    <CollapsedContext value={collapsed}>
      <Drawer.Navigator
        collapsed={collapsed}
        defaultStatus={collapsed ? 'closed' : 'open'}
        minSidebarWidth={220}
        maxSidebarWidth={300}
        sidebarWidthFraction={0.25}
        initialRouteName="Welcome"
        drawerContent={Sidebar}
        layout={({ navigation, children }) => {
          navigationRef.current = navigation

          return <>{children}</>
        }}
      >
        <Drawer.Screen name="AboutDialog" component={AboutDialogDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="AlertDialog" component={AlertDialogDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Animations" component={AnimationsDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Avatar" component={AvatarDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Banner" component={BannerDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="BottomSheet" component={BottomSheetDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="BoxedList" component={BoxedListDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Buttons" component={ButtonsDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Carousel" component={CarouselDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Clamp" component={ClampDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="DragAndDrop" component={DragDropDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="FloatingBar" component={FloatingBarDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="MultiLayoutView" component={MultiLayoutDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="NavigationView" component={NavigationViewDemoPage} options={{ header: demoHeader }} />
        <Drawer.Screen name="SplitViews" component={SplitViewsDemoPage} options={{ header: demoHeader }} />
        <Drawer.Screen name="StyleClasses" component={StylesDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Spinner" component={SpinnerDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="TabView" component={TabViewDemoPage} options={{ header: demoHeader }} />
        <Drawer.Screen name="Toasts" component={ToastDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="ToggleGroups" component={ToggleGroupsDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="ViewSwitcher" component={ViewSwitcherDemoPage} options={{ header: demoHeader }} />
        <Drawer.Screen name="WrapBox" component={WrapBoxDemo} options={{ header: demoHeader }} />
        <Drawer.Screen name="Welcome" component={Welcome} options={{ header: demoHeader }} />
      </Drawer.Navigator>
    </CollapsedContext>
  )
}
