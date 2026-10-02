import * as Gtk from '@gtkx/gi/gtk'
import { AdwDialog, AdwHeaderBar, AdwNavigationPage, AdwToolbarView } from '@gtkx/jsx/adw'
import { GtkBox, GtkButton, GtkLabel } from '@gtkx/jsx/gtk'
import { createStackNavigator, type StackScreenProps } from '@gtkx/navigation'

type PageRoutes = { PageOne: undefined; PageTwo: undefined; PageThree: undefined; PageFour: undefined }

const Stack = createStackNavigator<PageRoutes>()

type NavigationViewDemoProps = {
  isOpen: boolean
  onClosed: () => void
}

export const NavigationViewDemo = ({ isOpen, onClosed }: NavigationViewDemoProps) => {
  if (!isOpen) {
    return null
  }

  const PageOne = ({ navigation }: StackScreenProps<PageRoutes, 'PageOne'>) => (
    <AdwNavigationPage title="Page 1">
      <AdwToolbarView topBar={<AdwHeaderBar />} />
      <GtkBox halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} spacing={18}>
        <GtkButton
          cssClasses={['pill']}
          label="Open Page 2"
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => navigation.navigate('PageTwo')}
        />
        <GtkButton
          cssClasses={['pill']}
          label="Open Page 3"
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => navigation.navigate('PageThree')}
        />
      </GtkBox>
    </AdwNavigationPage>
  )

  const PageTwo = ({ navigation }: StackScreenProps<PageRoutes, 'PageTwo'>) => (
    <AdwNavigationPage title="Page 2">
      <AdwToolbarView topBar={<AdwHeaderBar />} />
      <GtkBox halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} spacing={18}>
        <GtkButton
          cssClasses={['pill']}
          label="Open Page 4"
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => navigation.navigate('PageFour')}
        />
      </GtkBox>
    </AdwNavigationPage>
  )

  const PageThree = () => (
    <AdwNavigationPage title="Page 3">
      <AdwToolbarView topBar={<AdwHeaderBar />} />
      <GtkBox halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} spacing={18}>
        <GtkLabel label="Page 3" cssClasses={['title-1']} />
      </GtkBox>
    </AdwNavigationPage>
  )

  const PageFour = ({ navigation }: StackScreenProps<PageRoutes, 'PageFour'>) => (
    <AdwNavigationPage title="Page 4">
      <AdwToolbarView topBar={<AdwHeaderBar />} />
      <GtkBox halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} spacing={18}>
        <GtkButton
          cssClasses={['pill']}
          label="Open Page 3"
          valign={Gtk.Align.CENTER}
          halign={Gtk.Align.CENTER}
          onClicked={() => navigation.navigate('PageThree')}
        />
      </GtkBox>
    </AdwNavigationPage>
  )

  return (
    <AdwDialog contentWidth={360} contentHeight={360} title="AdwNavigationView Demo" onClosed={onClosed}>
      <Stack.Navigator initialRouteName="PageOne">
        <Stack.Screen name="PageOne" component={PageOne} options={{ title: 'Page 1' }} />
        <Stack.Screen name="PageTwo" component={PageTwo} options={{ title: 'Page 2' }} />
        <Stack.Screen name="PageThree" component={PageThree} options={{ title: 'Page 3' }} />
        <Stack.Screen name="PageFour" component={PageFour} options={{ title: 'Page 4' }} />
      </Stack.Navigator>
    </AdwDialog>
  )
}
