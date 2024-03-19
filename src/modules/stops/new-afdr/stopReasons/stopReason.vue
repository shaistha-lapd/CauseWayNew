<template>
	<v-card color="background">
		<div>
			<h3 class="text-center">Reason For Stop - Person {{ personNum + 1 }}</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text class="pa-3">
			<v-radio-group v-model="persons[personNum].stopReason">
				<v-card class="pa-3 mb-2" min-height="56" outlined v-for="r in reasons" :key="r.name">
					<v-radio class="py-auto" color="primary" @change="check(r.name)" :value="r.name">
						<template v-slot:label>
							<div>
								<strong>{{ r.name }}</strong>
							</div>
						</template>
					</v-radio>
					<div v-if="r.name == 'Traffic Violation'">
						<v-expand-transition>
							<v-card-text v-show="show" class="mt-0 pt-0">
								<v-radio-group dense v-model="persons[personNum].stopReason" class="mt-0 pt-0">
									<v-radio v-for="v in trafViols" :key="v" :label="v" :value="v"></v-radio>
								</v-radio-group>
								<v-autocomplete
									:items="violations"
									item-text="name"
									auto-select-first
									return-object
									v-model="persons[personNum].stopCode"
									label="Code Violation"
									class="mt-0 pt-0"
								></v-autocomplete>
							</v-card-text>
						</v-expand-transition>
					</div>
					<div v-if="r.name == 'Reasonable Suspicion'">
						<v-expand-transition>
							<v-card-text v-show="show2" class="mt-0 pt-0">
								<v-checkbox v-for="rs in rsCodes" :key="rs" v-model="persons[personNum].suspicionBasis" :label="rs" :value="rs" dense> </v-checkbox>
								<v-autocomplete
									:items="violations"
									item-text="name"
									auto-select-first
									v-model="persons[personNum].stopCode"
									return-object
									label="Code Violation"
									class="mt-0 pt-0"
								></v-autocomplete>
							</v-card-text>
						</v-expand-transition>
					</div>
				</v-card>
			</v-radio-group>
			<v-textarea outlined row-height="2" auto-grow label="Explanation of Stop" v-model="persons[personNum].stopExplanation" counter="250"></v-textarea>
		</v-card-text>
		<v-divider></v-divider>
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
import { mapFields } from "vuex-map-fields";
import { mapMultiRowFields } from "vuex-map-fields";
export default {
	props: ["step", "personNum"],

	data: () => ({
		show: false,
		show2: false,
		subgroup: "",
		basis: [],
		reason: "Traffic Violation",
		trafViols: ["Moving Violation", "Equipment Violation", "Non-Moving/Registration Violation"],
		rsCodes: [
			"Officer witnessed commision of a crime",
			"Matched suspect description",
			"Witness or Victim identification of Suspect at the scene",
			"Carrying suspicious object",
			"Actions indicative of casing a victim or location",
			"Suspected of acting as lookout",
			"Actions indicative of drug transaction",
			"Actions indicative of engaging in a violent crime",
			"Other reasonable suspicion of a crime",
		],
		educationCodes: ["48900"],
		reasons: [
			{ name: "Traffic Violation", checked: false },
			{ name: "Reasonable Suspicion", checked: false },
			{ name: "Parole/Probation", checked: false },
			{ name: "Arrest Warrant/Wanted Person", checked: false },
			{ name: "Truancy Investigation", checked: false },
			{ name: "Consensual Encounter", checked: false },
			{ name: "Education Code Violation", checked: false },
			{ name: "School Policy Violation", checked: false },
			{ name: "Possible danger to self & others/5150 WIC ", checked: false },
		],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
		...mapFields(["violations"]),
	},
	methods: {
		check(i) {
			this.persons[this.personNum].stopCode = "";

			i === "Traffic Violation" ? (this.show = true) : (this.show = false);
			i === "Reasonable Suspicion" ? (this.show2 = true) : (this.show2 = false);
		},
	},
};
</script>

<style></style>
