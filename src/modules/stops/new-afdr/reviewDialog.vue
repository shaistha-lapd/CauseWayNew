<template>
	<v-dialog v-model="reviewDialog" width="500" persistent>
		<v-card>
			<v-card-title class="headline grey lighten-4">
				<span class="blue--text text--darken-4">Done Entering Data</span>
			</v-card-title>

			<v-card-text>
				You have successfully completed entering the required information for STOPS compliancy. You will be now be taken to the review page where you can verify
				the information you have entered and make any necessary changes. Click the <span class="primary--text text-decoration-underline">"Review"</span> button
				to proceed.
			</v-card-text>

			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" text @click="$emit('review')">
					Review
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: ["reviewDialog"],

	data: () => ({}),
};
</script>

<style></style>
