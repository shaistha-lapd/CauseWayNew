<template>
	<v-card>
		<div>
			<h3 class="text-center"><span class="text-decoration-underline orange--text text--lighten-1 ">Perceived</span> Age and Race?</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text class="mx-0 pa-1 ">
			<v-card flat v-for="(person, i) in persons" :key="i" class="my-2 person-card">
				<v-row no-gutters>
					<v-col cols="3">
						<v-card flat min-height="100%">
							<v-card-text class="px-0">
								<strong>Person {{ i + 1 }} </strong>
							</v-card-text>
							<v-card-actions>
								<v-icon large color="primary">mdi-account-circle</v-icon>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col cols="9">
						<v-col cols="6" class="pb-0">
							<v-text-field dense outlined label="Age" v-model="persons[i].age"></v-text-field>
						</v-col>
						<v-checkbox dense class="pa-0 ma-0" v-for="race in races" :key="race" :label="race" v-model="persons[i].races" :value="race"></v-checkbox>
					</v-col>
				</v-row>
				<v-row justify="center" class="mt-2">
					<span class="text-body-2">Could you perceive the race/ethnicity prior to the stop?</span>
				</v-row>
				<v-row justify="center" class="mt-0 mb-2">
					<v-radio-group dense row v-model="persons[i].perceivedPriorToStop">
						<v-radio label="No" :value="false"> </v-radio>
						<v-radio label="Yes" :value="true"></v-radio>
					</v-radio-group>
				</v-row>
				<v-divider></v-divider>
			</v-card>
		</v-card-text>

		<v-card-actions>
			<v-btn outlined @click="$emit('back', step)">
				Back
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="primary" @click="$emit('continue', step)">
				Continue
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapMultiRowFields } from "vuex-map-fields";
export default {
	props: ["step"],

	data: () => ({
		age: null,
		perceivedPriorToStop: false,
		numbers: [],
		races: ["Asian", "Black/African American", "Hispanic/Latino(a)", "Middle Eastern/South Asian", "Native American", "Pacific Islander", "White"],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
};
</script>

<style></style>
