<template>
	<v-card>
		<div>
			<h3 class="text-center">What Was Their &nbsp;<span class="text-decoration-underline orange--text text--lighten-1 ">Perceived</span> Gender?</h3>
		</div>
		<v-divider></v-divider>

		<v-card-text class="mx-0 pa-1 ">
			<v-card outlined v-for="(person, i) in persons" :key="i" class="my-2">
				<v-row no-gutters style="min-height: 125px;">
					<v-col cols="3">
						<v-card flat min-height="100%">
							<v-card-text>
								<strong>Person {{ i + 1 }} </strong>
							</v-card-text>
							<v-card-actions class="ml-2 py-0 my-auto">
								<v-icon large color="primary">mdi-account-circle</v-icon>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col cols="8">
						<v-item-group class="mt-3 mb-4" :key="i" v-model="persons[i].gender">
							<v-container>
								<v-row justify="space-between">
									<v-item v-slot="{ active, toggle }" :value="genders[0]">
										<v-card
											:color="active ? 'green darken-1' : 'primary'"
											class="d-flex align-center"
											dark
											height="36"
											width="33%"
											@click="toggle(), setLGBTQ(i)"
										>
											<div class="flex-grow-1 text-center text-caption">{{ genders[0] }}</div>
										</v-card>
									</v-item>
									<v-item v-slot="{ active, toggle }" :value="genders[1]">
										<v-card
											:color="active ? 'green darken-1' : 'primary'"
											class="d-flex align-center"
											dark
											height="36"
											width="60%"
											@click="toggle(), setLGBTQ(i)"
										>
											<div class="flex-grow-1 text-center text-caption">{{ genders[1] }}</div>
										</v-card>
									</v-item>
								</v-row>

								<v-row justify="space-between" class="mt-5">
									<v-item v-slot="{ active, toggle }" :value="genders[2]">
										<v-card
											:color="active ? 'green darken-1' : 'primary'"
											class="d-flex align-center"
											dark
											height="36"
											width="33%"
											@click="toggle(), setLGBTQ(i)"
										>
											<div class="flex-grow-1 text-center text-caption">{{ genders[2] }}</div>
										</v-card>
									</v-item>
									<v-item v-slot="{ active, toggle }" :value="genders[3]">
										<v-card
											:color="active ? 'green darken-1' : 'primary'"
											class="d-flex align-center"
											dark
											height="36"
											width="60%"
											@click="toggle(), setLGBTQ(i)"
										>
											<div class="flex-grow-1 text-center text-caption">{{ genders[3] }}</div>
										</v-card>
									</v-item>
								</v-row>
								<v-row justify="center" class="mt-5">
									<v-item v-slot="{ active, toggle }" :value="genders[4]">
										<v-card
											:color="active ? 'green darken-1' : 'primary'"
											class="d-flex align-center"
											dark
											height="36"
											width="66%"
											@click="toggle(), setLGBTQ(i)"
										>
											<div class="flex-grow-1 text-center text-caption">{{ genders[4] }}</div>
										</v-card>
									</v-item>
								</v-row>
							</v-container>
						</v-item-group>
					</v-col>
				</v-row>
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
import { mapGetters } from "vuex";
import { mapMultiRowFields } from "vuex-map-fields";
export default {
	props: ["step"],

	data: () => ({
		genders: ["Male", "Transgender Man/Boy", "Female", "Transgender Woman/Girl", "Gender Non-conforming"],
	}),
	computed: {
		...mapMultiRowFields(["persons"]),
	},
	methods: {
		setLGBTQ(index) {
			if (this.persons[index].gender === this.genders[1] || this.persons[index].gender === this.genders[3]) {
				this.persons[index].lgbtq = true;
			} else this.persons[index].lgbtq = false;
		},
	},
};
</script>

<style></style>
