// The default import and the attribute are both required: module is NodeNext, and that
// combination rejects named imports from JSON (TS1544) and demands `type: "json"` (TS1543).
import packageJson from '../package.json' with { type: 'json' }

/**
 * The app version, shown in the about dialog and in its debug info, taken from package.json
 * so there is a single number to bump. The deployer reads the same field and splits it at
 * the first "-": "1.11" becomes the upstream version Flatpak accepts, "alpha" becomes the
 * packaging prerelease (1.11~alpha). That is also why the dot of the C demo's 1.11.alpha is
 * a dash here - a dotted version is rejected as an upstream version.
 *
 * The C demo shows `ADW_VERSION_S` in both places instead, but that is the libadwaita version
 * it was built against - 1.9.4 on most systems - so it cannot stand in for the app's number.
 */
export const appVersion = packageJson.version
