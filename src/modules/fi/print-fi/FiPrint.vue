<template>
	<div class="box" id="printFi">
		<v-row class="row" no-gutters>
			<div style="height: 20mm; width: 20mm; border: 0.5px solid black; background-color: lightgray"></div>
			<div class="field" style="width: 25mm">
				<div class="label">OP Lic No</div>
				<div class="data">{{ person.idNumber }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">state</div>
				<div class="data">{{ person.idState }}</div>
			</div>
			<div class="field" style="width: 55mm">
				<div class="label">name(last, first,middle)</div>

				<div class="data">{{ person.lastName }}, {{ person.firstName }} {{ person.middleName }}</div>
			</div>
			<div class="field" style="width: 14mm">
				<div class="label">suffix</div>
				<div class="data">{{ person.suffix }}</div>
			</div>
		</v-row>
		<!-- Row 2 -->
		<v-row class="row" style="position: relative; left: 20mm; margin-top: -10mm" no-gutters>
			<div class="field" style="width: 12mm">
				<div class="label">sex</div>
				<div class="data">{{ person.gender.value }}</div>
			</div>
			<div class="field" style="width: 13mm">
				<div class="label">Descent</div>
				<div class="data">{{ person.descent.value }}</div>
			</div>
			<div class="field" style="width: 13mm">
				<div class="label">Hair</div>
				<div class="data">{{ person.hairColor.value }}</div>
			</div>
			<div class="field" style="width: 13mm">
				<div class="label">eyes</div>
				<div class="data">{{ person.eyeColor.value }}</div>
			</div>
			<div class="field" style="width: 13mm">
				<div class="label">Height</div>
				<div class="data">{{ person.height }}</div>
			</div>
			<div class="field" style="width: 13mm">
				<div class="label">weight</div>
				<div class="data">{{ person.weight }}</div>
			</div>
			<div class="field" style="width: 27mm">
				<div class="label">birthdate</div>
				<div class="data">{{ person.dobFormatted }}</div>
			</div>
		</v-row>
		<!-- Row 3 -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 62mm" ref="clothing">
				<div class="label">clothing</div>
				<div class="data" style="font-size: 7pt">{{ person.clothing }}</div>
			</div>

			<div class="field" style="width: 62mm">
				<div class="label">Personal Oddities</div>
				<div class="data" style="font-size: 7pt">{{ person.oddities }}</div>
			</div>
		</v-row>
		<!-- Row 4 -->
		<v-row class="row" no-gutters v-for="add in person.addresses" :key="add.formattedAddress">
			<div class="field">
				<div class="label" style="width: 122.5mm">
					Address <span style="font-color: red">{{ add.type }}</span>
				</div>
				<div class="data">{{ add.formattedAddress }} {{ add.city }} {{ add.state }}, {{ add.zip }}</div>
			</div>
		</v-row>
		<v-row class="row" no-gutters v-if="!person.addresses.length">
			<div class="field">
				<div class="label" style="width: 122.5mm">Address</div>
			</div>
		</v-row>
		<v-row class="row" no-gutters>
			<div class="field" style="width: 31mm" v-for="phone in person.phones" :key="phone.number">
				<div class="label">
					phone no. <span style="font-color: red">{{ phone.type }}</span>
				</div>
				<div class="data">{{ phone.formattedNumber }}</div>
			</div>
			<div class="field" style="width: 31mm" v-for="x in 4 - person.phones.length" :key="x">
				<div class="label">phone no.</div>
			</div>
		</v-row>
		<!-- Additional Persons -->
		<v-row no-gutters style="border: 1px solid black; height: 4mm; width: 124mm">
			<div class="label" style="font-weight: bold; margin-top: 0.5mm">Additional Persons</div>
		</v-row>
		<v-row class="row" no-gutters v-for="(ass, i) in person.associates" :key="i">
			<div class="field" style="width: 55mm">
				<div class="label">name(last, first,middle)</div>
				<div class="data">{{ ass.lastName }}, {{ ass.firstName }}</div>
			</div>
			<div class="field" style="width: 25mm">
				<div class="label">birthdate</div>
				<div class="data">{{ ass.dobFormatted }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">sex</div>
				<div class="data">{{ ass.gender.value }}</div>
			</div>
			<div class="field" style="width: 34mm">
				<div class="label">Alias/AKA</div>
				<div class="data">{{ ass.aka }}</div>
			</div>
		</v-row>
		<!-- Activities -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 124mm">
				<div class="label">Activities</div>
				<span class="narrative" style="font-size: 6pt" v-for="a in person.activities" :key="a.value">{{ a.value }}.{{ a.name }}</span>
			</div>
		</v-row>
		<!-- Vehicle -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 2mm">
				<div class="label" style="font-weight: bold; writing-mode: vertical-lr; text-orientation: upright; margin: 2px -3px; padding: 0">veh</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">Drv/Pas</div>
				<div class="data">{{ vehicle.vehSeatedPosition.substring(0, 3).toUpperCase() }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">Year</div>
				<div class="data">{{ vehicle.vehYear }}</div>
			</div>
			<div class="field" style="width: 35mm">
				<div class="label">Make & Model</div>
				<div class="data">{{ vehicle.vehMake }} {{ vehicle.vehModel }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">type</div>
				<div class="data">{{ vehicle.vehBodyStyle.value }}</div>
			</div>
			<div class="field" style="width: 12mm">
				<div class="label">color</div>
				<div class="data">{{ vehicle.vehColor.value }}</div>
			</div>
			<div class="field" style="width: 25mm">
				<div class="label">Lic No</div>
				<div class="data">{{ vehicle.vehPlate }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">State</div>
				<div class="data">{{ vehicle.vehState }}</div>
			</div>
			<div class="field" style="width: 10mm">
				<div class="label">type</div>
				<div class="data"></div>
			</div>
		</v-row>
		<!-- Narrative -->
		<v-row no-gutters style="border: 1px solid black; height: 4mm; width: 124mm">
			<div class="label" style="font-weight: bold; margin-top: 0.5mm">
				Addition information: booking no., narrative, aliask/aka, email, social media account(s)
			</div>
		</v-row>
		<div style="min-height: 45mm; width: 124mm; border: 0.5px solid black">
			<div class="narrative" style="overflow-wrap: break-word; word-wrap: break-word">
				{{ incident.incNarrative }}
				<br />
				{{ person.homelessRationale }}
				<br />
				{{ person.caJustification }}
			</div>
		</div>
		<!-- Incident Details -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 20mm">
				<div class="label">date</div>
				<div class="data">{{ incident.incDate }}</div>
			</div>
			<div class="field" style="width: 15mm">
				<div class="label">time</div>
				<div class="data">{{ incident.incTime }}</div>
			</div>
			<div class="field" style="width: 69mm">
				<div class="label">location</div>
				<div class="data" v-if="incident.incLocation.rd == '9999'" style="font-size: 1.25vw">{{ incident.incLocation.location }}</div>
				<div class="data" v-else-if="!incident.incLocation.location.includes(',')">{{ incident.incLocation.location }}</div>
				<div class="data" v-else>{{ incident.incLocation.location.substring(0, incident.incLocation.location.indexOf(",")) }}</div>
			</div>
			<div class="field" style="width: 20mm">
				<div class="label">rd</div>
				<div class="data">{{ incident.incLocation.rd }}</div>
			</div>
		</v-row>
		<!-- Officers -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 62mm" v-for="ofcr in incident.incOfficers" :key="ofcr.serial">
				<div class="label">Officer (lastname, serial)</div>
				<div class="data">{{ ofcr.lastName }} #{{ ofcr.serial }}</div>
			</div>
			<div class="field" style="width: 62mm" v-if="incident.incOfficers.length === 1">
				<div class="label">Officer (lastname, f.i, serial)</div>
				<div class="data"></div>
			</div>
		</v-row>
		<!-- incident number -->
		<v-row class="row" no-gutters>
			<div class="field" style="width: 25mm">
				<div class="label" style="font-weight: bold">field interview</div>
				<div class="data">15.43.00</div>
			</div>
			<div class="field" style="width: 33mm">
				<div class="label">Incident No.</div>
				<div class="data">{{ incident.incNumber }}</div>
			</div>
			<div class="field" style="width: 33mm">
				<div class="label">division</div>
				<div class="data"></div>
			</div>
			<div class="field" style="width: 33mm">
				<div class="label">detail</div>
				<div class="data">{{ incident.unit }}</div>
			</div>
		</v-row>
	</div>
</template>

<script>
export default {
	name: "FiPrint",
	props: ["data", "person", "vehicle", "incident"],
	data: () => ({}),
};
</script>

<style scoped>
.box {
	border: 1px solid black;
	margin: 16px auto;
	width: 126mm;
	background-color: white;
	padding: 1px;
}
.row {
	margin: 0;
	padding: 0;
}
.field {
	border: 0.5px solid;
	border-color: black;
	height: 10mm;
	margin: 0;
	padding: 0.25px 1px;
	display: block;
}
.label {
	height: 2mm;
	font-size: 1.5mm;
	text-transform: uppercase;
	color: black;
	margin-left: 2px;
}
.data {
	color: #039;
	font-size: 12px;
	font-family: Helvetica, Arial, sans-serif;
	font-weight: bold;
	height: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: clip;
	width: inherit;
	text-transform: none;
	margin-top: 10px;
	margin-left: 4px;
	width: 100%;
}
.narrative {
	color: #039;
	font-size: 12px;
	font-family: Helvetica, Arial, sans-serif;
	font-weight: bold;
	height: 100%;
	width: inherit;
	text-transform: none;
	margin-top: 10px;
	margin-left: 4px;
}
@media print {
	.box {
		border: 1px solid black;
		margin: 16px auto;
		width: 126mm;
		background-color: white;
		padding: 1px;
	}
	.row {
		margin: 0;
		padding: 0;
	}
	.field {
		border: 0.5px solid;
		border-color: black;
		height: 10mm;
		margin: 0;
		padding: 0.25px 1px;
		display: block;
	}
	.container {
		width: 100%;
		height: 100%;
	}
	.label {
		height: 2mm;
		font-size: 1.5mm;
		text-transform: uppercase;
		color: black;
		margin-left: 2px;
	}
	.data {
		color: #039;
		font-size: 12px;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: bold;
		height: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: clip;
		width: inherit;
		text-transform: none;
		margin-top: 10px;
		margin-left: 4px;
		width: 100%;
	}
	.narrative {
		color: #039;
		font-size: 12px;
		font-family: Helvetica, Arial, sans-serif;
		font-weight: bold;
		height: 100%;
		width: inherit;
		text-transform: none;
		margin-top: 10px;
		margin-left: 4px;
	}
}
</style>
