import * as Gtk from '@gtkx/gi/gtk'
import { AdwSidebar, AdwSidebarItem, AdwSidebarSection, AdwStatusPage } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { createSplitViewNavigator, type SplitViewScreenProps } from '@gtkx/navigation'
import { pascalCase } from '@/utils/format.js'

type MailParams = { Folders: undefined; Messages: { folder: string }; Message: { id: string } }

const Split = createSplitViewNavigator<MailParams>()

const Folders = ({ navigation }: SplitViewScreenProps<MailParams, 'Folders'>) => (
  <AdwSidebar
    cssClasses={['navigation-sidebar']}
    onActivated={(index, self) => {
      const item = self.getItem(index)
      console.log(pascalCase(item?.getTitle() as string))
    }}
  >
    <AdwSidebarSection>
      <AdwSidebarItem iconName="welcome-symbolic" title="Welcome" key="welcome" />
    </AdwSidebarSection>
    <AdwSidebarSection title="Navigation">
      <AdwSidebarItem iconName="widget-navigation-view-symbolic" title="Navigation View" name="navigation-view" />
      <AdwSidebarItem iconName="adw-sidebar-symbolic" title="Split Views" />
      <AdwSidebarItem iconName="widget-view-switcher-symbolic" title="View Switcher" />
      <AdwSidebarItem iconName="widget-tab-view-symbolic" title="Tab View" />
      <AdwSidebarItem iconName="widget-bottom-sheet-symbolic" title="Bottom Sheed" />
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

const Messages = ({ route, navigation }: SplitViewScreenProps<MailParams, 'Messages'>) => (
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

const Message = ({ route }: SplitViewScreenProps<MailParams, 'Message'>) => (
  <GtkLabel>{`Message ${route.params.id}`}</GtkLabel>
)

export const Mail = ({ isNarrow }: { isNarrow: boolean }) => (
  <Split.Navigator
    collapsed={isNarrow}
    minSidebarWidth={220}
    maxSidebarWidth={300}
    sidebarWidthFraction={0.25}
    contentPlaceholder={
      <AdwStatusPage
        iconName="welcome-symbolic"
        title="Welcome to Adwaita Demo"
        description="This is a tour of the features the library has to offer."
      />
    }
  >
    <Split.Screen name="Folders" component={Folders} options={{ title: 'GTKX Adwaita Demo' }} />
    <Split.Screen name="Messages" component={Messages} options={({ route }) => ({ title: route.params.folder })} />
    <Split.Screen name="Message" component={Message} options={{ headerEnd: <GtkButton label="Reply" /> }} />
  </Split.Navigator>
)
