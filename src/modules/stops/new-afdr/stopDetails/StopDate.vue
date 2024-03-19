<template>
	<v-card>
		<div>
			<h3 class="text-center">
				Date and Time of Stop
			</h3>
		</div>

		<v-divider></v-divider>
		<v-card-text>
			<v-autocomplete
				ref="ac"
				outlined
				label="Incident Number"
				:items="incidents"
				:loading="isLoading"
				v-model="selected"
				:search-input.sync="search"
				item-text="id"
				item-value="id"
				return-object
			></v-autocomplete>
			<v-col cols="12" sm="10" md="8">
				<v-dialog ref="dateDialog" v-model="dateModal" :return-value.sync="date" persistent width="290px">
					<template v-slot:activator="{ on, attrs }">
						<v-text-field outlined v-model="stopDateFormatted" label="Date" append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
					</template>
					<v-date-picker v-model="date" scrollable>
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
						<v-btn text color="primary" @click="$refs.dateDialog.save(date)">OK</v-btn>
					</v-date-picker>
				</v-dialog>
			</v-col>
			<v-col cols="12" sm="10" md="8">
				<v-dialog ref="timeDialog" v-model="timeModal" :return-value.sync="time" persistent width="290px">
					<template v-slot:activator="{ on, attrs }">
						<v-text-field outlined v-model="time" label="Time" append-icon="mdi-clock" readonly v-bind="attrs" v-on="on"></v-text-field>
					</template>
					<v-time-picker v-model="time" scrollable format="24hr">
						<v-spacer></v-spacer>
						<v-btn text color="primary" @click="timeModal = false">Cancel</v-btn>
						<v-btn text color="primary" @click="$refs.timeDialog.save(time)">OK</v-btn>
					</v-time-picker>
				</v-dialog>
			</v-col>
			<v-row justify="center" class="mt-0">
				<span class="text-body">Was stop in response to a call for service?</span>
			</v-row>
			<v-row justify="center" class="mt-0 mb-2">
				<v-radio-group dense row v-model="radioCall">
					<v-radio label="No" :value="false"> </v-radio>
					<v-radio label="Yes" :value="true"></v-radio>
				</v-radio-group>
			</v-row>
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
import { mapFields } from "vuex-map-fields";
import { mapActions } from "vuex";
export default {
	props: ["step"],
	data: () => ({
		dateModal: false,
		isLoading: false,
		selected: null,
		stopDate: new Date().toISOString().substr(0, 10),
		incidents: [],
		incs: [],
		timeModal: false,
		stopTime: "",
		search: null,

		// radioCall: false,
	}),

	computed: {
		...mapFields(["stopInfo.date", "stopInfo.time", "stopInfo.radioCall", "stopInfo.incidentNum"]),
		stopDateFormatted() {
			const [year, month, day] = this.date.split("-");
			return `${month}/${day}/${year}`;
		},
	},
	methods: {
		...mapActions(["changeCadIncident"]),
		currentTime() {
			let date = new Date();
			let coeff = 1000 * 60 * 5;
			var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
			var hours = rounded.getHours();
			var mins = rounded.getMinutes();
			if (mins < 10) {
				mins = "0" + mins;
			}
			if (hours < 10) {
				hours = "0" + hours;
			}
			return `${hours}:${mins}`;
		},
		getLocalDate(date) {
			var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
			return newDate.toISOString().substr(0, 10);
		},
	},
	mounted() {
		this.date = this.getLocalDate(new Date());
		this.time = this.currentTime();
		fetch("https://lapd-cdnjs.azurewebsites.us/api/getOfficerIncs?serial=36336")
			.then((response) => response.json())
			.then((data) => (this.incidents = data));
	},
	watch: {
		search(val) {
			if (this.$refs.ac.filteredItems.length == 0) {
				console.log("hitting api again");
			}
		},
		selected(val) {
			this.$store.commit("changeCadIncident", val);
		},
	},
};
</script>

<style></style>
