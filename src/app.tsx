import * as Gtk from "@gtkx/gi/gtk";
import { AdwApplication, AdwApplicationWindow, AdwHeaderBar, AdwToolbarView } from "@gtkx/jsx/adw";
import { GtkBox, GtkButton, GtkLabel } from "@gtkx/jsx/gtk";
import { quit } from "@gtkx/react";
import { useState } from "react";
import { Mail } from './components/DemoWindow.js'
import { NavigationContainer } from '@gtkx/navigation'

const MainWindow = () => {
    const [count, setCount] = useState(0);

    return (
        <AdwApplicationWindow
            title={"GTKX Adwaita Demo"}
            defaultWidth={1000}
            defaultHeight={720}
            onCloseRequest={quit}
        >

                <NavigationContainer>
                    <Mail />
                </NavigationContainer>
            
        </AdwApplicationWindow>
    );
};

export const App = () => (
    <AdwApplication>
        <MainWindow />
    </AdwApplication>
);

export default App;
