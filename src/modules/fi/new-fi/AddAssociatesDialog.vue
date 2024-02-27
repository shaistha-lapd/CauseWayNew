<template>
	<v-dialog ref="assocModal" v-model="assocModal" max-width="600px" persistent>
		<template v-slot:activator="{ on, attrs }">
			<v-btn icon v-bind="attrs" v-on="on">
				<v-icon color="accent">mdi-account-multiple-plus-outline</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title>
				<span class="headline">Associates</span>
			</v-card-title>

			<v-card-text>
				<v-form ref="assocForm" v-model="valid">
					<v-row dense>
						<v-col cols="6">
							<v-text-field
								v-model="assoc.lastName"
								:dense="settings.dense"
								:outlined="settings.outlined"
								autocomplete="new-password"
								label="Last Name"
								required
								:rules="nameRules"
								@blur="assoc.lastName = assoc.lastName.toUpperCase()"
							></v-text-field>
						</v-col>
						<v-col cols="6">
							<v-text-field
								v-model="assoc.firstName"
								:dense="settings.dense"
								:outlined="settings.outlined"
								autocomplete="new-password"
								label="First Name"
								required
								:rules="nameRules"
								@blur="assoc.firstName = assoc.firstName.toUpperCase()"
							></v-text-field>
						</v-col>
					</v-row>
					<v-row dense justify="space-between">
						<v-col cols="4">
							<v-select
								v-model="assoc.gender"
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
							<v-dialog ref="dialog" v-model="dateModal" :return-value.sync="assoc.dobISO" persistent width="290px">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model="assoc.dobFormatted"
										label="DOB"
										prepend-icon="mdi-calendar"
										readonly
										v-bind="attrs"
										v-on="on"
										:dense="settings.dense"
										:outlined="settings.outlined"
										required
										:rules="[(v) => !!v || 'DOB is required']"
										@click="assoc.dobISO = ''"
									></v-text-field>
								</template>
								<v-card>
									<v-date-picker
										v-model="assoc.dobISO"
										ref="picker"
										header-color="primary"
										:active-picker="activePicker"
										required
										:rules="[(v) => !!v || 'DOB is required']"
										:max="new Date().toISOString().substring(0, 10)"
									>
										<v-col cols="6">
											<v-btn text color="error" @click="dateModal = false"> Cancel </v-btn>
										</v-col>
										<v-spacer></v-spacer>
										<v-col cols="6">
											<v-btn text color="primary" @click="$refs.dialog.save(assoc.dobISO)"> OK </v-btn>
										</v-col>
									</v-date-picker>
									<v-card-actions>
										<v-col cols="10" class="mx-auto">
											<v-text-field
												v-model="assoc.dobFormatted"
												label="Manual entry"
												hint="MM/DD/YYYY"
												v-mask="'##/##/####'"
												@blur="getManualDate(assoc.dobFormatted)"
											></v-text-field>
										</v-col>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-col>
					</v-row>
					<v-row dense justify="center">
						<v-col cols="6">
							<v-text-field
								v-model="assoc.aka"
								:dense="settings.dense"
								:outlined="settings.outlined"
								label="Alias/Moniker"
								@blur="assoc.aka = assoc.aka.toUpperCase()"
							></v-text-field>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn color="red" outlined @click="closeDialog()"> Cancel </v-btn>
				<v-spacer></v-spacer>
				<v-btn :disabled="!valid" color="primary" @click="$refs.assocModal.save(saveAssoc())">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { datetime } from "../../../mixins/datetime";
export default {
	props: ["lookups", "settings"],
	mixins: [datetime],
	data() {
		return {
			valid: false,
			assocModal: false,
			nameRules: [(v) => !!v || "Name is required", (v) => (v && v.length > 1) || "Name must be at least 2 letters"],
			selectRules: [(v) => !!v || "A value must be selected"],
			manualDate: "",
			dateModal: false,
			activePicker: null,
			assoc: {
				lastName: "",
				firstName: "",
				dobISO: "",
				dobFormatted: "",
				aka: "",
				gender: "",
			},
		};
	},
	watch: {
		dateModal(val) {
			val && this.$nextTick(() => (this.activePicker = "YEAR"));
		},
		"assoc.dobISO"(val) {
			this.assoc.dobFormatted = this.formatDate(val);
		},
	},

	methods: {
		closeDialog() {
			this.$refs.assocForm.reset();
			this.assocModal = false;
		},
		saveAssoc() {
			this.$emit("pushAssoc", this.assoc);
		},
		getManualDate(val) {
			if (!val || val.length < 10) return;
			this.assoc.dobISO = this.convertToISO(val);
		},
	},
};
</script>
