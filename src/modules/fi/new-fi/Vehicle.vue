<template>
	<div>
		<v-card-subtitle> Vehicle Information </v-card-subtitle>
		<v-divider></v-divider>

		<v-card-text>
			<v-row justify="center">
				<v-radio-group v-model="vehicle.vehSeatedPosition">
					<v-radio label="Pedestrian/Bike" color="accent" value="ped"></v-radio>
					<v-radio label="Driver" value="driver" color="accent"></v-radio>
					<v-radio label="Passenger" value="passenger" color="accent"></v-radio>
				</v-radio-group>
			</v-row>
			<v-expand-transition>
				<template v-if="vehicle.vehSeatedPosition != 'ped'">
					<v-form ref="vehicle" v-model="valid">
						<v-row justify="space-between">
							<v-col cols="8" md="5">
								<v-text-field
									v-model="vehicle.vehPlate"
									:dense="settings.dense"
									:outlined="settings.outlined"
									label="License Plate"
									hint="(or VIN if no plate)"
									spellcheck="off"
									persistent-hint
									required
									:rules="rules.plateRules"
									@blur="(val) => (vehicle.vehPlate = vehicle.vehPlate.toUpperCase())"
								></v-text-field>
							</v-col>
							<v-col cols="4">
								<v-select
									v-model="vehicle.vehState"
									:dense="settings.dense"
									:outlined="settings.outlined"
									:items="lookups.states"
									item-text="abbreviation"
									item-value="abbreviation"
									label="State"
									:rules="rules.stateRules"
								></v-select>
							</v-col>
						</v-row>
						<v-row justify="center">
							<v-col cols="4">
								<v-text-field
									v-model="vehicle.vehYear"
									:dense="settings.dense"
									:outlined="settings.outlined"
									label="Year"
									v-mask="'####'"
									inputmode="numeric"
									counter="4"
									maxlength="4"
									:rules="rules.yearRules"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row justify="space-between">
							<v-col cols="6" md="5">
								<v-autocomplete
									v-model="select"
									:dense="settings.dense"
									:outlined="settings.outlined"
									:items="lookups.car_makes"
									item-text="Make_Name"
									item-value="Make_ID"
									return-object
									label="Make"
									:rules="rules.makeRules"
									@change="getCarModels(select)"
								></v-autocomplete>
							</v-col>
							<v-col cols="6" md="5">
								<v-combobox
									v-model="vehicle.vehModel"
									:dense="settings.dense"
									:outlined="settings.outlined"
									label="Model"
									:items="models"
									:loading="loading"
									:rules="rules.modelRules"
								></v-combobox>
							</v-col>
						</v-row>
						<v-row justify="space-between">
							<v-col cols="6" md="5">
								<v-select
									v-model="vehicle.vehBodyStyle"
									:dense="settings.dense"
									:outlined="settings.outlined"
									:items="lookups.vehicleTypes"
									item-text="name"
									item-value="value"
									return-object
									label="Type"
									:rules="rules.typeRules"
								></v-select>
							</v-col>
							<v-col cols="6" md="5">
								<v-autocomplete
									v-model="vehicle.vehColor"
									:dense="settings.dense"
									:outlined="settings.outlined"
									:items="lookups.vehicleColors"
									item-text="name"
									item-value="name"
									return-object
									label="Color"
									:rules="rules.colorRules"
								></v-autocomplete>
							</v-col>
						</v-row>
						<v-row justify="center">
							<v-col cols="11">
								<v-text-field
									v-model="vehicle.vehDamage"
									:dense="settings.dense"
									:outlined="settings.outlined"
									clearable
									label="Dents/Scratches/Stickers/Tint"
									persistent-hint
									spellcheck="false"
									@blur="(val) => (vehicle.vehDamage = vehicle.vehDamage.toUpperCase())"
								></v-text-field>
							</v-col>
						</v-row>
					</v-form>
				</template>
			</v-expand-transition>
		</v-card-text>
		<v-spacer></v-spacer>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn v-if="step > 1" text @click="$emit('backStep', step)"> Back </v-btn>
			<v-btn v-else color="red" outlined to="/"> Cancel </v-btn>
			<v-spacer></v-spacer>
			<v-btn :disabled="!valid || !vehicle.vehSeatedPosition === 'ped'" color="primary" @click="$emit('advanceStep', step)"> Continue </v-btn>
		</v-card-actions>
	</div>
</template>

<script>
export default {
	name: "Vehicle",
	props: ["step", "vehicle", "lookups", "settings"],

	data: () => ({
		valid: false,
		models: [],
		loading: false,
		select: null,
		currYear: new Date().getFullYear(),

		//Get Models by make: https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/5083?format=json
		//Decode vin: https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/1ZVHT84NX55178875?format=json
		// results: {
		// 	"ModelYear": "2008",
		// 	"Make": "CADILLAC",
		// 	"Model": "CTS",
		// 	"BodyClass": "Convertible/Cabriolet",
		// 	"BodyClass": "Sedan/Saloon",

		// }
	}),
	computed: {
		rules() {
			if (this.vehicle.vehSeatedPosition !== "ped") {
				return {
					plateRules: [(v) => !!v || "Plate or VIN is required"],
					stateRules: [(v) => !!v || "State is required"],
					yearRules: [
						(v) => !!v || "Year is required",
						(v) => (v && v.length >= 4) || "Year must be 4 digits",
						(v) => (v >= 1910 && v <= this.currYear) || `Valid dates are between 1910 & ${this.currYear} `,
					],
					makeRules: [(v) => !!v || "Make is required"],
					modelRules: [(v) => !!v || "Model is required"],
					typeRules: [(v) => !!v || "Type is required"],
					colorRules: [(v) => !!v || "Color is required"],
				};
			} else return null;
		},
	},
	methods: {
		getCarModels(make) {
			this.loading = true;
			this.models = [];
			this.vehicle.vehMake = make.Make_Name;
			this.vehicle.vehModel = "";
			fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${make.Make_ID}?format=json`)
				.then((res) => res.json())
				.then((data) => {
					data.Results.forEach((x) => {
						this.models.push(x.Model_Name);
					});
					this.loading = false;
				});
		},
	},

	watch: {
		"vehicle.vehSeatedPosition"(newVal, oldVal) {
			if (newVal === "ped") {
				this.valid = true;
			}
			if (oldVal !== "ped" && newVal === "ped") {
				this.$store.commit("Fi/RESET_VEH");
				this.select = "";
			}
		},
	},
	mounted() {
		if (this.vehicle.vehSeatedPosition === "ped") this.valid = true;
	},
	beforeMount() {
		this.$store.dispatch("Fi/getCarMakes");
	},
};
</script>

<style></style>
