<template>
	<div>
		<v-card-subtitle> Officer Information </v-card-subtitle>
		<v-divider></v-divider>
	
		<v-card-text>
			<v-row  justify="center">
				<v-col cols="11">
					<v-text-field
						readonly
						append-outer-icon="mdi-account-edit"
						outlined
						@click:append-outer="changeOfficer('officer1')"
						:value="getOfficerName(watchInfo.officer1)"
					></v-text-field>
				</v-col>
			</v-row>
			<v-row  justify="center">
				<v-col cols="8">
					<v-text-field
						outlined
						v-model.number="watchInfo.yearsExperience"
						label="Years experience"
						append-outer-icon="mdi-plus"
						@click:append-outer="watchInfo.yearsExperience++"
						prepend-icon="mdi-minus"
						@click:prepend="watchInfo.yearsExperience--"
						class="centered-input"
						type="number"
					>
					</v-text-field>
				</v-col>
			</v-row>
			<div v-if="watchInfo.additionalOfficers.length">
				<v-row class=" ml-4 mb-4">
					<h3>{{ partner }}</h3>
				</v-row>
				<v-row v-for="(ofcr, index) in watchInfo.additionalOfficers" :key="ofcr.SerialNumber" no-gutters  justify="center">
					<v-col cols="11" class="my-0">
						<v-text-field
							readonly
							append-outer-icon="mdi-account-remove"
							outlined
							@click:append-outer="removeOfficer(index)"
							:value="getOfficerName(ofcr)"
						></v-text-field>
					</v-col>
				</v-row>
			</div>
			<v-row justify="center">
				<v-btn color="primary" outlined @click="ofcrDialog = true"
					>Add Officer
					<v-icon color="success" class="ml-2">mdi-account-plus-outline</v-icon>
				</v-btn>
				<OfficerDialog :dialog="ofcrDialog" :target="target" @close="closeDialog"></OfficerDialog>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-btn v-if="step > 1" text @click="$emit('back', step)">
				Back
			</v-btn>
			<v-btn v-else color="red" outlined to="/">
				Cancel
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="$emit('continue', step)">
				Continue
			</v-btn>
		</v-card-actions>
	</div>
</template>

<script>

import { mapMutations } from "vuex";
import OfficerDialog from "../officerDialog.vue";

export default {
	components: {
		OfficerDialog,
	},
	props: ["step", "watchInfo"],

	data: () => ({
		ofcrDialog: false,
		target: "",
	}),
	computed: {		

		partner() {
			if (this.watchInfo.additionalOfficers.length === 1) return "Partner:";
			else if (this.watchInfo.additionalOfficers.length > 1) return "Partners:";
		},
	},
	methods: {
		...mapMutations(["removeOfficer"]),

		getOfficerName(ofcr) {
			let last = ofcr.LastName;
			let first = ofcr.FirstName;
			let serial = ofcr.SerialNumber;
			first = first.substring(0, 1) + ".";
			return `${last}, ${first} #${serial}`;
		},
		changeOfficer(source) {
			this.target = source;
			this.ofcrDialog = true;
		},
		closeDialog() {
			this.ofcrDialog = false;
		},
		increment() {
			this.watchInfo.yearsExperience++;
		},
	},
};
</script>

<style scoped>
.centered-input >>> input {
	text-align: center;
}
</style>
