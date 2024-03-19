<template>
	<v-container fill-height class="justify-center">
		<v-card flat height="80vh" width="90%" max-width="600">
			<v-card-title class="text-center justify-center pa-4">
				<h3 class="font-weight-bold h4">Field Interview</h3>
			</v-card-title>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<v-card-title>Choose an Action</v-card-title>
				<v-divider class="mx-4"></v-divider>
				<v-card-text class="mt-4">
					<v-row justify="center">
						<v-col cols="10">
							<v-btn width="80%" large :outlined="this.$vuetify.theme.dark" class="grad" rounded block color="primary lighten-2" dark @click="newFi">
								New Field Interview
								<v-icon right>mdi-file-document-plus</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="10">
							<v-btn width="80%" large :outlined="this.$vuetify.theme.dark" class="grad" rounded block color="primary lighten-2" dark @click="searchFi">
								Search FI's
								<v-icon right>mdi-database-search</v-icon>
							</v-btn>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="10">
							<v-btn width="80%" large :outlined="this.$vuetify.theme.dark" class="grad" color="primary lighten-2" rounded block dark @click="recent"
								>My Recent Activity
								<v-icon right>mdi-history</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
export default {
	name: "FiMenu",

	methods: {
		newFi() {
			this.$store.dispatch("Fi/newFi");
			this.$router.push("/fi/new");
		},
		searchFi() {
			this.$router.push("/fi/search");
		},
		recent() {
			this.$router.push("/fi/activity/recents");
		},
	},
};
</script>
