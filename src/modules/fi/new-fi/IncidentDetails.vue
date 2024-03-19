<template>
	<div>
		<v-card-subtitle> Incident Details </v-card-subtitle>
		<v-divider></v-divider>

		<v-card-text>
			<v-form ref="inc" v-model="valid">
				<v-row justify="center">
					<v-col cols="8" md="5">
						<v-text-field
							v-model="incident.incNumber"
							:dense="settings.dense"
							:outlined="settings.outlined"
							inputmode="numeric"
							label="Incident #"
							v-mask="'############'"
							counter="12"
							maxlength="12"
							:rules="[(v) => (v && v.length > 11) || 'Enter last four of Inc #']"
						></v-text-field>
					</v-col>
				</v-row>
				<v-row justify="space-between">
					<v-col cols="6">
						<v-dialog ref="dialog" v-model="dateModal" :return-value.sync="incident.incDate" persistent width="290px">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:dense="settings.dense"
									:outlined="settings.outlined"
									v-model="incident.incDateFormatted"
									label="Current Date"
									prepend-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
									show-current
								></v-text-field>
							</template>
							<v-date-picker
								v-model="incident.incDate"
								ref="picker"
								header-color="primary"
								required
								:rules="[(v) => !!v || 'DOB is required']"
								:max="getLongDate(new Date())"
							>
								<v-spacer></v-spacer>
								<v-btn text color="error" @click="dateModal = false"> Cancel </v-btn>
								<v-spacer></v-spacer>
								<v-btn text color="primary" @click="$refs.dialog.save(incident.incDate)"> OK </v-btn>
							</v-date-picker>
						</v-dialog>
					</v-col>
					<v-col cols="6">
						<v-dialog ref="timeDialog" v-model="timeModal" :return-value.sync="incident.incTime" persistent width="290px">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									:dense="settings.dense"
									:outlined="settings.outlined"
									v-model="incident.incTime"
									label="Incident Time"
									prepend-icon="mdi-clock"
									readonly
									v-bind="attrs"
									v-on="on"
									show-current
								></v-text-field>
							</template>
							<v-time-picker v-model="incident.incTime" full-width format="24hr" :allowed-minutes="allowedStep">
								<v-spacer></v-spacer>
								<v-btn text color="error" @click="timeModal = false">Cancel</v-btn>
								<v-btn text color="primary" @click="$refs.timeDialog.save(incident.incTime)">OK</v-btn>
							</v-time-picker>
						</v-dialog>
					</v-col>
				</v-row>
				<v-row no-gutters justify="center">
					<v-checkbox v-model="incident.multipleSources" :dense="settings.dense" :outlined="settings.outlined" color="light-blue " hide-details>
						<template #label>
							<div>
								Multiple Source
								<v-fade-transition> </v-fade-transition>
								<div class="text-caption" :class="incident.multipleSources ? 'warning--text' : ''">Sources must be documented in narrative</div>
							</div>
						</template>
					</v-checkbox>
				</v-row>
				<v-row justify="center">
					<v-col cols="12">
						<v-textarea
							v-model="incident.incNarrative"
							:dense="settings.dense"
							:outlined="settings.outlined"
							hint="Area will auto-expand if more space is needed"
							persistent-hint
							auto-grow
							label="Narrative"
							rows="1"
							filled
							autocomplete="off"
							spellcheck="false"
							autocorrect="off"
							:rules="[(v) => !!v || 'A narrative is required']"
							@blur="incident.incNarrative = incident.incNarrative.toUpperCase()"
						></v-textarea>
					</v-col>
				</v-row>

				<v-row justify="space-around" v-for="(ofcr, i) in incident.incOfficers" :key="ofcr.serial">
					<v-col cols="6" md="4">
						<v-text-field
							readonly
							v-model="ofcr.lastName"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Officer"
							:rules="[(v) => !!v || 'Officer name is required']"
						></v-text-field>
					</v-col>
					<v-col cols="6" md="4">
						<v-text-field
							readonly
							v-model="ofcr.serial"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Serial"
							:rules="[(v) => !!v || 'Serial is required']"
						>
							<template v-slot:append-outer>
								<v-btn icon :disabled="ofcr.serial === appUser.serial" @click="$store.commit('Fi/REMOVE_OFFICER', i)">
									<v-icon color="red lighten-2"> mdi-trash-can-outline </v-icon>
								</v-btn>
							</template>
						</v-text-field>
					</v-col>
				</v-row>
				<v-row justify="space-around" dense>
					<v-col cols="8" md="4">
						<v-autocomplete
							v-model="partner"
							:dense="settings.dense"
							:outlined="settings.outlined"
							:items="employees"
							:filter="customFilter"
							filled
							color="blue-grey"
							label="Add Partner"
							return-object
							@change="addPartner(partner)"
						>
							<template v-slot:append>
								<v-icon color="accent"> mdi-account-search </v-icon>
							</template>
							<template v-slot:item="data">
								<v-list-item-avatar>
									<img src="../../../../public/img/lapd-badge-192x192.png" />
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>{{ data.item.lastName }}, {{ data.item.firstName.substring(0, 1) }}. - #{{ data.item.serial }}</v-list-item-title>
									<v-list-item-subtitle v-html="data.item.assignment"></v-list-item-subtitle>
								</v-list-item-content>
							</template>
						</v-autocomplete>
					</v-col>
				</v-row>

				<v-row justify="center" dense>
					<v-col cols="6">
						<v-text-field
							v-model="incident.unit"
							:dense="settings.dense"
							:outlined="settings.outlined"
							label="Detail"
							:rules="[(v) => !!v || 'Detail is required', (v) => v.length >= 3 || 'Must be at least 3 characters']"
							@blur="incident.unit = incident.unit.toUpperCase()"
						></v-text-field>
					</v-col>
				</v-row>
			</v-form>
			<v-row dense class="mt-4" justify="center">
				<v-btn-toggle ref="loc" mandatory v-model="showMap" color="light-blue">
					<v-btn :loading="locating" :disabled="!valid" :value="true">
						<span>GeoLocate</span>
						<v-icon right color="purple lighten-2"> mdi-map-marker-radius </v-icon>
					</v-btn>
					<v-btn :value="false" :disabled="!valid">
						<span>Manual Loc</span>
						<v-icon right color="orange lighten-1"> mdi-keyboard-outline </v-icon>
					</v-btn>
				</v-btn-toggle>
			</v-row>
			<v-expand-transition>
				<LMap
					v-if="showMap === true && valid"
					:currLocation="currLocation"
					:incLocation="incident.incLocation"
					:rdMap="rdMap"
					@searchloc="setIncLoc"
					@movemarker="setIncLoc"
					class="mt-4"
				></LMap>
			</v-expand-transition>
			<v-expand-transition>
				<v-card flat outlined v-if="showMap === false && valid" class="mt-2">
					<v-card-text>
						<v-form ref="manualLoc" v-model="manualValid">
							<v-row justify="center">
								<v-col cols="12">
									<v-text-field
										v-model="incident.incLocation.location"
										autocomplete="new-password"
										:dense="settings.dense"
										:outlined="settings.outlined"
										label="Address"
										:rules="[(v) => !!v || 'Location must be set']"
										clearable
									></v-text-field>
								</v-col>
								<v-col cols="4">
									<v-text-field
										type="numeric"
										autocomplete="new-password"
										:dense="settings.dense"
										:outlined="settings.outlined"
										v-model="incident.incLocation.rd"
										mask="####"
										label="R.D."
										:rules="[(v) => !!v || 'RD is required']"
										clearable
										@blur="incident.unit = incident.unit.toUpperCase()"
									></v-text-field>
								</v-col>
							</v-row>
						</v-form>
					</v-card-text>
				</v-card>
			</v-expand-transition>
		</v-card-text>

		<v-divider></v-divider>
		<v-card-actions>
			<v-btn v-if="step > 1" text @click="$emit('backStep', step)"> Back </v-btn>
			<v-btn v-else color="red" outlined to="/"> Cancel </v-btn>
			<v-spacer></v-spacer>

			<v-btn :disabled="!valid || (!showMap && !manualValid)" color="blue-grey" @click="$emit('review')">
				Review
				<v-icon right dark> mdi-file-search-outline </v-icon>
			</v-btn>
		</v-card-actions>
	</div>
