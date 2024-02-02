<template>
	<div class="full-fi">
		<v-card class="print-card">
			<v-toolbar dark color="secondary">
				<v-spacer></v-spacer>
				<v-toolbar-title class="subheading ml-0">FI #: {{ data.id }}</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>

			<v-card-text class="pa-0 dom">
				<v-container>
					<v-row align-content="center" no-gutters>
						<v-col cols="4" md="3">
							<v-avatar tile size="80" color="grey" class="mt-3 mb-1">
								<img src="../../../../public/img/anonymous42.png" />
							</v-avatar>
						</v-col>
						<v-col cols="8" md="6">
							<v-list-item three-line>
								<v-list-item-content class="red--text text--lighten-1">
									<v-list-item-title>{{ person.idNumber }} <span v-if="person.idNumber">-</span> {{ person.idState }}</v-list-item-title>
									<v-list-item-subtitle>
										{{ person.lastName }}
									</v-list-item-subtitle>
									<v-list-item-subtitle> {{ person.firstName }} {{ person.middleName }} {{ person.suffix }} </v-list-item-subtitle>
									<v-list-item-subtitle>
										{{ person.dobFormatted }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
						</v-col>
					</v-row>
					<v-row no-gutters class="caption light-blue--text">
						<v-col cols="4" md="3">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-chip v-bind="attrs" v-on="on" small dark color="primary" class="pl-0">
										<v-avatar color="secondary" class="mr-1">{{ person.gender.value }}</v-avatar>
										{{ person.gender.shortName }}
									</v-chip>
								</template>
								<span>{{ person.gender.name }}</span>
							</v-tooltip>
						</v-col>
						<v-col cols="3" class="pl-4">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<span v-bind="attrs" v-on="on">{{ person.descent.value }}</span>
								</template>
								<span>Ethnicity: {{ person.descent.name }}</span>
							</v-tooltip>
						</v-col>
						<v-col cols="3">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<span v-bind="attrs" v-on="on">{{ person.hairColor.value }}/{{ person.eyeColor.value }}</span>
								</template>
								<span>{{ person.hairColor.name }} hair/{{ person.eyeColor.name }} eyes</span>
							</v-tooltip>
						</v-col>
						<v-col cols="2">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<span v-bind="attrs" v-on="on">{{ person.height }}/{{ person.weight }}</span>
								</template>
								<span>Height/Weight</span>
							</v-tooltip>
						</v-col>
						<v-spacer></v-spacer>
					</v-row>
				</v-container>
			</v-card-text>
			<v-divider></v-divider>
			<!-- Addresses -->
			<v-card-text :class="`text-${sizes[text]}`">
				<v-row no-gutters>
					<div class="caption print-label">
						<u>Addresses</u>
					</div>
				</v-row>
				<v-row no-gutters justify="space-between" v-for="add in person.addresses" :key="add.formattedAddress">
					<v-col cols="2">
						<v-badge left inline :content="add.type.substring(0, 1)"> </v-badge>
					</v-col>
					<v-col cols="10">
						<div class="print-text">{{ add.formattedAddress }}</div>
						<div class="print-text">{{ add.city }} {{ add.state }}, {{ add.zip }}</div>
					</v-col>
				</v-row>

				<v-row no-gutters class="mt-2">
					<div class="caption">
						<u>Phones</u>
					</div>
				</v-row>
				<v-row no-gutters justify="space-between" v-for="phone in person.phones" :key="phone.number">
					<v-col cols="2">
						<v-badge left inline :content="phone.type.substring(0, 1)"> </v-badge>
					</v-col>
					<v-col cols="10">{{ phone.formattedNumber }}</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<!-- Description -->
			<v-card-text :class="`text-${sizes[text]}`">
				<v-row no-gutters>
					<v-list-item-subtitle class="caption"> <u>Clothing</u> </v-list-item-subtitle>
					<v-col cols="10"> {{ !person.clothing ? "N/A" : person.clothing }}</v-col>
				</v-row>
				<v-row no-gutters class="mt-2">
					<v-list-item-subtitle class="caption"> <u>Personal Oddities</u> </v-list-item-subtitle>
					<div :class="`text-${sizes[text]}`">{{ !person.oddities ? "N/A" : person.oddities }}</div>
				</v-row>
				<v-row no-gutters class="mt-2">
					<v-list-item-subtitle class="caption"> <u>Alias/Moniker</u> </v-list-item-subtitle>

					<v-col v-if="person.alias && !person.gang" cols="4" class="mt-1"> {{ person.alias }} </v-col>

					<v-col v-else-if="person.alias && person.gang" cols="12">
						<v-chip :class="`text-${sizes[text]}`" small label outlined no-ripple color="warning darken-1" dark>{{ person.alias }} - {{ person.gang }}</v-chip>
					</v-col>
					<v-col v-else cols="4" class="mt-1">N/A</v-col>
				</v-row>
				<v-row no-gutters class="mt-2">
					<div>
						<v-chip class="ma-1" :class="`text-${sizes[text]}`" outlined x-small color="info" v-for="a in person.activities" :key="a.value">{{
							a.name
						}}</v-chip>
					</div>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<!-- Associates -->
			<v-card-text v-if="!!person.associates && person.associates.length" :class="`text-${sizes[text]}`">
				<v-list-item-subtitle class="caption"> <u>Associates</u> </v-list-item-subtitle>
				<v-row no-gutters justify="space-between" v-for="(ass, i) in person.associates" :key="i">
					<v-col cols="2">
						<v-icon color="cyan">mdi-account-group</v-icon>
					</v-col>
					<v-col cols="5">{{ ass.lastName }}, {{ ass.firstName }}</v-col>
					<v-col cols="5">{{ ass.gender.value }} - {{ ass.dobFormatted }} </v-col>
					<v-row dense>
						<v-col cols="2"> </v-col>
						<v-col cols="6" class="caption">
							"{{ ass.aka }}"
							<v-col cols="5"> </v-col>
						</v-col>
					</v-row>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<!-- Vehicle -->
			<v-card-text v-if="vehicle.vehSeatedPosition != 'ped'" :class="`text-${sizes[text]}`">
				<v-row justify="space-between">
					<v-col cols="6">
						<v-list-item-subtitle class="caption"> <u>Vehicle</u> </v-list-item-subtitle>
						<v-list-item-title>
							{{ vehicle.vehPlate }} -
							{{ vehicle.vehState }}
						</v-list-item-title>
					</v-col>
					<v-col cols="6" sm="4">
						<v-chip v-if="vehicle.vehSeatedPosition === 'driver'" small dark color="primary">
							<v-icon left color="secondary">mdi-seat-recline-extra</v-icon> Driver
						</v-chip>
						<v-chip v-if="vehicle.vehSeatedPosition === 'passenger'" small dark color="primary">
							<v-icon left color="secondary">mdi-seat-passenger</v-icon> Passenger
						</v-chip>
					</v-col>
				</v-row>

				<div>
					{{ vehicle.vehYear }}
					{{ vehicle.vehMake }}
					{{ vehicle.vehModel }} - {{ vehicle.vehBodyStyle.name }} -
					{{ vehicle.vehColor.name }}
				</div>

				<v-list-item-subtitle class="caption mt-4"><u>Dents/Scratches/Stickers</u> </v-list-item-subtitle>
				<div>{{ vehicle.vehDamage }}</div>
			</v-card-text>
			<v-card-text v-else> PED/BIKE </v-card-text>
			<v-divider></v-divider>

			<!-- Incident Details -->
			<v-card-text :class="`text-${sizes[text]}`">
				<v-row>
					<v-col cols="12">
						<div class="caption"><u>Incident #</u></div>
						<div>{{ incident.incNumber }}</div>
						<div>{{ incident.incDateFormatted }} - {{ incident.incTime }} hrs</div>
					</v-col>
				</v-row>
				<v-row justify="space-between" no-gutters class="mt-4">
					<v-col cols="6" class="caption">
						<u>Unit #</u>
					</v-col>
					<v-col cols="6" sm="4">
						<v-chip class="mb-1" small dark color="primary">
							<v-icon small left color="secondary">mdi-car-emergency</v-icon>
							{{ incident.unit }}</v-chip
						>
					</v-col>
				</v-row>
				<v-row no-gutters justify="space-between" v-for="ofcr in incident.incOfficers" :key="ofcr.serial">
					<v-col cols="6">{{ ofcr.lastName }}</v-col>
					<v-col cols="6" sm="4" class="pl-2">#{{ ofcr.serial }}</v-col>
				</v-row>
				<v-row no-gutters justify="space-between" class="mt-4">
					<v-col cols="6">
						<v-list-item-subtitle class="caption"> <u>Location</u> </v-list-item-subtitle>
					</v-col>
					<v-col cols="6" sm="4">
						<v-chip class="mb-1" small :color="incident.incLocation.rd == '9999' ? '' : 'primary'">
							<v-icon small left color="secondary">mdi-map</v-icon>RD: {{ incident.incLocation.rd }}</v-chip
						>
					</v-col>
					<div>{{ incident.incLocation.location }}</div>
				</v-row>
				<v-row no-gutters class="mt-4">
					<v-col cols="12">
						<v-list-item-subtitle class="caption"><u>Narrative</u></v-list-item-subtitle>
					</v-col>
					<v-col cols="11">
						<div id="narrative">{{ incident.incNarrative }}</div>
						<div v-if="!!person.homelessRationale">HR: {{ person.homelessRationale }}</div>
						<div v-if="!!person.caJustification">CA: {{ person.caJustification }}</div>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
		<FiPrint id="printFI" v-show="false" :data="data" :person="person" :vehicle="vehicle" :incident="incident"></FiPrint>
	</div>
</template>

<script>
import FiPrint from "../print-fi/FiPrint.vue";
export default {
	name: "FiReview",
	components: { FiPrint },
	props: ["data", "person", "vehicle", "incident", "text"],

	data: () => ({
		sizes: ["body-2", "body-1", "h6"],
	}),

	computed: {
		fullScreen() {
			return this.$vuetify.breakpoint.mdAndUp;
		},
	},
	methods: {
		print() {
			const prtHtml = document.getElementById("printFI").innerHTML;
			console.log(prtHtml);
			// Get all stylesheets HTML
			let stylesHtml = "";
			for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
				stylesHtml += node.outerHTML;
			}
			// Open the print window
			const WinPrint = window.open("", "", "left=25mm,top=25mm,fullscreen=1,resizable=1");
			WinPrint.document.write(
				`<!DOCTYPE html>
					<html>
						<head>
						${stylesHtml}
						</head>
						<body style="margin: auto;">
						${prtHtml}
						</body>
					</html>`
			);
			WinPrint.blur();
			setTimeout(() => {
				WinPrint.document.close();

				WinPrint.focus();
				WinPrint.print();
				WinPrint.close();
			}, 1000);
		},
	},
};
</script>

<style scoped>
#narrative {
	white-space: pre-line;
}

/* @media print {
	.full-fi div {
		background-color: white;
		color: black;
	}
	.no-print {
		display: none;
	}
	.print-card {
		border: 1px solid black;
		box-shadow: none;
	}
	.print-text {
		color: black;
	}
	.print-label {
		color: #ff8c00;
	}
	div {
		color: black;
	}
} */
</style>
