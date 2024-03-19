<template>
	<v-card>
		<div>
			<h2 class="text-center">
				Review and Submit
			</h2>
		</div>
		<v-divider></v-divider>
		<v-card-text v-if="stops.length < 1">
			No stops have been completed yet....
		</v-card-text>
		<v-card-text v-for="(stop, index) in stops" :key="index">
			<pre>{{ stop }}</pre>
			<v-divider></v-divider>
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn link to="/" color="primary">Return to Main Menu</v-btn>
			<v-spacer></v-spacer>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
	data: () => ({}),
	computed: {
		...mapFields(["stops"]),
	},
};
</script>

<style></style>
