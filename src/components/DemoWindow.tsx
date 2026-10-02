import { AdwSidebar, AdwSidebarItem, AdwSidebarSection } from '@gtkx/jsx/adw'
import { createSplitViewNavigator, type SplitViewScreenProps } from '@gtkx/navigation'
import { AvatarDemo } from '@/demos/AvatarDemo.js'
import { BannerDemo } from '@/demos/BannerDemo.js'
import { BottomSheetDemo } from '@/demos/BottomSheetDemo.js'
import { CarouselDemo } from '@/demos/CarouselDemo.js'
import { NavigationViewDemoPage } from '@/demos/NavigationViewDemo/NavigationViewDemoPage.js'
import { SpinnerDemo } from '@/demos/SpinnerDemo.js'
import { SplitViewsDemoPage } from '@/demos/SplitViewsDemo/SplitViewsDemoPage.js'
import { TabViewDemoPage } from '@/demos/TabViewDemo/TabViewDemoPage.js'
import { ToastDemo } from '@/demos/ToastDemo.js'
import { ViewSwitcherDemoPage } from '@/demos/ViewSwitcherDemo/ViewSwitcherDemoPage.js'
import { Welcome } from '@/demos/Welcome.js'
import { pascalCase } from '@/utils/format.js'

type RouteParams = {
  Avatar: undefined
  Banner: undefined
  BottomSheet: undefined
  Carousel: undefined
  NavigationView: undefined
  Sidebar: undefined
  Spinner: undefined
  SplitViews: undefined
  TabView: undefined
  Toasts: undefined
  ViewSwitcher: undefined
  Welcome: undefined
}

const Split = createSplitViewNavigator<RouteParams>()

const Sidebar = ({ navigation }: SplitViewScreenProps<RouteParams, 'Sidebar'>) => (
  <AdwSidebar
    cssClasses={['navigation-sidebar']}
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
      <AdwSidebarItem iconName="widget-list-symbolic" title="Boxed List" enabled={false} />
      <AdwSidebarItem iconName="widget-toggle-group-symbolic" title="Toggle Groups" enabled={false} />
      <AdwSidebarItem iconName="widget-buttons-symbolic" title="Buttons" enabled={false} />
    </AdwSidebarSection>
    <AdwSidebarSection title="Display">
      <AdwSidebarItem iconName="widget-banner-symbolic" title="Banner" />
      <AdwSidebarItem iconName="widget-toast-symbolic" title="Toasts" />
      <AdwSidebarItem iconName="process-working-symbolic" title="Spinner" />
      <AdwSidebarItem iconName="adw-avatar-symbolic" title="Avatar" />
    </AdwSidebarSection>
    <AdwSidebarSection title="Dialogs">
      <AdwSidebarItem iconName="widget-dialog-symbolic" title="Alert Dialog" enabled={false} />
      <AdwSidebarItem iconName="widget-about-symbolic" title="About Dialog" enabled={false} />
    </AdwSidebarSection>
    <AdwSidebarSection title="Layout">
      <AdwSidebarItem iconName="widget-clamp-symbolic" title="Clamp" enabled={false} />
      <AdwSidebarItem iconName="widget-wrap-box-symbolic" title="Wrap Box" enabled={false} />
      <AdwSidebarItem iconName="widget-multi-layout-symbolic" title="Multi-Layout View" enabled={false} />
    </AdwSidebarSection>
    <AdwSidebarSection title="Miscellaneous">
      <AdwSidebarItem iconName="style-classes-symbolic" title="Style Classes" enabled={false} />
      <AdwSidebarItem iconName="animations-symbolic" title="Animations" enabled={false} />
    </AdwSidebarSection>
  </AdwSidebar>
)

export const Navigation = () => (
  <Split.Navigator minSidebarWidth={220} maxSidebarWidth={300} sidebarWidthFraction={0.25} initialRouteName="Welcome">
    <Split.Screen name="Sidebar" component={Sidebar} options={{ title: 'GTKX Adwaita Demo' }} />

    <Split.Screen name="Avatar" component={AvatarDemo} options={{ headerBackVisible: false }} />
    <Split.Screen name="Banner" component={BannerDemo} options={{ headerBackVisible: false }} />
    <Split.Screen name="BottomSheet" component={BottomSheetDemo} options={{ headerShown: false }} />
    <Split.Screen name="Carousel" component={CarouselDemo} options={{ headerBackVisible: false }} />
    <Split.Screen name="NavigationView" component={NavigationViewDemoPage} options={{ headerBackVisible: false }} />

    <Split.Screen name="SplitViews" component={SplitViewsDemoPage} options={{ headerBackVisible: false }} />
    <Split.Screen name="Spinner" component={SpinnerDemo} options={{ headerBackVisible: false }} />
    <Split.Screen
      name="TabView"
      component={TabViewDemoPage}
      options={{ headerBackVisible: false, headerShown: false }}
    />
    <Split.Screen name="Toasts" component={ToastDemo} options={{ headerBackVisible: false }} />
    <Split.Screen name="ViewSwitcher" component={ViewSwitcherDemoPage} options={{ headerBackVisible: false }} />
    <Split.Screen name="Welcome" component={Welcome} options={{ headerBackVisible: false, title: undefined }} />
  </Split.Navigator>
)