</template>

<script>
import LMap from "../../../components/core/LMap.vue";
import { geoServices } from "../../../mixins/geoServices.js";
import { datetime } from "../../../mixins/datetime";
import { mapGetters } from "vuex";
export default {
	components: {
		LMap,
	},
	mixins: [geoServices, datetime],
	props: ["step", "incident", "settings"],

	data: () => ({
		valid: false,
		manualValid: false,
		locating: false,
		showMap: null,
		currLocation: { lat: 34.051998763462436, lng: -118.2443267084638 }, //Default to LAPD Headquarters if geolocation fails
		timeModal: false,
		dateModal: false,
		partner: null,
		count: 0,
	}),
	computed: {
		...mapGetters({
			appUser: "User/appUser",
			rdMap: "Fi/rdMap",
			employees: "employees",
		}),
	},
	methods: {
		allowedStep: (m) => m % 5 === 0,
		showMapOrManual() {
			if (navigator.onLine) {
				this.getLocation();
			} else {
				this.setLocManual = true;
			}
		},
		getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(this.locate, this.showError);
			} else {
				window.alert("Geolocation is not supported by this browser.");
			}
		},

		locate() {
			this.locating = true;
			navigator.geolocation.getCurrentPosition((position) => {
				this.currLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				this.locating = false;
			});
		},
		showError(error) {
			switch (error.code) {
				case error.PERMISSION_DENIED:
					window.alert("User denied the request for Geolocation.");
					break;
				case error.POSITION_UNAVAILABLE:
					window.alert("Location information is unavailable.");
					break;
				case error.TIMEOUT:
					window.alert("The request to get user location timed out.");
					break;
				case error.UNKNOWN_ERROR:
					window.alert("An unknown error occurred.");
					break;
			}
		},
		isEmpty(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) return false;
			}
			return true;
		},
		async setIncLoc(latLng) {
			this.count++;
			let loc = await this.getAddressFromCoords(latLng); //from mixin
			this.incident.incLocation = loc;
			this.$refs.inc.validate();
		},
		customFilter(item, queryText, itemText) {
			const textOne = item.lastName.toLowerCase();
			const textTwo = item.serial.toLowerCase();
			const searchText = queryText.toLowerCase();

			return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1;
		},
		addPartner(ofcr) {
			this.$store.commit("Fi/ADD_OFFICER", ofcr);
			this.partner = {};
		},
		handleManualLocSet(location) {
			this.incident.incLocation = location;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.inc.resetValidation();
		});
		this.$store.commit("Fi/ADD_OFFICER", this.appUser);
	},
	watch: {
		currLocation(val) {
			this.setIncLoc(val);
		},
		"incident.incDate"(val) {
			this.incident.incDateFormatted = this.formatDate(val);
		},

		appUser(val) {
			this.$store.commit("Fi/ADD_OFFICER", val);
		},
		showMap(v) {
			if (v) {
				this.getLocation();
			}
		},
	},
};
// https://api.tomtom.com/search/2/geocode/100%20w.%201st%20st,%20los%20angeles,%20ca,%2090012.json?key=61p0GxqDYGl0pljlNLLb0f2Y9fDMDUhJ&lat=34.051998763462436&lon=-118.2443267084638&radius=100&language=en-US
// https://api.tomtom.com/search/2/autocomplete/100%20w.%201st%20st,%20los%20angeles,%20ca,%2090012.json?key=61p0GxqDYGl0pljlNLLb0f2Y9fDMDUhJ&lat=34.051998763462436&lon=-118.2443267084638&radius=100&language=en-US
</script>

<style>
.slide-fade-enter-active {
	transition: all 0.5s ease-out;
	transition-delay: 0.08s;
}

.slide-fade-leave-active {
	transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
	transform: translateX(-80px);
	transition-delay: 0.08s;
}

.slide-fade-leave-to {
	transform: translateX(80px);
	opacity: 0;
}
</style>
