<template>
	<v-card>
		<div>
			<h3 class="text-center">
				How Many People Were <span class="text-decoration-underline">Detained</span> or <span class="text-decoration-underline">Searched</span>?
			</h3>
		</div>
		<v-divider></v-divider>
		<v-card-text>
			<v-container>
				<v-row align="center" justify="center">
					<v-col cols="8" md="6">
						<v-text-field
							outlined
							v-model.number="persons.length"
							append-outer-icon="mdi-plus"
							@click:append-outer="$store.commit('addPerson')"
							prepend-icon="mdi-minus"
							@click:prepend="$store.commit('removePerson')"
							class="centered-input"
							type="number"
						>
						</v-text-field>
					</v-col>
				</v-row>
			</v-container>
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
import { mapMutations } from "vuex";
export default {
	props: ["step"],

	data: () => ({}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
	methods: {
		...mapMutations(["addPerson", "removePerson"]),
	},
};
</script>
<style scoped>
.centered-input >>> input {
	text-align: center;
}
</style>
