<template>
	<v-card>
		<div>
			<h3 class="text-center">Actions Taken for Person {{ personNum + 1 }}</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text>
			<v-checkbox v-model="noAction" label="No action taken" @change="selectNone"></v-checkbox>
			<v-expand-transition>
				<v-expansion-panels v-if="!noAction" focusable>
					<v-expansion-panel v-for="t in taken" :key="t.category">
						<v-expansion-panel-header>
							{{ t.category }}
						</v-expansion-panel-header>
						<v-expansion-panel-content>
							<v-checkbox hide-details v-for="act in t.actions" :key="act" v-model="persons[personNum].stopActions" :label="act" :value="act"></v-checkbox>
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
		noAction: false,
		actions: [],
		taken: [
			{
				category: "Removed from Vehicle/Vehicle Impounded",
				actions: ["Person removed from vehicle by order", "Person removed from vehicle by physical contact", "Vehicle impounded"],
			},
			{
				category: "Detention",
				actions: ["Curbside detention", "Handcuffed for flex cuffed", "Patrol car detention", "Field sobriety test conducted", "Person Photographed"],
			},
			{
				category: "Search",
				actions: [
					"Asked for consent to search person",
					"Search of person was conducted",
					"Asked for consent to search property",
					"Search of property was conducted",
				],
			},
			{
				category: "Show/Use of Force",
				actions: [
					"Firearm pointed at person",
					"Firearm discharged or used",
					"Electronic control device used",
					"Impact projectile discharged or used",
					"Baton or other impact weapon used",
					"Chemical spray used",
					"Other physical or vehicle contact",
				],
			},
			{
				category: "Canine",
				actions: ["Canine removed from vehicle or used to search", "Canine bit or held person"],
			},
		],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
	methods: {
		selectNone() {
			this.noAction ? (this.persons[this.personNum].stopActions = ["None"]) : (this.persons[this.personNum].stopActions = []);
		},
	},
};
</script>

<style scoped></style>
