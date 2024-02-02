<template>
	<v-card>
		<div>
			<h3 class="text-center">Location of Stop</h3>
		</div>

		<v-divider></v-divider>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<v-checkbox v-model="locate" label="Use current location"></v-checkbox>
				</v-col>
			</v-row>
			<v-row>
				<v-text-field v-if="locate" readonly filled outlined :value="`${location.lat}, ${location.lng}`"> </v-text-field>
				<vuetify-algolia-places
					outlined
					v-else-if="searchLoc"
					v-model="place"
					around-lat-lng=" 34.051998763462436,-118.2443267084638"
					around-radius="50000"
					label="Search for address"
					clearable
					@click:clear="searchLoc = !searchLoc"
					onfocus="value = ''"
				/>
				<v-text-field
					v-else
					outlined
					clearable
					append-icon="mdi-map-search"
					@click:append="searchLoc = !searchLoc"
					:value="location.address"
					label="Location of stop"
				></v-text-field>
			</v-row>
			<v-row align="center" justify="center">
				<v-col cols="6">
					<v-text-field outlined label="RD" v-model="rd"></v-text-field>
				</v-col>
			</v-row>

			<v-row justify="center" class="mt-4">
				<span class="text-body-1">Was the location a public school?</span>
			</v-row>
			<v-row justify="center" class="mt-0 mb-2">
				<v-radio-group dense row v-model="publicSchool">
					<v-radio label="No" :value="false"> </v-radio>
					<v-radio label="Yes" :value="true"></v-radio>
				</v-radio-group>
			</v-row>
			<v-expand-transition>
				<div v-if="publicSchool">
					<v-row justify="center" class="mt-0">
						<span class="text-body-2">Was the subject a K-12 student?</span>
					</v-row>
					<v-row justify="center" class="mt-0 mb-2">
						<v-radio-group dense row v-model="k12">
							<v-radio label="No" :value="false"> </v-radio>
							<v-radio label="Yes" :value="true"></v-radio>
						</v-radio-group>
					</v-row>
					<v-combobox outlined label="Name of school" v-model="publicSchoolName" :items="schools" item-text="name"></v-combobox>
				</div>
			</v-expand-transition>
		</v-card-text>
		<v-card-actions>
			<v-btn outlined @click="$emit('back', step)"> Back </v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="$emit('continue', step)"> Continue </v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { geoServices } from "../../../../mixins/geoServices";
import { mapFields } from "vuex-map-fields";
export default {
	props: ["step"],
	mixins: [geoServices],
	data: () => ({
		place: "",
		locate: false,
		searchLoc: false,
	}),
	computed: {
		...mapFields(["stopInfo.location", "stopInfo.rd", "stopInfo.publicSchool", "stopInfo.publicSchoolName", "stopInfo.k12", "schools"]),
	},
	methods: {
		geolocate() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					this.location.lat = position.coords.latitude;
					this.location.lng = position.coords.longitude;
				});
			} else {
				alert("Geolocation is not supported");
			}
		},
		getHundredBlockFromPlace(loc) {},
	},
	watch: {
		locate(val) {
			if (val) {
				this.place = "";
				this.geolocate();
			} else {
				this.location.lat = null;
				this.location.lng = null;
			}
		},
		place(val) {
			this.location.address = val.name;
			this.location.lat = val.latlng.lat;
			this.location.lng = val.latlng.lng;
		},
	},
};
</script>

<style></style>
