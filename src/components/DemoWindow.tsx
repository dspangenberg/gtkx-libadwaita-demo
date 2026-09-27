import * as Gtk from '@gtkx/gi/gtk'
import { AdwSidebar, AdwSidebarItem, AdwSidebarSection, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { createSplitViewNavigator, type SplitViewScreenProps } from '@gtkx/navigation'
import { BannerDemo } from '@/demos/BannerDemo.js'
import { Welcome } from '@/demos/Welcome.js'
import { pascalCase } from '@/utils/format.js'

type RouteParams = {
  Sidebar: undefined
  Banner: undefined
  Welcome: undefined
  Messages: { folder: string }
  Message: { id: string }
}

const Split = createSplitViewNavigator<RouteParams>()

const Sidebar = ({ navigation }: SplitViewScreenProps<RouteParams, 'Sidebar'>) => (
  <AdwSidebar
    cssClasses={['navigation-sidebar']}
    onActivated={(index, self) => {
      const item = self.getItem(index)
      const routeName = pascalCase(item?.getTitle() as string)
      navigation.navigate(routeName)
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
)

const Messages = ({ route, navigation }: SplitViewScreenProps<RouteParams, 'Messages'>) => (
  <GtkBox orientation={Gtk.Orientation.VERTICAL}>
    <GtkLabel>{`Messages in ${route.params.folder}`}</GtkLabel>
    <GtkButton
      label="Open the first one"
      onClicked={() => {
        navigation.navigate('Message', { id: '1' })
      }}
    />
    <GtkButton
      label="Clear selection"
      onClicked={() => {
        navigation.goBack()
      }}
    />
  </GtkBox>
)

const Message = ({ route }: SplitViewScreenProps<RouteParams, 'Message'>) => (
  <GtkLabel>{`Message ${route.params.id}`}</GtkLabel>
)

export const Navigation = ({ isNarrow }: { isNarrow: boolean }) => (
  <Split.Navigator
    minSidebarWidth={220}
    maxSidebarWidth={300}
    sidebarWidthFraction={0.25}
    initialRouteName="Welcome"
    contentPlaceholder={
      <AdwStatusPage
        iconName="circle-crossed-symbolic"
        title="Welcome to Adwaita Demo"
        description="This is a tour of the features the library has to offer."
      >
        <GtkButton label="Test" halign={Gtk.Align.CENTER} />
      </AdwStatusPage>
    }
  >
    <Split.Screen name="Sidebar" component={Sidebar} options={{ title: 'GTKX Adwaita Demo' }} />
    <Split.Screen name="Banner" component={BannerDemo} />
    <Split.Screen name="Welcome" component={Welcome} />

    <Split.Screen name="Messages" component={Messages} options={({ route }) => ({ title: route.params.folder })} />
    <Split.Screen name="Message" component={Message} options={{ headerEnd: <GtkButton label="Reply" /> }} />
  </Split.Navigator>
)
