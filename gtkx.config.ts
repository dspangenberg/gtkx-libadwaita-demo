import { defineConfig } from "@gtkx/config";

export default defineConfig({
    applicationId: "de.twiceware.gtkx-adwaita",
    applicationIcon: "data/icons",
    deploy: {
        name: "GTKX Adwaita Demo",
        summary: "A GNOME application built with GTKX",
        description: [
            "GTKX Adwaita Demo is a GNOME application built with GTKX on Adwaita and GTK4, with native GObject widgets rendered from React. Replace this paragraph with a description of what your application does.",
        ],
        categories: ["Utility"],
    },
});
