<template>
	<v-card>
		<div>
			<h3 class="text-center">Was Any Evidence of Contraband Discovered for Person {{ personNum + 1 }}?</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text>
			<v-checkbox hide-details v-model="noEvidence" label="None discovered" @change="selectNone"></v-checkbox>
			<v-expand-transition>
				<div v-if="!noEvidence">
					<v-checkbox hide-details v-for="evid in evidence" :key="evid" v-model="persons[personNum].evidence" :label="evid" :value="evid"></v-checkbox>
				</div>
			</v-expand-transition>
		</v-card-text>

		<v-card-actions>
			<v-btn outlined @click="$emit('back', step)">
				Back
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="$emit('continue', step)">
				Continue
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapMultiRowFields } from "vuex-map-fields";
export default {
	props: ["step", "personNum"],

	data: () => ({
		noEvidence: false,
		stopEvidence: [],
		evidence: [
			"Firearm(s)",
			"Ammunition",
			"Weapon(s) other than a firearm",
			"Drgus/narcotics",
			"Alcohol",
			"Money",
			"Drug Paraphernalia",
			"Suspected stolen property",
			"Cell phone(s) or electronic device(s)",
			"Other contraband or evidence",
		],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
	methods: {
		selectNone() {
			this.noEvidence ? (this.persons[this.personNum].evidence = ["None"]) : (this.persons[this.personNum].evidence = []);
		},
	},
};
</script>

<style></style>
