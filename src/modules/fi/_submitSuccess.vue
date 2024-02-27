<template>
	<v-dialog v-model="show" max-width="500">
		<v-card raised dark class="grad">
			<v-card-title primary-title>
				Success!
				<v-spacer></v-spacer>
				<v-avatar>
					<v-icon x-large color="light-green lighten-3">mdi-thumb-up</v-icon>
				</v-avatar>
			</v-card-title>
			<v-card-text>{{ showNotification(1) }}</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn color="accent" text outlined @click="returnHome()">Home Screen</v-btn>
				<v-spacer></v-spacer>
				<v-btn color="accent " text outlined @click="startNew()">FI Menu</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	name: "SubmitSuccess",

	data() {
		return {
			dialogBody: "FI was submitted",
		};
	},
	computed: {
		...mapGetters({
			show: "Fi/showSuccess",
		}),
	},
	methods: {
		showNotification(count) {
			if (count === 1) {
				return `1 FI was submitted.`;
			} else return `${count} FI's were submitted.`;
		},
		startNew() {
			this.$router.replace("/fi");
			this.$store.commit("Fi/TOGGLE_SUCCESS_DIALOG");
			this.$store.dispatch("Fi/newFi");
		},
		returnHome() {
			this.$router.replace("/");
			this.$store.commit("Fi/TOGGLE_SUCCESS_DIALOG");
		},
	},
};
</script>
