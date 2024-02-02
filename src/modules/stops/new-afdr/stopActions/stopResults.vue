<template>
	<v-card>
		<div>
			<h3 class="text-center">Results of Stop for Person {{ personNum + 1 }}</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text>
			<v-checkbox v-model="noResults" label="No action taken" @change="selectNone"></v-checkbox>
			<v-expand-transition>
				<v-expansion-panels v-if="!noResults" focusable>
					<v-expansion-panel v-for="option in resultOptions" :key="option.category">
						<v-expansion-panel-header>
							{{ option.category }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<div v-for="result in option.results" :key="result.name">
								<v-checkbox hide-details :label="result.name" v-model="stopResults" :value="result"></v-checkbox>
								<v-expand-transition>
									<v-autocomplete
										v-if="result.hasOwnProperty('codes') && stopResults.includes(result)"
										:items="violations"
										item-text="name"
										auto-select-first
										return-object
										v-model="result.codes"
									></v-autocomplete>
								</v-expand-transition>
							</div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-expand-transition>
		</v-card-text>

		<v-card-actions>
			<v-btn outlined @click="$emit('back', step)">
				Back
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="updateResult(), $emit('continue', step)">
				Continue
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapMultiRowFields } from "vuex-map-fields";
import { mapFields } from "vuex-map-fields";
export default {
	props: ["step", "personNum"],

	data: () => ({
		noResults: false,
		stopResults: [],
		vehicleCode: ["22350(A) VC - Speeding"],

		resultOptions: [
			{
				category: "Citation",
				results: [
					{
						name: "Warning (verbal or written)",
						codes: [],
					},
					{
						name: "Citation for infraction",
						codes: [],
					},
					{
						name: "In-field cite and release",
						codes: [],
					},
				],
			},
			{
				category: "Arrest",
				results: [
					{
						name: "Custodial arrest pursuant to outstanding warrant",
						codes: [],
					},
					{
						name: "Custodial Arrest without warrant",
						codes: [],
					},
					{
						name: "In-field cite and release",
						codes: [],
					},
				],
			},
			{
				category: "Other",
				results: [
					{
						name: "Field Interview card completed",
					},
					{
						name: " Noncriminal transport or caretaking transport",
					},
					{
						name: "Contacted parent/legal guardian or other person responsible for the minor",
					},
					{
						name: "Psychiatric hold",
					},
					{
						name: "Contacted U.S. Department of Homeland Security",
					},
				],
			},
		],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
		...mapFields(["violations"]),
	},
	methods: {
		selectNone() {
			this.noResults ? (this.persons[this.personNum].stopResults = ["None"]) : (this.persons[this.personNum].stopResults = []);
		},

		enableField(result) {
			if (this.results.includes(result.name) && result.hasOwnProperty("codes")) {
				return true;
			}
		},
		updateResult() {
			this.persons[this.personNum].stopResults = [...this.stopResults];
		},
	},
};
</script>

<style></style>
