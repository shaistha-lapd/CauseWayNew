<template>
	<v-dialog ref="phoneModal" v-model="phoneModal" max-width="600px">
		<template v-slot:activator="{ on, attrs }">
			<v-btn icon v-bind="attrs" v-on="on">
				<v-icon color="accent">mdi-phone-plus</v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title>
				<span class="headline">Phones</span>
			</v-card-title>

			<v-card-text>
				<v-form ref="phoneForm" v-model="valid">
					<v-row dense>
						<v-col cols="9">
							<v-select
								:items="phoneTypes"
								v-model="pType"
								item-text="name"
								item-value="name"
								label="Type"
								:dense="settings.dense"
								:outlined="settings.outlined"
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
						<v-text-field
							v-model="pNum"
							v-mask="mask"
							inputmode="numeric"
							label="Number"
							:dense="settings.dense"
							:outlined="settings.outlined"
							:rules="numberRules"
						></v-text-field>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn color="red" outlined @click="closeDialog()"> Cancel </v-btn>
				<v-spacer></v-spacer>
				<v-btn :disabled="!valid" color="primary" @click="$refs.phoneModal.save(savePhone())">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
export default {
	props: ["phoneTypes", "settings"],
	data() {
		return {
			valid: false,
			phoneModal: false,
			pType: "",
			pNum: "",
			mask: ["(", /\d/, /\d/, /\d/, ") ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
			numberRules: [(v) => !!v || "Number is required", (v) => (v && v.length > 13) || "Number must contain 10 digits"],
		};
	},

	methods: {
		closeDialog() {
			this.phoneModal = false;
			this.$refs.phoneForm.reset();
		},
		savePhone() {
			let phone = {
				type: this.pType,
				formattedNumber: this.pNum,
				number: this.unFormatNumber(this.pNum),
			};
			this.$emit("pushPhone", phone);
		},
		unFormatNumber(num) {
			return num.replace(/\D/g, "");
		},
	},
};
</script>
