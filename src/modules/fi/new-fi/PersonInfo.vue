<template>
	<div>
		<v-card-subtitle> Personal Information </v-card-subtitle>
		<v-divider></v-divider>
		<v-card-text>
			<v-form ref="person1" v-model="valid">
				<v-row>
					<v-col cols="8">
						<v-text-field
							v-model="person.idNumber"
							autocomplete="new-password"
							label="ID Number"
							:dense="settings.dense"
							:outlined="settings.outlined"
							:rules="idRules"
							@blur="person.idNumber = person.idNumber.toUpperCase()"
						></v-text-field>
					</v-col>
					<v-col cols="4">
						<v-select
							v-model="person.idState"
							:items="lookups.states"
							item-text="abbreviation"
							item-value="abbreviation"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="State"
							:rules="stateRule"
							required
						></v-select>
					</v-col>
				</v-row>
				<v-row dense>
					<v-col cols="8">
						<v-text-field
							v-model="person.lastName"
							autocomplete="new-password"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Last Name"
							:rules="nameRules"
							required
							@blur="person.lastName = person.lastName.toUpperCase()"
						></v-text-field>
					</v-col>
					<v-col cols="4">
						<v-select v-model="person.suffix" :items="lookups.suffixes" :dense="settings.dense" :outlined="settings.outlined" label="Suffix"></v-select>
					</v-col>
				</v-row>
				<v-row dense>
					<v-col cols="6">
						<v-text-field
							v-model="person.firstName"
							autocomplete="new-password"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="First Name"
							:rules="nameRules"
							required
							@blur="person.firstName = person.firstName.toUpperCase()"
						></v-text-field>
					</v-col>
					<v-col cols="6">
						<v-text-field
							v-model="person.middleName"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Middle Name"
							@blur="person.middleName = person.middleName.toUpperCase()"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row dense justify="center">
					<v-col cols="5">
						<v-dialog ref="dialog" v-model="dateModal" :return-value.sync="person.dobISO" persistent width="290px">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="person.dobFormatted"
									label="DOB"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
									:dense="settings.dense"
									:outlined="settings.outlined"
									required
									:rules="[(v) => !!v || 'DOB is required']"
									@click="person.dobISO = ''"
								></v-text-field>
							</template>
							<v-card>
								<v-date-picker
									v-model="person.dobISO"
									ref="picker"
									header-color="primary"
									:active-picker="activePicker"
									:max="new Date().toISOString().substring(0, 10)"
								>
									<v-col cols="6">
										<v-btn text color="error" @click="dateModal = false"> Cancel </v-btn>
									</v-col>
									<v-spacer></v-spacer>
									<v-col cols="6">
										<v-btn text color="primary" @click="$refs.dialog.save(person.dobISO)" :disabled="!person.dobISO"> OK </v-btn>
									</v-col>
								</v-date-picker>
								<v-card-actions>
									<v-col cols="10" class="mx-auto">
										<v-text-field
											v-model="person.dobFormatted"
											label="Manual entry"
											hint="MM/DD/YYYY"
											v-mask="'##/##/####'"
											@blur="getManualDate(person.dobFormatted)"
											:rules="[(v) => !!v || 'DOB is required']"
										></v-text-field>
									</v-col>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-col>
				</v-row>

				<v-row dense justify="space-between">
					<v-col cols="5">
						<v-select
							v-model="person.gender"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Gender"
							:items="lookups.genders"
							item-text="name"
							item-value="abbreviation"
							return-object
							:rules="selectRules"
						></v-select>
					</v-col>
					<v-col cols="5">
						<v-select
							v-model="person.descent"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Descent"
							:items="lookups.races"
							item-text="name"
							item-value="abbreviation"
							return-object
							:rules="selectRules"
						></v-select>
					</v-col>
				</v-row>
				<v-row dense justify="space-between">
					<v-col cols="5">
						<v-select
							v-model="person.hairColor"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Hair Color"
							:items="lookups.hairColors"
							item-text="name"
							item-value="abbreviation"
							return-object
							required
							:rules="[(v) => !!v || 'Hair color is required']"
						></v-select>
					</v-col>
					<v-col cols="5">
						<v-select
							v-model="person.eyeColor"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Eye Color"
							:items="lookups.eyeColors"
							item-text="name"
							item-value="abbreviation"
							return-object
							required
							:rules="[(v) => !!v || 'Eye color is required']"
						></v-select>
					</v-col>
				</v-row>
				<v-row dense justify="space-between">
					<v-col cols="5">
						<v-text-field
							v-model="person.height"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Height"
							inputmode="numeric"
							maxlength="3"
							v-mask="hMask"
							required
							:rules="[(v) => !!v || 'Height is required']"
						></v-text-field>
					</v-col>
					<v-col cols="5">
						<v-text-field
							v-model="person.weight"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Weight"
							inputmode="numeric"
							maxlength="3"
							v-mask="'###'"
							required
							:rules="[(v) => !!v || 'Weight is required', (v) => (v >= 10 && v <= 495) || 'Valid weight range is 10-495 lbs']"
						></v-text-field>
					</v-col>
				</v-row>
			</v-form>
		</v-card-text>
		<v-divider></v-divider>
		<v-card-actions class="mt-4">
			<v-btn v-if="step > 1" text @click="$emit('backStep', step)"> Back </v-btn>
			<v-btn v-else color="red" outlined @click="$emit('reset')"> Cancel </v-btn>
			<v-spacer></v-spacer>
			<v-btn :disabled="!valid" color="primary" @click="$emit('advanceStep', step)"> Continue </v-btn>
		</v-card-actions>
	</div>
</template>

<script>
import { datetime } from "../../../mixins/datetime";

export default {
	props: ["step", "person", "lookups", "scanned", "settings"],
	mixins: [datetime],
	data: () => ({
		activePicker: null,
		valid: false,
		nameRules: [(v) => !!v || "Name is required", (v) => (v && v.length > 1) || "Name must be at least 2 letters"],
		selectRules: [(v) => !!v || "A value must be selected"],
		manualDate: "",
		dateModal: false,
	}),
	computed: {
		stateRule() {
			const rules = [];
			if (!!this.person.idNumber) {
				const rule = (v) => !!v || "State is required";
				rules.push(rule);
			}
			return rules;
		},
		idNumberMask() {
			if (this.person.idState === "CA") {
				return "A#######";
			}
		},
		idRules() {
			const rules = [];
			if (this.person.idState === "CA") {
				const rule = (v) => /[A-Z]\d{7}$/.test(v) || "CA ID must be in the following format: A1234567";
				rules.push(rule);
			}
			return rules;
		},
		hMask() {
			if (this.person.height[1] == 0) {
				return [/^[1-8]/, /^[0-1]/, /^[0-9]/];
			}
			return [/^[1-8]/, /^[0-1]/, /^[0-1]/];
		},
	},

	watch: {
		dateModal(val) {
			val && this.$nextTick(() => (this.activePicker = "YEAR"));
		},
		"person.dobISO"(val) {
			this.person.dobFormatted = this.formatDate(val);
		},
		scanned(val) {
			if (val == true) {
				this.$refs.person1.validate();
			}
		},
	},
	methods: {
		getManualDate(val) {
			if (val.length < 10) return;
			this.person.dobISO = this.convertToISO(val);
		},
	},
	// mounted() {
	// 	this.$refs.person1.resetValidation();
	// },
};
</script>

<style></style>
