import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { createVuetify } from "vuetify";
import "vuetify/dist/vuetify.css";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";
import { PublicClientApplication } from "@azure/msal-browser";

const app = createApp(App);

const vuetify = createVuetify();

const msalInstance = new PublicClientApplication({
  auth: {
  //z  clientId: "314c8cad-c1be-47d7-a62c-ca0f6a0bedc4",
    // authority:
    //   "https://login.microsoftonline.com/642fd61c-34dd-4fd0-af8d-443576485883",
   // redirectUri: "http://localhost:8080",
   tenantId: "642fd61c-34dd-4fd0-af8d-443576485883",
   clientId: "314c8cad-c1be-47d7-a62c-ca0f6a0bedc4",
   // redirectUri: "https://localhost:8080", //dev
   redirectUri: "https://causeway.lapd.tech", //live 
   navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
});

app.config.globalProperties.$msalInstance = msalInstance;

app.component("vuetify-google-autocomplete", VuetifyGoogleAutocomplete);

app.use(vuetify);
app.use(store);
app.use(router);

app.mount("#app");
