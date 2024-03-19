<template>
	<div>
		<v-card-subtitle> Personal Information <span class="caption grey--text">- Continued</span> </v-card-subtitle>
		<v-divider></v-divider>

		<v-card-text>
			<v-card>
				<v-toolbar dark dense color="secondary">
					<v-toolbar-title dark>Addresses</v-toolbar-title>
					<v-spacer></v-spacer>
					<AddAddressDialog :key="person.addresses.length" :addressTypes="addressTypes" :settings="settings" @pushAddress="pushAddress"></AddAddressDialog>
				</v-toolbar>
				<v-list v-if="person.addresses.length !== 0">
					<div v-for="(address, i) in person.addresses" :key="i">
						<v-list-item>
							<v-list-item-avatar>
								<v-icon :color="addressTypes.find((a) => a.name === address.type).color">{{ addressTypes.find((a) => a.name === address.type).icon }}</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title class="body-2" v-text="address.formattedAddress"></v-list-item-title>

								<v-list-item-subtitle class="caption" v-text="`${address.city} ${address.state}, ${address.zip}`"></v-list-item-subtitle>
							</v-list-item-content>

							<v-list-item-action>
								<v-btn icon @click="deleteAddress(i)">
									<v-icon color="red">mdi-delete</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider v-if="i < person.addresses.length - 1" :key="i"></v-divider>
					</div>
				</v-list>
			</v-card>

			<v-card class="mt-4 mb-6">
				<v-toolbar dark dense color="#004056">
					<v-toolbar-title dark>Phones</v-toolbar-title>
					<v-spacer></v-spacer>
					<AddPhoneDialog :key="person.phones.length" :phoneTypes="phoneTypes" :settings="settings" @pushPhone="pushPhone"></AddPhoneDialog>
				</v-toolbar>
				<v-list v-if="person.phones.length !== 0">
					<div v-for="(phone, i) in person.phones" :key="i">
						<v-list-item>
							<v-list-item-avatar>
								<v-icon :color="phoneTypes.find((p) => p.name === phone.type).color">{{ phoneTypes.find((p) => p.name === phone.type).icon }}</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-text="phone.formattedNumber"></v-list-item-title>
							</v-list-item-content>

							<v-list-item-action>
								<v-btn icon @click="deletePhone(i)">
									<v-icon color="red">mdi-delete</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider v-if="i < person.phones.length - 1" :key="i"></v-divider>
					</div>
				</v-list>
			</v-card>

			<v-form ref="person2" v-model="valid2">
				<v-row dense class="mt-2">
					<v-text-field
						v-model="person.clothing"
						:dense="settings.dense"
						:outlined="settings.outlined"
						label="Clothing"
						required
						:rules="[(v) => !!v || 'Clothing description is required']"
						@blur="(val) => (person.clothing = person.clothing.toUpperCase())"
					></v-text-field>
				</v-row>
				<v-row dense>
					<v-text-field
						v-model="person.oddities"
						:dense="settings.dense"
						:outlined="settings.outlined"
						label="Personal Oddities"
						@blur="(val) => (person.oddities = person.oddities.toUpperCase())"
					></v-text-field>
				</v-row>
				<!-- <v-row dense>
					<v-text-field
						v-model="person.alias"
						:dense="settings.dense"
						:outlined="settings.outlined"
						label="Alias/Nickname"
						@blur="(val) => (person.alias = person.alias.toUpperCase())"
					></v-text-field>
				</v-row>
				<v-row dense>
					<v-combobox
						v-model="person.gang"
						:items="gangNames"
						:dense="settings.dense"
						:outlined="settings.outlined"
						clearable
						label="Gang/Club"
						@focus="getGangNames"
					></v-combobox>
				</v-row> -->

				<v-item-group multiple v-model="person.activities" class="mt-2">
					<v-container>
						<v-row class="mb-4">
							<v-col v-for="act in lookups.activities" :key="act.value" cols="6">
								<v-item v-slot="{ active, toggle }" :value="act">
									<v-card :color="active ? 'blue darken-2' : 'grey darken-2'" class="d-flex align-center" dark height="42" @click="toggle2(act)">
										<v-scroll-y-transition>
											<div class="text-caption flex-grow-1 text-center">{{ act.name }}</div>
										</v-scroll-y-transition>
									</v-card>
								</v-item>
							</v-col>
						</v-row>

						<v-expand-transition>
							<v-text-field
								v-if="person.activities.some((o) => o.value == 3)"
								v-model="person.homelessRationale"
								:dense="settings.dense"
								:outlined="settings.outlined"
								label="Homeless Reasoning"
								required
								:rules="[(v) => !!v || 'Justification is required if \'Homeless\' is selected']"
								@blur="(val) => (person.homelessRationale = person.homelessRationale.toUpperCase())"
							></v-text-field>
						</v-expand-transition>
						<v-expand-transition>
							<v-text-field
								v-if="person.activities.some((o) => o.value == 5)"
								v-model="person.caJustification"
								:dense="settings.dense"
								:outlined="settings.outlined"
								label="Criminal Activity Justification"
								required
								:rules="[(v) => !!v || 'Required if \'Criminal Activity\' is selected']"
								@blur="(val) => (person.caJustification = person.caJustification.toUpperCase())"
							></v-text-field>
						</v-expand-transition>
					</v-container>
				</v-item-group>
			</v-form>
		</v-card-text>

		<v-divider></v-divider>

		<v-card-actions>
			<v-btn v-if="step > 1" text @click="$emit('backStep', step)"> Back </v-btn>

			<v-spacer></v-spacer>
			<v-btn :disabled="!valid || !valid2" color="primary" @click="$emit('advanceStep', step)"> Continue </v-btn>
		</v-card-actions>
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import AddPhoneDialog from "./AddPhoneDialog.vue";
import AddAddressDialog from "./AddAddressDialog.vue";

