import { defineConfig } from '@gtkx/config'

export default defineConfig({
  applicationId: 'de.twiceware.gtkx-adwaita',
  applicationIcon: 'data/icons',
  deploy: {
    name: 'GTKX Adwaita Demo',
    // The deployer splits at "-": "1.11" becomes the upstream version Flatpak and
    // Debian accept, "alpha" becomes the packaging prerelease (1.11~alpha). A dotted
    // "1.11.alpha" is rejected as an upstream version.
    version: '1.11-alpha',
    summary: 'A GNOME application built with GTKX',
    description: [
      'GTKX Adwaita Demo is a GNOME application built with GTKX on Adwaita and GTK4, with native GObject widgets rendered from React. Replace this paragraph with a description of what your application does.'
    ],
    categories: ['Utility']
  }
})
