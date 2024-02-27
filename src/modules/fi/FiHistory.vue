<template>
	<v-container>
		<v-card-title>{{ title }} - #{{ user.serial }}</v-card-title>
		<v-dialog v-model="emptyList" persistent max-width="300">
			<v-card class="grad-warn">
				<v-card-title class="text-h5"> No results </v-card-title>
				<v-card-text
					>The search has returned no results. This could be because no Field Interviews have been submitted by this officer. Click the button below to return
					to the home screen.</v-card-text
				>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text to="/fi" @click="emptyList = false"> Return to Main Menu </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-row dense>
			<v-col xs="12" md="4" xl="3" class="ma-0 pa-1" v-for="fi in fiList" :key="fi.id">
				<SearchResultsCard :mode="$route.params.mode" style="display: inline-block" :fi="fi.fi"> </SearchResultsCard>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import SearchResultsCard from "./search/searchResultsCard.vue";
import { mapGetters } from "vuex";

export default {
	components: { SearchResultsCard },

	data() {
		return {
			fiDialog: false,
			emptyList: false,
			fiList: null,
			overlay: false,
			title: "",
		};
	},
	computed: {
		...mapGetters({
			user: "User/appUser",
		}),
	},

	methods: {
		loadList(user) {
			this.$store.state.loading = true;
			if (this.$route.params.mode == "incompletes") {
				this.$store.dispatch("Fi/getIncompleteFiFromDb", user).then((res) => {
					this.fiList = res;
					this.title = "Incomplete FIs";
					this.$store.state.loading = false;
				});
			} else if (this.$route.params.mode == "recents") {
				this.$store.dispatch("Fi/getUserFis", user).then((res) => {
					this.fiList = res;
					if (this.fiList.length === 0) {
						this.emptyList = true;
					} else {
						this.emptyList = false;
					}
					this.title = "Recently Submitted FIs";
					this.$store.state.loading = false;
				});
			}
		},
	},
	watch: {
		user(val) {
			if (!!val) {
				this.loadList(val);
			}
		},
	},
	created() {
		if (!!this.user) {
			this.loadList(this.user);
		}
	},
};
</script>
<style scoped>
.listHorizontal {
	display: flex;
	justify-content: space-around;
	list-style: none;
}
</style>