export default {
	name: "PersonAddress",
	components: { AddPhoneDialog, AddAddressDialog },
	props: ["step", "person", "gangs", "lookups", "settings"],

	data: () => ({
		addressTypes: [
			{ name: "Primary", icon: "mdi-home", color: "primary" },
			{ name: "Work", icon: "mdi-office-building", color: "teal lighten-1" },
			{ name: "School", icon: "mdi-account-school", color: "blue-grey" },
			{ name: "Associate", icon: "mdi-human-greeting-proximity", color: "deep-purple lighten-1" },
		],
		phoneTypes: [
			{ name: "Mobile", icon: "mdi-cellphone-wireless", color: "deep-purple lighten-1" },
			{ name: "Home", icon: "mdi-phone-classic", color: "primary" },
			{ name: "Work", icon: "mdi-card-account-phone", color: "teal lighten-1" },
		],
		gangNames: [],
		valid: false,
		valid2: false,
	}),

	methods: {
		...mapMutations({
			addAddress: "Fi/ADD_ADDRESS",
			deleteAddress: "Fi/REMOVE_ADDRESS",
			addPhone: "Fi/ADD_PHONE",
			deletePhone: "Fi/REMOVE_PHONE",
		}),
		pushAddress(address) {
			this.addAddress(address);
		},
		pushPhone(phone) {
			this.addPhone(phone);
		},
		getGangNames() {
			this.lookups.gangs.forEach((g) => {
				this.gangNames.push(g.name);
			});
		},
		toggle2(act) {
			if (!this.person.activities.find((a) => a.value == act.value)) {
				this.person.activities.push(act);
			} else {
				const index = this.person.activities.findIndex((item) => item.value === act.value);
				this.person.activities.splice(index, 1);
			}
		},
	},
	watch: {
		"person.addresses"(val) {
			this.valid = val.length || this.person.activities.find((o) => o.value == 3) ? true : false;
		},
		"person.activities"(val) {
			this.valid = !!val.find((o) => o.value == 3) || this.person.addresses.length;
			if (!val.find((o) => o.value == 3)) {
				this.person.homelessRationale = "";
			}
			if (!val.find((o) => o.value == 5)) {
				this.person.caJustification = "";
			}
		},
	},
	mounted() {
		this.valid = this.person.activities.find((o) => o.value == 3) || this.person.addresses.length;
	},
};
</script>

<style></style>
