import App from "./App.vue";
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "@/plugins";
import axios from "axios";
const app = createApp(App);
//para hacer dinamico el window
// app.config.globalProperties.window = window;
window.axios = axios;
window.axios.defaults.baseURL =
  // "http://192.168.0.109/camionesTSJ-api/public/api/";
  "http://192.168.0.110/api-registro-camiones-tsj/public/api/";
// "https://registro-camiones.sisinte.com/api/public/api/";
// window.axios.defaults.headers.common["Accept"] = "application/json";
// window.axios.defaults.headers.common["Content-Type"] = "application/json";
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common["APP-VERSION"] = "1.6.3";
window.appVersion = window.axios.defaults.headers.common["APP-VERSION"];

registerPlugins(app);
app.mount("#app");
