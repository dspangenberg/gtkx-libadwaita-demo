import { AdwStatusPage } from '@gtkx/jsx/adw'

export const Welcome = () => {
  return (
    <AdwStatusPage
      iconName="welcome-symbolic"
      title="Welcome to GTKX Adwaita Demo"
      description="This is a tour of the features the library has to offer."
    />
  )
}
