<template>
	<v-card>
		<div>
			<h3 class="text-center">
				Assignment Details
			</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text>
			<v-select outlined :items="assignments" v-model="selected" @change="getAssignment" label="Assignment Type"></v-select>

			<v-expand-transition>
				<div v-if="other">
					<v-text-field outlined v-model="assignmentType"></v-text-field>
				</div>
			</v-expand-transition>

			<v-row justify="space-between">
				<v-col cols="5">
					<v-select outlined label="Watch" :items="watches" v-model="watch"></v-select>
				</v-col>
			</v-row>

			<v-row justify="space-between">
				<v-col cols="6">
					<v-dialog ref="sowDialog" v-model="sowModal" :return-value.sync="sow" persistent width="290px">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								outlined
								v-model="sow"
								label="SOW"
								prepend-inner-icon="mdi-clock-time-four-outline"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-time-picker v-if="sowModal" v-model="sow" :allowed-minutes="allowedStep" scrollable format="24hr" full-width>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="sowModal = false">
								Cancel
							</v-btn>
							<v-btn text color="primary" @click="$refs.sowDialog.save(sow)">
								OK
							</v-btn>
						</v-time-picker>
					</v-dialog>
				</v-col>
				<v-col cols="6">
					<v-dialog ref="eowDialog" v-model="eowModal" :return-value.sync="eow" persistent width="290px">
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								outlined
								v-model="eow"
								label="EOW"
								prepend-inner-icon="mdi-clock-time-four-outline"
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-time-picker v-if="eowModal" v-model="eow" :allowed-minutes="allowedStep" scrollable format="24hr" full-width>
							<v-spacer></v-spacer>
							<v-btn text color="primary" @click="eowModal = false">
								Cancel
							</v-btn>
							<v-btn text color="primary" @click="$refs.eowDialog.save(eow)">
								OK
							</v-btn>
						</v-time-picker>
					</v-dialog>
				</v-col>
			</v-row>
		</v-card-text>

		<v-card-actions>
			<v-btn v-if="step > 1" outlined @click="$emit('back', step)">
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
	</v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
	props: ["step"],
	data: () => ({
		selected: "",
		other: false,
		sowModal: false,
		eowModal: false,
		watches: ["W2", "W3", "W4", "W5", "W6", "W7"],
		assignments: [
			"Patrol, Traffic, Field op",
			"Gang Enforcement",
			"Compliance (e.g. Parole)",
			"MTA/Overtime",
			"Special Events (e.g. Sporting Events, Protest)",
			"Roadblock/Checkpoint",
			"Narcotics/Vice",
			"Task Force",
			"K-12 Public School",
			"Investigative/Detective",
			"Other",
		],
	}),
	computed: {
		...mapFields(["watchInfo.assignmentType", "watchInfo.assignment", "watchInfo.watch", "watchInfo.sow", "watchInfo.eow"]),
	},
	methods: {
		getAssignment() {
			if (this.selected === "Other") {
				this.assignmentType = "";
				this.other = true;
			} else {
				this.other = false;
				this.assignmentType = this.selected;
			}
		},
		allowedStep: (m) => m % 15 === 0,
	},
};
</script>
