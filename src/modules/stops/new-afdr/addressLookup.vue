<template>
	<v-autocomplete
		v-model="loc"
		:items="items"
		:loading="isLoading"
		:search-input.sync="search"
		color="primary"
		hide-no-data
		hide-selected
		item-text="Description"
		item-value="API"
		label="Address Search"
		placeholder="Start typing to Search"
		prepend-icon="mdi-map-search"
		return-object
	></v-autocomplete>
</template>

<script>
export default {
	data: () => ({
		loc: null,
		search: null,
		response: null,
		isLoading: false,
		entries: null,
		items: [],
	}),
	watch: {
		search(val) {
			// Items have already been loaded
			if (this.items.length > 0) return;

			// Items have already been requested
			if (this.isLoading) return;

			this.isLoading = true;

			// Lazily load input items
			fetch("http://incidents.lapd.lacity.org/incidents/UtlSvc.asmx/GetAddresses", {
				method: "POST",
				body: JSON.stringify(`{"prefixText":"${val}","contextKey":""}`),
				// prettier-ignore
				headers: {
					"Content-Type": "application/json",
					"Origin": "https://pubapps.lapd.lacity.org",
					"Referer": "https://pubapps.lapd.lacity.org/test/afdrMain.html",
                    "Sec-Fetch-Site" : "cross-site"
				}
			})
				.then((res) => res.json())
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => (this.isLoading = false));
		},
	},
};
</script>

<style lang="scss" scoped></style>
