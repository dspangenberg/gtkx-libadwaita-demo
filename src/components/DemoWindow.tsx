import * as Adw from '@gtkx/gi/adw'
import * as Gtk from '@gtkx/gi/gtk'
import {
  AdwHeaderBar,
  AdwSidebar,
  AdwSidebarItem,
  AdwSidebarSection,
  AdwStatusPage,
  AdwToolbarView
} from '@gtkx/jsx/adw'
import { GMenu } from '@gtkx/jsx/gio'
import { GtkMenuButton, GtkSearchBar, GtkSearchEntry, GtkStringFilter, GtkToggleButton } from '@gtkx/jsx/gtk'
import { createDrawerNavigator, DrawerActions, type DrawerContentProps, type NavigationHelpers } from '@gtkx/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
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
      <Drawer.Screen name="AboutDialog" component={AboutDialogDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="AlertDialog" component={AlertDialogDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Animations" component={AnimationsDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Avatar" component={AvatarDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Banner" component={BannerDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="BottomSheet" component={BottomSheetDemo} options={{ headerShown: false }} />
      <Drawer.Screen name="BoxedList" component={BoxedListDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Buttons" component={ButtonsDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Carousel" component={CarouselDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Clamp" component={ClampDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="MultiLayoutView" component={MultiLayoutDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="NavigationView" component={NavigationViewDemoPage} options={{ headerShown: true }} />
      <Drawer.Screen name="SplitViews" component={SplitViewsDemoPage} options={{ headerShown: true }} />
      <Drawer.Screen name="StyleClasses" component={StylesDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Spinner" component={SpinnerDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="TabView" component={TabViewDemoPage} options={{ headerShown: false }} />
      <Drawer.Screen name="Toasts" component={ToastDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="ToggleGroups" component={ToggleGroupsDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="ViewSwitcher" component={ViewSwitcherDemoPage} options={{ headerShown: true }} />
      <Drawer.Screen name="WrapBox" component={WrapBoxDemo} options={{ headerShown: true }} />
      <Drawer.Screen name="Welcome" component={Welcome} options={{ headerShown: true }} />
    </Drawer.Navigator>
  )
}
