import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  // lapd dark #0F1D23
  theme: {
    dark: true,
    themes: {
      light: {
        background: "#ced4db",
        secondary: "#20354f",
        primary: "#1f81cc",
        flare: "#d70061",
        error: "#f5393d",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        anchor: "#8c9eff",
        accent: "#FB8C00",
      },
      dark: {
        background: "#212121",
        secondary: "#20354f",
        primary: "#4a7fad",
        flare: "#d70061",
        error: "#f55239",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
        anchor: "#8c9eff",
        accent: "#FB8C00",
      },
    },
  },
  defaults: {
    name: "test",
  },
});
