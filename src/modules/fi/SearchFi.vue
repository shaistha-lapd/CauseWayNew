<template>
	<v-card flat width="100vw" min-height="100vh">
		<v-toolbar dark color="blue-grey" width="100%" class="mb-4">
			<v-toolbar-title class="mr-3">{{ $vuetify.breakpoint.mdAndUp ? "Field Interview Search" : "Search" }}</v-toolbar-title>
			<v-text-field
				v-model="search"
				:loading="loading"
				cache-items
				class="my-4"
				flat
				hide-details
				label="Keyword search"
				solo-inverted
				prepend-inner-icon="mdi-search-web"
			></v-text-field>
		</v-toolbar>
		<v-card-text v-if="loading">
			<v-progress-linear indeterminate color="primary"></v-progress-linear>
		</v-card-text>
		<v-card-text v-if="noResults"> The search yielded no results. Please try another search. </v-card-text>
		<v-row v-else dense>
			<v-col xs="12" md="4" xl="3" class="ma-0 pa-1" v-for="fi in items" :key="fi.id">
				<SearchResultsCard :mode="'search'" style="display: inline-block" :fi="fi.fi"> </SearchResultsCard>
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import SearchResultsCard from "./search/searchResultsCard.vue";
export default {
	name: "Search",
	components: { SearchResultsCard },
	data: () => ({
		loading: false,
		items: [],
		search: "",
		noResults: false,
	}),
	watch: {
		search(val) {
			if (this.loading) return;
			this.searchFisDebounced(val);
		},
		// items(newVal, oldVal) {
		// 	if (oldVal.length > 0 && newVal.length === 0) this.noResults = true;
		// },
	},
	methods: {
		searchFisDebounced(val) {
			if (val.length < 3) return;
			this.items = [];
			// cancel pending call
			clearTimeout(this._timerId);
			this.loading = true;
			this.noResults = false;

			// delay new call 500ms
			this._timerId = setTimeout(() => {
				const code = "icARAH6fr_l5HjAUbe9VV2RH15OphcQXAGzuhTXBAP4OAzFui_JcEg==";
				fetch(`https://lapd-cdnjs.azurewebsites.us/api/searchByKeyword?code=${code}&keyword=${val.toLowerCase()}`)
					.then((res) => res.json())
					.then((data) => {
						this.items = data.filter((obj, index, arr) => {
							return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === index;
						});

						if (this.items.length == 0) {
							this.noResults = true;
						}
					})
					.catch((err) => {
						console.log(err);
					})
					.finally(() => (this.loading = false));
			}, 750);
		},
	},
};
</script>

<style scoped></style>
