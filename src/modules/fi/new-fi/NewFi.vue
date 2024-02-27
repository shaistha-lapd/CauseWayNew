<template>
	<v-container fill-height class="justify-center">
		<v-card rounded height="100%" width="100%" max-width="500" class="d-flex flex-column px-0">
			<v-toolbar flat dark max-height="56" color="primary">
				<v-toolbar-title>New Field Interview </v-toolbar-title>
				<v-spacer></v-spacer>

				<div v-if="step < 3">
					<BarcodeScanner @scanned="validateForm1" :person="fi.person" :lookups="lookups"></BarcodeScanner>
				</div>
			</v-toolbar>
			<v-stepper v-model="step" height="100%" width="100%">
				<v-stepper-items>
					<v-stepper-content step="1">
						<PersonInfo
							:step="1"
							:person="fi.person"
							:settings="settings"
							:lookups="lookups"
							:scanned="scanSuccess"
							@advanceStep="advanceStep"
							@reset="cancel()"
						>
						</PersonInfo>
					</v-stepper-content>
					<v-stepper-content step="2">
						<PersonAddress
							:step="2"
							:person="fi.person"
							:settings="settings"
							:lookups="lookups"
							@advanceStep="advanceStep"
							@backStep="backStep"
						></PersonAddress>
					</v-stepper-content>
					<v-stepper-content step="3">
						<Associates :step="3" :person="fi.person" :settings="settings" :lookups="lookups" @advanceStep="advanceStep" @backStep="backStep"></Associates>
					</v-stepper-content>
					<v-stepper-content step="4">
						<Vehicle :step="4" :vehicle="fi.vehicle" :settings="settings" :lookups="lookups" @advanceStep="advanceStep" @backStep="backStep"></Vehicle>
					</v-stepper-content>
					<v-stepper-content step="5">
						<IncidentDetails :step="5" :incident="fi.incident" :settings="settings" :rdMap="rdMap" @review="review" @backStep="backStep"></IncidentDetails>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</v-card>
	</v-container>
</template>

<script>
import PersonInfo from "./PersonInfo.vue";
import PersonAddress from "./PersonAddress.vue";
import Associates from "./Associates.vue";
import Vehicle from "./Vehicle.vue";
import IncidentDetails from "./IncidentDetails.vue";
import BarcodeScanner from "./BarcodeScanner.vue";
import ReviewFi from "./ReviewFi.vue";
import { mapGetters, mapActions } from "vuex";
export default {
	name: "New-FI",
	components: {
		PersonInfo,
		PersonAddress,
		Associates,
		Vehicle,
		IncidentDetails,
		BarcodeScanner,
		ReviewFi,
	},
	data: () => ({
		step: 1,
		reviewDialog: false,
		scanSuccess: false,
	}),
	computed: {
		...mapGetters({
			fi: "Fi/fi",
			rdMap: "Fi/rdMap",
			lookups: "Fi/lookups",
			statuses: "Fi/statuses",
			settings: "User/settings",
		}),
	},

	methods: {
		...mapActions({
			getLookups: "Fi/getLookups",
			getRdMap: "Fi/getRdMap",
			save: "Fi/saveProgress",
			reset: "Fi/resetFi",
			cancel: "Fi/cancelFi",
		}),
		advanceStep(num) {
			this.fi.data.percentComplete = num * 25;
			this.save(this.fi);
			this.step = num + 1;
		},
		backStep(num) {
			this.step = num - 1;
		},
		validateForm1() {
			this.scanSuccess = true;
		},
		cancel() {
			this.$router.replace("/fi");
			this.$store.dispatch("Fi/cancelFi", this.fi.data.id);
		},
		review() {
			this.fi.data.percentComplete = 100;
			// this.$store.commit("Fi/UPDATE_NARRATIVE");
			this.$store.commit("Fi/UPDATE_STATUS", this.statuses.READY);

			this.save(this.fi);
			this.$router.push({ name: "view", params: { id: this.fi.data.id } });
		},
	},

	async created() {
		this.$store.state.loading = true;
		this.getLookups();
		await this.getRdMap();
		if (this.fi.data.status == null) {
			this.$store.commit("Fi/CREATE_FI");
		}
		this.$store.state.loading = false;
	},
	beforeRouteLeave(to, from, next) {
		if (this.step > 1 && to.name != "view") {
			const reply = window.confirm("You have unsaved changes! Do you want to leave?");
			if (!reply) {
				// deny navigation
				next(false);
			} else {
				if (this.fi.data.status === this.statuses.NEW) {
					this.fi.data.status = this.statuses.ABANDONED;
					this.save(this.fi);
				}
				next(true);
			}
		} else {
			next(true);
		}
	},
};
</script>
