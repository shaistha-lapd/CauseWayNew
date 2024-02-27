<template>
	<v-card>
		<div>
			<h3 class="text-center">
				Duration of Stop
			</h3>
		</div>

		<v-divider></v-divider>
		<v-card-text>
			<v-item-group :mandatory="mandatory" v-model="selected">
				<v-container>
					<v-row>
						<v-col v-for="time in times" :key="time" cols="4" class="d-flex child-flex">
							<v-item v-slot="{ active, toggle }">
								<v-card
									:color="active ? 'green darken-1' : 'primary'"
									class="d-flex align-center"
									dark
									height="46"
									width="62"
									@click="toggle(), updateDuration()"
									@focus="other = null"
									:value="time"
								>
									<div class="flex-grow-1 text-center">{{ time }} mins</div>
								</v-card>
							</v-item>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="6">
							<v-text-field v-model="other" label="Other" filled outlined type="number" @focus="inputOther()" @input="updateDuration()"></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-item-group>
		</v-card-text>
		<v-card-actions>
			<v-btn outlined @click="$emit('back', step)">
				Back
			</v-btn>
			<v-spacer></v-spacer>
			<v-btn :disabled="!formValid" color="primary" @click="$emit('continue', step)">
				Continue
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
	props: ["step"],
	data: () => ({
		mandatory: true,
		selected: 1,
		times: [5, 10, 15, 20, 30, 60],
		other: null,
	}),
	computed: {
		...mapFields(["stopInfo.duration"]),

		formValid() {
			return this.duration > 0;
		},
	},
	methods: {
		inputOther() {
			this.selected = null;
			this.mandatory = false;
		},
		updateDuration() {
			this.other == "" || this.other == null ? (this.duration = this.times[this.selected]) : (this.duration = parseInt(this.other));
		},
	},
	mounted() {
		this.updateDuration();
	},
};
</script>

<style>
.tips {
	background-color: gray;
}
</style>
