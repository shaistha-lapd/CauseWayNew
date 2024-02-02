<template>
	<v-container fill-height class="justify-center">
		<v-card rounded height="100%" width="100%" max-width="500" class="d-flex flex-column px-0">
			<v-toolbar flat dark max-height="56" color="primary">
				<v-toolbar-title>New AFDR </v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>
			<v-stepper v-model="step" height="100%" width="100%">
				<v-stepper-items>
					<v-stepper-content step="1">
						<OfficerInfo :step="step" :watchInfo="afdr.officer" @continue="nextStep" @back="backStep"></OfficerInfo>
					</v-stepper-content>
					<!-- <v-stepper-content step="2">						
						<WatchInfo :step="2" @continue="nextStep" @back="backStep"></WatchInfo>
					</v-stepper-content>
					<v-stepper-content step="3">
						<StopDate :step="3" @continue="nextStep" @back="backStep"></StopDate>
					</v-stepper-content>
					<v-stepper-content step="4">
						<StopDuration :step="4" @continue="nextStep" @back="backStep"></StopDuration>
					</v-stepper-content>
					<v-stepper-content step="5">
						<StopLocation :step="5" @continue="nextStep" @back="backStep"></StopLocation>
					</v-stepper-content>
					<v-stepper-content step="6">						
						<PersonCount :step="6" @continue="nextStep" @back="backStep"></PersonCount>
					</v-stepper-content>
					<v-stepper-content step="7">
						<PersonGender :step="7" @continue="nextStep" @back="backStep"></PersonGender>
					</v-stepper-content>
					<v-stepper-content step="8">
						<PersonRaceAge :step="8" @continue="nextStep" @back="backStep"></PersonRaceAge>
					</v-stepper-content>
					<v-stepper-content step="9">
						<PersonLGBTQ :step="9" @continue="nextStep" @back="backStep"></PersonLGBTQ>
					</v-stepper-content> -->
				</v-stepper-items>
			</v-stepper>
			<!-- <v-stepper v-model="step" :key="index" height="100%" width="100%">
				<v-stepper-items>
					<v-stepper-content step="10">
						<StopType :step="10" :personNum="index" @continue="nextStep" @back="backStep"></StopType>
					</v-stepper-content>
					<v-stepper-content step="11">
						<StopReason :step="11" :personNum="index" @continue="nextStep" @back="backStep"></StopReason>
					</v-stepper-content>
					<v-stepper-content step="12">
						<ActionTaken :step="12" :personNum="index" @continue="nextStep" @back="backStep"></ActionTaken>
					</v-stepper-content>
					<v-stepper-content step="13">
						<StopEvidence :step="13" :personNum="index" @continue="nextStep" @back="backStep"></StopEvidence>
					</v-stepper-content>
					<v-stepper-content step="14">
						<StopResults :step="14" :personNum="index" @continue="nextPerson()" @back="backStep"></StopResults>
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
			<ReviewDialog :reviewDialog="reviewDialog" @review="review"></ReviewDialog> -->
		</v-card>
	</v-container>
</template>

<script>
import { datetime } from "../../../mixins/datetime";
import OfficerInfo from "./watchInfo/officerInfo.vue";
import WatchInfo from "./watchInfo/watchInfo.vue";
import StopDate from "./stopDetails/StopDate.vue";
import StopDuration from "./stopDetails/StopDuration.vue";
import StopLocation from "./stopDetails/stopLocation.vue";
import PersonCount from "./stopPersons/personCount.vue";
import PersonGender from "./stopPersons/personGender.vue";
import PersonRaceAge from "./stopPersons/personRaceAge.vue";
import PersonLGBTQ from "./stopPersons/personLGBTQ.vue";
import StopType from "./stopReasons/stopType.vue";
import StopReason from "./stopReasons/stopReason.vue";
import ActionTaken from "./stopActions/actionTaken.vue";
import StopResults from "./stopActions/stopResults.vue";
import StopEvidence from "./stopActions/stopEvidence.vue";
import ReviewDialog from "./reviewDialog";
import { mapGetters, mapMutations } from "vuex";

export default {
	name: "New-AFDR",
	components: {
		OfficerInfo,
		WatchInfo,
		StopDate,
		StopDuration,
		StopLocation,
		PersonCount,
		PersonGender,
		PersonRaceAge,
		PersonLGBTQ,
		StopType,
		StopReason,
		ActionTaken,
		StopResults,
		StopEvidence,
		ReviewDialog,
	},
	mixins: [datetime],
	data: () => ({
		step: 1,
		index: 0,
		reviewDialog: false,
	}),
	computed: {
		...mapGetters({
			persons: "Afdr/persons",
			afdr: "Afdr/afdr"
		}),
		getPartner() {
			let today = this.getLongDate(new Date());
			let def = this.incidents[0];
			let day = def.IncidentTime.substring(0, def.IncidentTime.indexOf("T"));
			if (day === today) {
				let unit = def.Units.find((u) => u.Officers.some((o) => o.OfficerId === "35456"));

				unit.Officers.forEach((o) => {
					if (o.OfficerId !== "35456") {
						var e = this.employees.find((e) => e.SerialNumber == o.OfficerId);

						this.$store.commit("addOfficer", e);
					}
				});
			}
		},
	},
	methods: {
	 ...mapMutations({
		addPerson: "Afdr/addPerson",
		removePerson:  "Afdr/removePerson", 
		addStop: "Afdr/addStop", 
		addOfficer: "Afdr/addOfficer"}),

		nextStep(num) {
			this.$vuetify.goTo(0);
			this.step = num + 1;
		},
		backStep(num) {
			this.$vuetify.goTo(0);
			this.step = num - 1;
		},
		nextPerson() {
			this.$store.dispatch("Afdr/addStop", this.index);
			if (this.index < this.persons.length - 1) {
				this.index++;
				this.step = 10;
			} else this.reviewDialog = true;
		},
		review() {
			this.reviewDialog = false;
			this.$router.push("/review");
		},
	},
	beforeMount() {
		
	},
	mounted() {
		if (!!this.persons && this.persons.length < 1) {
			this.addPerson();
		}
		this.$store.dispatch("Afdr/getIncForOfcr", "35456");
		// this.$store.dispatch("getPartnerInfo");
	},
};
</script>

<style lang="scss" scoped>
.v-stepper__content {
	top: 0;
	padding: 2px 2px 2px 2px !important;
	flex: 1 0 auto;
	width: 100%;
}
</style>
