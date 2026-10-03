import { AdwDialog, AdwStatusPage } from '@gtkx/jsx/adw'
import { createTabNavigator } from '@gtkx/navigation'

type PageRoutes = { World: undefined; Alarm: undefined; Stopwatch: undefined; Timer: undefined }

const Tabs = createTabNavigator<PageRoutes>()

type ViewSwitcherDemoProps = {
  isOpen: boolean
  onClosed: () => void
}

export const ViewSwitcherDemo = ({ isOpen, onClosed }: ViewSwitcherDemoProps) => {
  if (!isOpen) {
    return null
  }

  const World = () => (
    <AdwStatusPage
      iconName="clock-world-symbolic"
      title="World"
      description="View the time in cities around the world."
    />
  )

  const Alarm = () => (
    <AdwStatusPage
      iconName="clock-alarm-symbolic"
      title="Alarm"
      description="Set customizable alarms to go off on specific days."
    />
  )

  const Stopwatch = () => (
    <AdwStatusPage
      iconName="clock-stopwatch-symbolic"
      title="Stopwatch"
      description="Use the stopwatch to time how long something takes."
    />
  )

  const Timer = () => (
    <AdwStatusPage
      iconName="clock-timer-symbolic"
      title="Timer"
      description="Set a countdown in seconds, minutes or hours."
    />
  )

  return (
    <AdwDialog contentWidth={640} contentHeight={480} title="View Switcher Demo" onClosed={onClosed}>
      <Tabs.Navigator tabBarPosition="top" screenOptions={{ animation: 'fade' }}>
        <Tabs.Screen
          name="World"
          component={World}
          options={{
            tabBarIcon: 'clock-world-symbolic',
            title: '_World'
          }}
        />
        <Tabs.Screen
          name="Alarm"
          component={Alarm}
          options={{
            tabBarIcon: 'clock-alarm-symbolic',
            title: '_Alarm'
          }}
        />
        <Tabs.Screen
          name="Stopwatch"
          component={Stopwatch}
          options={{
            tabBarIcon: 'clock-stopwatch-symbolic',
            tabBarBadge: 3,
            needsAttention: true,
            title: '_Stopwatch'
          }}
        />
        <Tabs.Screen
          name="Timer"
          component={Timer}
          options={{
            tabBarIcon: 'clock-timer-symbolic',
            title: '_Timer'
          }}
        />
      </Tabs.Navigator>
    </AdwDialog>
  )
}
