<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :close-on-click="false"
    max-width="300"
    nudge-width="300"
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </template>
    <v-card outlined class="pa-0">
      <v-toolbar elevation="0" dense> User Preferences </v-toolbar>
      <v-divider></v-divider>
      <v-container class="pa-4">
        <!-- Theme Settings -->
        <div
          class="mb-1 pl-1 text-subtitle-2 font-weight-black text--primary"
          path="theme"
        >
          Theme
        </div>
        <v-item-group v-model="settings.dark" mandatory>
          <v-row justify="space-between">
            <v-col cols="6">
              <v-item v-slot="{ active, toggle }" :value="true">
                <v-card
                  :color="active ? 'blue darken-2' : 'grey darken-2'"
                  dark
                  class="d-flex align-center"
                  height="48"
                  @click="toggle"
                >
                  <v-col col="6" class="flex-grow-1 text-center text-h6">
                    Dark
                  </v-col>
                  <v-col col="6">
                    <v-icon right>mdi-weather-night</v-icon>
                  </v-col>
                </v-card>
              </v-item>
            </v-col>
            <v-col cols="6">
              <v-item v-slot="{ active, toggle }" :value="false">
                <v-card
                  :color="active ? 'blue darken-2' : 'grey darken-2'"
                  dark
                  class="d-flex align-center"
                  height="48"
                  @click="toggle"
                >
                  <v-col col="6" class="flex-grow-1 text-center text-h6">
                    Light
                  </v-col>
                  <v-col col="6">
                    <v-icon right>mdi-white-balance-sunny</v-icon>
                  </v-col>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
          <div class="mt-3 pl-1 text-caption">
            <span class="red--text">*&nbsp;</span>The quick theme toggle
            (<v-icon x-small>mdi-lightbulb</v-icon> icon) temporarily changes
            the theme. The settings chosen here are persistent.
          </div>
        </v-item-group>
        <v-divider class="my-4"></v-divider>

        <!-- Outlined Settings -->
        <v-card flat elevation="0" height="220">
          <div
            class="mb-1 pl-1 text-subtitle-2 font-weight-black text--primary"
          >
            Text field style
          </div>
          <div class="pl-1 text-caption">
            Choosing "Boxed" adds an outline around the text fields
          </div>

          <v-list>
            <v-list-item class="mt-0">
              <v-list-item-action>
                <v-switch
                  v-model="settings.outlined"
                  color="primary"
                ></v-switch>
              </v-list-item-action>
              <v-list-item-title>Boxed</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-row justify="center">
                <v-col cols="12">
                  <v-text-field
                    :dense="settings.dense"
                    :outlined="settings.outlined"
                    readonly
                    persistent-placeholder
                    :label="
                      settings.outlined ? 'This is boxed' : 'Default is unboxed'
                    "
                    :hint="
                      settings.outlined
                        ? 'This may be easier for some to read'
                        : ''
                    "
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <!-- <div class="pl-1 text-caption">This may be easier for some to read.</div> -->
        </v-card>
        <v-divider class="my-4"></v-divider>

        <!-- Density Settings -->
        <v-card flat elevation="0" height="240">
          <div
            class="mb-1 pl-1 text-subtitle-2 font-weight-black text--primary"
            path="theme"
          >
            Text field density
          </div>
          <div class="pl-1 text-caption">
            Choosing "Cozy" makes the text fields a little smaller and brings
            them closer together.
          </div>
          <div class="pl-1 text-caption">
            The result is slightly less scrolling, but slightly more clutter.
          </div>

          <v-list>
            <v-list-item class="mt-0">
              <v-list-item-action>
                <v-switch v-model="settings.dense" color="primary"></v-switch>
              </v-list-item-action>
              <v-list-item-title>Cozy</v-list-item-title>
            </v-list-item>

            <v-list-item>
              <v-row justify="center">
                <v-col cols="6">
                  <v-text-field
                    :dense="settings.dense"
                    :outlined="settings.outlined"
                    readonly
                    persistent-placeholder
                    :label="
                      settings.dense ? 'Default is cozy ' : 'Normal height'
                    "
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :outlined="settings.outlined"
                    readonly
                    persistent-placeholder
                    label="Normal height"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card>
        <v-divider class="my-4"></v-divider>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel()"> Cancel </v-btn>
        <v-btn color="primary" outlined text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SettingsView",
  data: () => ({
    original: null,
    menu: false,
  }),
  computed: {
    ...mapGetters({
      appUser: "User/appUser",
      settings: "User/settings",
    }),
  },
  methods: {
    ...mapActions({
      saveSettings: "User/saveSettings",
    }),
    save() {
      let settings = this.settings;
      settings["serial"] = this.appUser.serial;
      this.saveSettings(settings);
      this.menu = false;
    },
    async cancel() {
      await this.$store
        .dispatch("User/getUserSettings", this.appUser.serial)
        .then((res) => {
          this.original = res;
        });
      this.settings.dark = this.original.dark;
      this.menu = false;
    },
  },
  watch: {
    "settings.dark"(v) {
      this.$vuetify.theme.dark = v;
    },
  },
};
</script>

<style lang="scss" scoped></style>
