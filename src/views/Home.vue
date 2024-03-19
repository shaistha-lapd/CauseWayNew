<template>
	<v-card class="pa-4 md-8" style="height: 100vh">
		<v-card-title class="text-center justify-center py-6">
			<v-spacer></v-spacer>
			<h1 class="font-weight-bold h4">Main Menu</h1>
			<v-spacer></v-spacer>
		</v-card-title>
		<v-divider></v-divider>

		<v-row wrap class="mt-6">
			<v-col cols="12">
				<DashSpark :type="totals"></DashSpark>
			</v-col>
			<v-col md="6" sm="12">
				<dash-card :type="incomplete"></dash-card>
			</v-col>
			<!-- <v-col md="6" sm="12">
				<dash-card :type="saved"></dash-card>
			</v-col> -->
			<v-col md="6" sm="12">
				<dash-card :type="rejected"></dash-card>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import DashCard from "../modules/fi/dashboard/DashCard.vue";
import DashSpark from "../modules/fi/dashboard/DashSpark.vue";
import { mapGetters } from "vuex";

export default {
	name: "Home",
	components: { DashCard, DashSpark },
	data: () => ({
		totals: {
			type: "spark",
			class: "grad",
			icon: "",
			title: "Completed FIs",
			smallIcon: "mdi-clock",
			smallIconColor: "primary",
			caption: "Last update: ",
			route: "/fi/activity/recents",
			data: "",
		},

		incomplete: {
			type: "card",
			class: "grad-warn",
			icon: "mdi-database-alert",
			title: "Incomplete FIs",
			smallIcon: "mdi-asterisk",
			smallIconColor: "red",
			caption: "Unfinished FIs on this device only. There may be others stored on other computers you have used.",
			route: "/fi/activity/incompletes",
			data: "",
		},
		rejected: {
			type: "card",
			class: "grad-error",
			icon: "mdi-card-bulleted-off-outline",
			title: "FI Kickbacks",
			smallIcon: "mdi-alert",
			smallIconColor: "warning",
			caption: "These FIs were rejected by the server. Please review for any errors and resubmit",
			route: "/fi/activity/incompletes",
			data: "",
		},
		saved: {
			type: "card",
			class: "grad-success",
			icon: "mdi-content-save",
			title: "Saved FIs",
			smallIcon: "mdi-asterisk",
			smallIconColor: "primary",
			caption: "Completed FIs that have been saved to the local device and are ready to submit",
			route: "/fi/activity/saved",
			data: "",
		},
	}),
	computed: {
		...mapGetters({
			appUser: "User/appUser",
		}),
	},
	watch: {
		appUser(v) {
			if (!!v.serial) {
				this.$store.dispatch("Fi/getIncompleteFiFromDb", v).then((res) => (this.incomplete.data = res));
				this.$store.dispatch("Fi/getRejectedFiFromDb", v).then((res) => (this.rejected.data = res));
				this.$store.dispatch("Fi/getDashboardStats", this.appUser.serial).then((res) => (this.totals.data = res));
			}
		},
	},

	created() {
		if (!!this.appUser.serial) {
			this.$store.dispatch("Fi/getIncompleteFiFromDb", this.appUser).then((res) => (this.incomplete.data = res));
			this.$store.dispatch("Fi/getRejectedFiFromDb", this.appUser).then((res) => (this.rejected.data = res));
			this.$store.dispatch("Fi/getDashboardStats", this.appUser.serial).then((res) => (this.totals.data = res));
		}
	},
};
</script>
