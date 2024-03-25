/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../stores";
import router from "../routes";
export function registerPlugins(app) {
  loadFonts();
  app.use(vuetify);
  app.use(router).use(pinia);
}
