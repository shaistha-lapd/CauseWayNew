<template>
	<v-card>
		<div>
			<h3 class="text-center">Type of Stop - Person {{ personNum + 1 }}</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text>
			<v-radio-group v-model="persons[personNum].stopType">
				<v-card class="pa-3 mb-2" min-height="56" outlined v-for="(t, i) in types" :key="i">
					<v-radio class="py-auto" color="primary" :value="t">
						<template v-slot:label>
							<div>
								<strong>{{ t }}</strong>
							</div>
						</template>
					</v-radio>
				</v-card>
			</v-radio-group>
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
	props: ["step", "personNum"],

	data: () => ({
		types: ["Vehicle Driver", "Vehicle Passenger", "Pedestrian", "Bicycle"],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
};
</script>

<style></style>
