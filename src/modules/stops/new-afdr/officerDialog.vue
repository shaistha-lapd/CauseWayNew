<template>
	<v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" max-width="600">
		<!-- <template v-slot:activator="{ on, attrs }">
			<v-btn color="primary" v-bind="attrs" v-on="on" outlined
				>Add Officer
				<v-icon color="success" class="ml-2">mdi-account-plus-outline</v-icon>
			</v-btn>
		</template> -->

		<v-card>
			<v-toolbar color="primary" dark>Employee Lookup</v-toolbar>
			<v-card-text>
				<v-row class="ma-4">
					<v-col cols="12">
						<v-autocomplete
							v-model="officer"
							:items="emps"
							:loading="isLoading"
							:search-input.sync="search"
							:filter="filterObject"
							label="Officer Info"
							maxlength="5"
							return-object
							persistent-hint
							hint="Search by serial number"
						>
							<template slot="selection" slot-scope="data">{{ getOfficerName(data.item) }} </template>
							<template slot="item" slot-scope="data"> {{ data.item.LastName }}, {{ data.item.FirstName }} - #{{ data.item.SerialNumber }} </template>
						</v-autocomplete>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary darken-1" text @click="$emit('close')">
					Close
				</v-btn>
				<v-btn color="success darken-1" text @click="save(officer)">
					Save
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
	props: ["dialog", "target"],

	data: () => ({
		officer: "",
		emps: [],
		isLoading: false,
		search: null,
	}),
	computed: {
		...mapFields(["watchInfo.officer1", "employees"]),
	},
	methods: {
		...mapMutations(["addOfficer"]),
		filterObject(item, queryText, itemText) {
			return (
				// item.LastName.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
				// item.FirstName.toLowerCase().indexOf(queryText.toLowerCase()) > -1 ||
				item.SerialNumber.toLowerCase().indexOf(queryText.toLowerCase()) > -1
			);
		},
		getOfficerName(ofcr) {
			let last = ofcr.LastName;
			let first = ofcr.FirstName;
			let serial = ofcr.SerialNumber;
			first = first.substring(0, 1) + ".";
			return `${last}, ${first} #${serial}`;
		},
		save(ofcr) {
			if (this.target === "officer1") {
				this.officer1 = { ...ofcr };
			} else this.addOfficer(ofcr);

			this.$emit("close");
			this.officer = "";
		},
		getEmpBySerial(serial) {
			fetch(`https://lapd-cdnjs.azurewebsites.us/api/getEmpBySerial?code=Yuuj/bSaQZ0YQzc4EizIJJR37ajPXoVRKR9AQLoOHeGv/tf4p3vKIA==&serial=${serial}`)
				.then((res) => res.json())
				.then((data) => (this.emps = data));
		},
	},
	watch: {
		search(val) {
			if (val.length < 2) return;

			this.isLoading = true;

			fetch(`https://lapd-cdnjs.azurewebsites.us/api/getEmpBySerial?code=Yuuj/bSaQZ0YQzc4EizIJJR37ajPXoVRKR9AQLoOHeGv/tf4p3vKIA==&serial=${val}`)
				.then((res) => res.json())
				.then((data) => {
					this.emps = data;
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => (this.isLoading = false));
		},
	},
	mounted() {
		this.officer = "";
	},
};
</script>

<style></style>
