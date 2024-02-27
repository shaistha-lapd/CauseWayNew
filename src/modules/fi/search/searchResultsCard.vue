<template>
	<v-card width="400" height="110" :outlined="$vuetify.theme.dark" class="mx-auto fi-card" @click="popUp" @blur="overlay = false" elevation="6">
		<v-container fill-height class="pa-0">
			<v-row no-gutters>
				<v-col cols="2" class="pa-0">
					<v-card elevation="0" flat class="pa-2 card-date" :class="getMode(mode)" height="110" color="primary">
						<v-row align="center" no-gutters>
							<v-col cols="12" class="subheading font-weight-bold text-right mt-0">{{ getMonth(fi.incident.incDateFormatted) }}</v-col>
							<v-col cols="12" class="headline text-right">{{ getDay(fi.incident.incDateFormatted) }}</v-col>
							<v-col cols="12" class="subheading text-right">{{ getYear(fi.incident.incDateFormatted) }}</v-col>
							<v-col cols="12" class="caption light-blue--text text--lighten-4 text-right">{{ fi.incident.incTime }}</v-col>
						</v-row>
					</v-card>
				</v-col>
				<v-col cols="10">
					<v-card elevation="0" flat class="px-2" height="110" style="border-radius: 0px 7px 7px 0px">
						<v-row no-gutters justify="space-between" class="font-weight-bold text-truncate">
							<v-col cols="8">{{ fi.person.lastName }}, {{ fi.person.firstName }}</v-col>
							<v-col cols="4" class="caption text-right">DOB: {{ fi.person.dobFormatted }}</v-col>
						</v-row>
						<v-row no-gutters justify="space-between" class="font-weight-bold text-truncate">
							<v-col cols="6" class="caption text-left">{{ fi.person.gender.value }}/{{ fi.person.descent.value }}</v-col>
							<v-col cols="6" class="caption text-right">{{ fi.person.idNumber }} - {{ fi.person.idState }}</v-col>
						</v-row>
						<v-divider></v-divider>
						<v-row no-gutters justify="space-between">
							<v-col cols="5">
								<div>Inc #</div>
								<div class="body-2">{{ fi.incident.incNumber }}</div>
							</v-col>
							<v-col cols="3" class="mb-0 pl-3">
								<div class="primary--text text-right" :class="$vuetify.theme.dark ? 'text--lighten-2' : 'text--darken-3'">RD</div>
								<div class="primary--text text-right" :class="$vuetify.theme.dark ? 'text--lighten-2' : 'text--darken-3'">{{ fi.incident.incLocation.rd }}</div>
							</v-col>
						</v-row>
						<v-row no-gutters class="caption light-blue--text" :class="$vuetify.theme.dark ? 'text--lighten-2' : 'text--darken-4'">
							<v-col cols="6" class="text-truncate">
								{{ fi.incident.incLocation.location }}
							</v-col>
							<v-col cols="6" class="text-right"> FI# {{ fi.data.id }} </v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<v-fade-transition>
			<v-overlay v-if="overlay" absolute :key="fi.id" color="blue-grey lighten-1">
				<v-container fill-height>
					<v-row justify="space-between">
						<v-col cols="3" v-if="$vuetify.breakpoint.mdAndUp">
							<v-menu max-height="400" max-width="400" open-on-hover open-delay="375" :close-on-content-click="false" offset-y>
								<template v-slot:activator="{ on, attrs }">
									<v-btn color="amber lighten-4" icon v-bind="attrs" v-on="on">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-icon x-large v-bind="attrs" v-on="on">mdi-eye-arrow-right-outline</v-icon>
											</template>
											<span>Quick View</span>
										</v-tooltip>
									</v-btn>
								</template>
								<v-card>
									<FullFIView :person="fi.person" :vehicle="fi.vehicle" :incident="fi.incident" :data="fi.data" :mode="`popup`"></FullFIView>
								</v-card>
							</v-menu>
						</v-col>
						<v-col v-else>
							<v-dialog max-width="500" v-model="dialog">
								<template v-slot:activator="{ on, attrs }">
									<v-btn color="amber lighten-4" icon v-bind="attrs" v-on="on">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-icon x-large v-bind="attrs" v-on="on">mdi-eye-arrow-right-outline</v-icon>
											</template>
											<span>Quick View</span>
										</v-tooltip>
									</v-btn>
								</template>
								<FullFIView :person="fi.person" :vehicle="fi.vehicle" :incident="fi.incident" :data="fi.data" :mode="`popup`"></FullFIView>
							</v-dialog>
						</v-col>
						<v-spacer></v-spacer>
						<v-col cols="3">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn icon color="deep-orange" v-bind="attrs" v-on="on" @click="navigate(fi.data.id)">
										<v-icon x-large>mdi-file-export-outline</v-icon>
									</v-btn>
								</template>
								<span>Full View</span>
							</v-tooltip>
						</v-col>
					</v-row>
				</v-container>
			</v-overlay>
		</v-fade-transition>
	</v-card>
</template>

<script>
import FullFIView from "../new-fi/ReviewFi.vue";
export default {
	name: "SearchResultsCard",
	props: ["fi", "mode"],
	components: { FullFIView },
	data: () => ({
		overlay: false,
		dialog: false,
	}),
	methods: {
		getLocation(fi) {
			let loc = fi.incident.incLocation.location;
			return loc.substring(0, loc.indexOf(","));
		},
		getDay(date) {
			const [month, day, year] = date.split("/");
			return day;
		},
		getYear(date) {
			const [month, day, year] = date.split("/");
			return year;
		},

		getMonth(date) {
			const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
			let [month, day, year] = date.split("/");

			return `${months[parseInt(month - 1)]}`;
		},
		navigate(id) {
			// this.overlay = false;
			this.$router.push({ name: "view", params: { id: id } });
		},
		popUp() {
			if (this.$vuetify.breakpoint.mdAndUp) {
				this.overlay = !this.overlay;
			} else {
				this.navigate(this.fi.data.id);
			}
		},
		getMode(mode) {
			if (mode === "recents" || mode === "search") {
				return "grad";
			}
			if (mode === "incompletes") {
				return "grad-warn";
			}
		},
	},
};
</script>

<style scoped>
.fi-card {
	height: 110px;
	border-radius: 7px;
	margin-bottom: 12px;
	padding: 0px;
}
.card-date {
	border-radius: 7px 0px 0px 7px !important;
	color: white;
	height: 100%;
}
</style>
