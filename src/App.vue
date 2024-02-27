<template v-if="appUser">
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <!-- <v-app dark> -->
    <v-app-bar app dark absolute elevate-on-scroll color="#0e212a">
      <v-app-bar-nav-icon
        v-if="!drawer"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="LAPD Badge"
          class="shrink mr-2"
          contain
          src="../public/img/lapd-badge-192x192.png"
          transition="scale-transition"
          width="40"
        />
      </div>
      <span class="headline font-weight-black" @click="navHome"
        >LAPD Causeway</span
      >
      <v-spacer></v-spacer>
      <v-btn icon v-if="!$vuetify.theme.dark" @click="toggleTheme()">
        <v-icon class="mr-1" color="blue-grey lighten-2">mdi-lightbulb</v-icon>
      </v-btn>
      <v-btn icon v-if="$vuetify.theme.dark" @click="toggleTheme()">
        <v-icon color="yellow darken-3">mdi-lightbulb-outline</v-icon>
      </v-btn>
      <!-- {{ $settings.dense }} -->
      <Settings></Settings>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="$vuetify.breakpoint.mdAndUp"
      app
      dark
    >
      <template v-slot:img="props">
        <v-img src="../public/img/cityhall2.jpg" v-bind="props">
          <div class="fill-height img-gradient2"></div>
        </v-img>
      </template>
      <v-list nav dense shaped>
        <v-list-item>
          <v-list-item-content class="pr-0 mr-0">
            <template v-if="!!appUser?.serial">
              <v-list-item-title
                >{{ appUser.fullName }} #{{ appUser.serial }}</v-list-item-title
              >
              <v-list-item-subtitle
                class="mr-0 pr-0"
                v-text="appUser.rank"
              ></v-list-item-subtitle>
              <v-list-item-subtitle>{{
                appUser.assignment
              }}</v-list-item-subtitle>
            </template>
            <template v-else>
              <v-progress-circular indeterminate></v-progress-circular>
              <v-list-item-subtitle
                class="mr-0 pr-0"
                v-text="`Getting User Info...`"
              ></v-list-item-subtitle>
            </template>
          </v-list-item-content>

          <v-btn
            v-if="drawer && !$vuetify.breakpoint.mdAndUp"
            icon
            dark
            @click="drawer = !drawer"
          >
            <v-icon>mdi-menu-open</v-icon>
          </v-btn>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(link, i) in allLinks"
          :key="i"
          link
          color="accent"
          :to="link.path"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <v-row class="pa-2 ma-2">
          <v-btn color="primary" dark block @click="$msal.signOut()">
            Sign Out
            <v-icon right dark>mdi-logout</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
    <v-footer :inset="true" app>
      <span class="px-3"
        >&copy; {{ new Date().getFullYear() }} - Innovation Management Divsion -
        <span class="caption">#36058</span></span
      >
    </v-footer>
  </v-app>
  <!-- <SwatForm /> -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Settings from "./components/core/Settings.vue";

export default {
  name: "App",
  components: { Settings },
  data: () => ({
    drawer: null,
    menu: false,
  }),
  computed: {
    ...mapGetters({
      allLinks: "allLinks",
      appUser: "User/appUser",
      settings: "User/settings",
    }),
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  methods: {
    ...mapActions({
      buildUser: "User/buildUser",
      getSettings: "User/getUserSettings",
      getIncompleteFis: "Fi/getIncompleteFiFromDb",
    }),
    navHome() {
      if (this.$route.name != "Home") this.$router.push("/");
      this.$vuetify.goTo(0);
    },
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
  watch: {
    msal: {
      handler: function (newVal) {
        if (newVal.graph.profile) {
          this.buildUser(this.msal);
        }
      },
      deep: true,
    },
  },

  async mounted() {
    let user = this.msal.user.userName;
    let serial = user.substring(0, user.indexOf("@"));
    await this.getSettings(serial);
    this.$forceUpdate();
    this.$store.dispatch("getAllEmps");
  },
};
</script>

<style>
.v-text-field input {
  text-transform: uppercase !important;
}

textarea {
  text-transform: uppercase !important;
}

.img-gradient1 {
  background: linear-gradient(
    126deg,
    rgba(15, 29, 35, 1) 0%,
    rgba(15, 29, 35, 0.9396709367340687) 65%,
    rgba(15, 29, 35, 0.6931723372942927) 100%
  );
}

.img-gradient2 {
  background: linear-gradient(
    158deg,
    rgba(15, 29, 35, 1) 3%,
    rgba(15, 29, 35, 0.9620799003195029) 52%,
    rgba(15, 29, 35, 0.6931723372942927) 100%
  );
}

.grad {
  background: linear-gradient(
    23deg,
    rgba(0, 0, 0, 1) 10%,
    rgba(32, 53, 79, 1) 66%,
    rgba(74, 127, 173, 1) 100%
  );
}

.grad-warn {
  background: linear-gradient(
    23deg,
    rgba(0, 0, 0, 1) 10%,
    rgba(176, 44, 30, 1) 66%,
    rgba(242, 94, 3, 1) 100%
  );
}

.grad-error {
  background: linear-gradient(
    23deg,
    rgba(0, 0, 0, 1) 10%,
    rgba(158, 18, 81, 1) 66%,
    rgba(215, 0, 97, 1) 100%
  );
}

.grad-success {
  background: linear-gradient(
    23deg,
    rgba(2, 0, 36, 1) 10%,
    rgba(76, 175, 80, 1) 66%,
    rgba(0, 250, 152, 1) 100%
  );
}
</style>
