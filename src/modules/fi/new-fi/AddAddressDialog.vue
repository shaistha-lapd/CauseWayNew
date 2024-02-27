<template>
	<v-dialog ref="addressModal" v-model="addressModal" :return-value.sync="place" max-width="600px">
		<template v-slot:activator="{ on, attrs }">
			<v-btn icon v-bind="attrs" v-on="on" @click="isOnline">
				<v-icon color="accent">mdi-home-plus</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-form ref="addressForm" v-model="valid">
				<v-card-title>
					<span class="headline">New Address</span>
				</v-card-title>
				<template v-if="online">
					<v-card-text>
						<v-container>
							<!-- <v-row no-gutters>
								<v-col cols="6">
									<v-checkbox v-model="isTransient" label="Transient"></v-checkbox>
								</v-col>
							</v-row> -->
							<v-row dense>
								<v-col cols="9">
									<v-select
										:disabled="isTransient"
										:items="addressTypes"
										v-model="aType"
										:dense="settings.dense"
										:outlined="settings.outlined"
										item-text="name"
										item-value="name"
										return-object
										label="Type"
										:rules="[(v) => !!v || 'You must select a type']"
									>
										<template slot="selection" slot-scope="data">
											<span>
												<v-icon :color="data.item.color">{{ data.item.icon }}</v-icon>
												&nbsp;&nbsp;&nbsp;{{ data.item.name }}
											</span>
										</template>
										<template slot="item" slot-scope="data">
											<v-list-item-avatar>
												<v-icon :color="data.item.color">{{ data.item.icon }}</v-icon>
											</v-list-item-avatar>
											<v-list-item-content>
												<v-list-item-title>{{ data.item.name }}</v-list-item-title>
											</v-list-item-content>
										</template>
									</v-select>
								</v-col>
							</v-row>
							<v-row dense>
								<vuetify-google-autocomplete
									autocomplete="autocomplete_off_randString"
									ref="address"
									id="map"
									:dense="settings.dense"
									:outlined="settings.outlined"
									classname="form-control"
									placeholder="Address"
									v-on:placechanged="getSearchResult"
									country="us"
									clearable
									:rules="[(v) => !!v || 'You must enter an address']"
								>
								</vuetify-google-autocomplete>
							</v-row>

							<v-row dense>
								<v-col cols="4">
									<v-text-field
										v-model="unit"
										:dense="settings.dense"
										:outlined="settings.outlined"
										autocomplete="new-password"
										label="Apt/Unit"
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
				</template>
				<template v-else>
					<v-card-text>
						<v-layout row>
							<v-flex xs4>
								<v-select
									:items="addressTypes"
									v-model="offlineAddress.type"
									label="Type"
									:dense="settings.dense"
									:outlined="settings.outlined"
									:rules="[(v) => !!v || 'You must select a type']"
								></v-select>
							</v-flex>
						</v-layout>
						<v-layout row>
							<v-text-field v-model="offlineAddress.street" :rules="[(v) => !!v || 'Address is required']"></v-text-field>
						</v-layout>
					</v-card-text>
				</template>
			</v-form>
			<v-card-actions>
				<v-btn color="red" outlined @click="closeDialog()"> Cancel </v-btn>
				<v-spacer></v-spacer>
				<v-btn :disabled="!valid && !isTransient" color="primary" @click="$refs.addressModal.save(setAddress())">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props: ["addressTypes", "settings"],
	data() {
		return {
			valid: false,
			addressModal: false,
			online: true,
			isTransient: false,
			place: undefined,
			aType: null,
			unit: null,
			offlineAddress: {
				street: "",
				type: "",
			},
			tempAddress: {},
		};
	},

	mounted() {},
	methods: {
		closeDialog() {
			this.addressModal = false;
			this.$refs.addressForm.reset();
		},

		isOnline() {
			if (!navigator.onLine) {
				this.online = false;
			}
		},

		getSearchResult(searchPlace) {
			this.tempAddress.streetNumber = searchPlace.street_number;
			this.tempAddress.streetName = searchPlace.route;
			this.tempAddress.city = searchPlace.locality;
			this.tempAddress.state = searchPlace.administrative_area_level_1;
			this.tempAddress.zip = searchPlace.postal_code;
			this.tempAddress.lat = searchPlace.latitude;
			this.tempAddress.long = searchPlace.longitude;
		},

		setAddress() {
			this.tempAddress["type"] = this.aType.name;
			this.tempAddress["unit"] = this.unit;
			this.tempAddress["formattedAddress"] = this.formattedAddress(this.tempAddress);
			this.$emit("pushAddress", this.tempAddress);
		},

		setTransient() {
			if (this.isTransient) {
				for (var i = 0; i < this.addresses.length; i++) {
					if (this.addresses[i].type === "Primary") {
						this.editAddressType(i);
					}
				}
				this.offlineAddress = {
					street: "1942 Transient",
					type: "Primary",
				};
				this.setOfflineAddress();
			}
		},
		formattedAddress(address) {
			if (!!this.unit) return address.streetNumber + " " + address.streetName + " Unit #" + this.unit;
			else {
				return `${address.streetNumber} ${address.streetName}`;
			}
		},
		setOfflineAddress() {
			this.addAddress(this.offlineAddress);
			this.offlineAddress = {
				street: "",
				type: "",
			};
			this.online = true;
		},
	},
};
</script>

<style scoped></style>
