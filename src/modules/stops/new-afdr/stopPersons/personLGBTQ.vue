<template>
	<v-card>
		<div>
			<h3 class="text-center">Were They <span class="text-decoration-underline orange--text text--lighten-1 ">Perceived</span> To Be:</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text class="mx-2 pa-1 ">
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
						<v-container fluid>
							<v-row no-gutters class="mb-0 pa-0">
								<v-col cols="4">
									<span class="text-caption">LGBT</span>
								</v-col>
								<v-col cols="3">
									<span class="text-caption">Limited English</span>
								</v-col>
								<v-col cols="4">
									<span class="text-caption">Disabled</span>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="4">
									<v-checkbox :readonly="lgbtqDisabled(i)" v-model="persons[i].lgbtq"></v-checkbox>
								</v-col>
								<v-col cols="4">
									<v-checkbox v-model="persons[i].limitedEnglish"></v-checkbox>
								</v-col>
								<v-col cols="4">
									<v-checkbox v-model="persons[i].disability"></v-checkbox>
								</v-col>
							</v-row>
						</v-container>
					</v-col>
					<v-expand-transition>
						<div v-if="persons[i].disability">
							<v-card max-width="95%" class="mb-2">
								<v-card-title class="text-caption">Type of Disability</v-card-title>
								<v-divider></v-divider>
								<v-card-text>
									<v-checkbox dense class="pa-0 ma-0" v-for="d in disabilities" :key="d" :label="d" v-model="persons[i].disabilities" :value="d"></v-checkbox>
								</v-card-text>
							</v-card>
						</div>
					</v-expand-transition>
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
		disabilities: [
			"Deafness or difficulty hearing",
			"Speech impairment or limited use of language",
			"Blind or limited vision",
			"Mental health condition",
			"Intellectual or developmental disability, including dementia",
			"Disability related to hyperactivity or impulsive behavior",
			"Other disability",
		],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
	methods: {
		lgbtqDisabled(index) {
			if (this.persons[index].gender === "Transgender Man/Boy" || this.persons[index].gender === "Transgender Woman/Girl") {
				return true;
			} else return false;
		},
	},
};
</script>

<style></style>
