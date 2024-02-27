import Vue from "vue"
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { Icon } from "leaflet";
import VueMask from "v-mask";
import db from "./storage.js";
import VueZxingScanner from "vue-zxing-scanner";
import msal from "vue-msal";
import "leaflet/dist/leaflet.css";

Vue.prototype.$settings = () => {
  let settings = { ...store.getters["User/settings"] };
  return Vue.observable(settings);
};

Vue.directive("uppercase", {
  inserted: function (el, _, vnode) {
    el.addEventListener("input", async function (e) {
      e.target.value = e.target.value.toUpperCase();
      vnode.componentInstance.$emit("input", e.target.value.toUpperCase());
    });
  },
});

Vue.use(VueMask);
Vue.use(db);
Vue.use(VueZxingScanner);
Vue.use(msal, {
  auth: {
    tenantId: "642fd61c-34dd-4fd0-af8d-443576485883",
    clientId: "314c8cad-c1be-47d7-a62c-ca0f6a0bedc4",
    // redirectUri: "https://localhost:8080", //dev
    redirectUri: "https://causeway.lapd.tech", //live
    requireAuthOnInitialize: true,
    navigateToLoginRequestUrl: true,
  },
  request: {
    scopes: ["user.read"],
  },
  framework: {
    globalMixin: true,
  },
  graph: {
    callAfterInit: true,
    endpoints: {
      profile: "/me",
    },
  },
  cache: {
    cacheLocation: "localStorage",
  },
});

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: "AIzaSyBjLCbmZzo_A5J12qxN_-PZezC2xNWTPRQ",
  installComponents: true,
  vueGoogleMapsCompatibility: false,
});

Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);

Vue.config.productionTip = false;

// this part resolves an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
