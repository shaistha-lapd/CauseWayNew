<template>
  <v-card
    class="mt-4 mx-auto"
    max-width="800"
    @click="$router.push(type.route)"
  >
    <v-sheet
      class="v-sheet--offset mx-auto py-2"
      :class="type.class"
      elevation="12"
      max-width="calc(100% - 32px)"
      min-height="100"
    >
      <v-sparkline
        v-if="values.length > 0"
        :labels="labels"
        :value="values"
        type="bar"
        auto-draw
        :auto-draw-duration="1000"
        line-width="6"
        padding="12"
        class="light-blue--text text--lighten-5"
      ></v-sparkline>
      <v-progress-linear
        v-else
        indeterminate
        color="light-blue lighten-5"
        class="my-12"
        width="calc(80%)"
      ></v-progress-linear>
    </v-sheet>

    <v-card-text class="pt-0">
      <div class="text-h6 font-weight-light">{{ type.title }}</div>
      <div class="subheading font-weight-light grey--text">
        Completed so far this month: {{ getCountForMonth() }}
      </div>
      <v-divider class="my-2"></v-divider>
      <v-icon class="mr-2" small :color="type.smallIconColor"
        >{{ type.smallIcon }}
      </v-icon>
      <span class="text-caption grey--text font-weight-light"
        >Last updated {{ getTimeCheck() }} minutes ago</span
      >
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "DashSpark",
  props: ["type"],
  data: () => ({
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    values: [],
  }),

  methods: {
    getTimeCheck() {
      var date = new Date(this.type.data.ts);
      var now = new Date();
      return parseInt((now.getTime() - date.getTime()) / 1000 / 60 / 60);
    },
    getCountForMonth() {
      var month = new Date().getMonth();
      return this.values[month] - 1;
    },
  },
  watch: {
    "type.data"(val) {
      if (val) {
        var tLabels = [];
        var tVals = [];
        val.data.forEach((stat) => {
          tLabels.push(stat.month);
          tVals.push(stat.fiCount + 1);
        });
        this.labels = tLabels;
        this.values = tVals;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
  margin-bottom: -12px;
}
.value-text {
  font-size: 50%;
  align-items: center;
  justify-items: center;
}
</style>
