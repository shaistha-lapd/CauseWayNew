<template>
	<div>
		<v-card-subtitle> Associates</v-card-subtitle>
		<v-divider></v-divider>
		<v-card-text>
			<v-card class="mb-8">
				<v-toolbar dark dense color="primary darken-2">
					<v-toolbar-title dark>Associates</v-toolbar-title>
					<v-spacer></v-spacer>
					<AddAssociatesDialog :key="person.associates.length" :settings="settings" :lookups="lookups" @pushAssoc="pushAssoc"></AddAssociatesDialog>
				</v-toolbar>
				<v-list v-if="person.associates.length > 0">
					<div v-for="(ass, i) in person.associates" :key="i">
						<v-list-item>
							<v-list-item-content>
								<v-list-item-title> {{ ass.lastName }}, {{ ass.firstName }} </v-list-item-title>
								<v-list-item-subtitle v-if="!!ass.aka"> "{{ ass.aka }}" </v-list-item-subtitle>
								<v-list-item-subtitle> {{ ass.gender.name }} - {{ ass.dobFormatted }} </v-list-item-subtitle>
							</v-list-item-content>

							<v-list-item-action>
								<v-btn icon @click="removeAssociate(i)">
									<v-icon color="red">mdi-delete</v-icon>
								</v-btn>
							</v-list-item-action>
						</v-list-item>
						<v-divider v-if="i < person.associates.length - 1"></v-divider>
					</div>
				</v-list>
			</v-card>
		</v-card-text>

		<v-divider></v-divider>

		<v-card-actions>
			<v-btn v-if="step > 1" text @click="$emit('backStep', step)"> Back </v-btn>

			<v-spacer></v-spacer>
			<v-btn color="primary" @click="$emit('advanceStep', step)"> Continue </v-btn>
		</v-card-actions>
	</div>
</template>

<script>
import AddAssociatesDialog from "./AddAssociatesDialog.vue";
import { mapMutations } from "vuex";

export default {
	name: "Associates",
	components: { AddAssociatesDialog },
	props: ["step", "person", "gangs", "lookups", "settings"],

	data: () => ({}),

	methods: {
		...mapMutations({
			addAssociate: "Fi/ADD_ASSOCIATE",
			removeAssociate: "Fi/REMOVE_ASSOCIATE",
		}),
		pushAssoc(assoc) {
			this.addAssociate(assoc);
		},
	},
	watch: {
		// "person.addresses"(val) {
		// 	this.valid = val.length || this.person.activities.find((o) => o.value == 3) ? true : false;
		// },
		// "person.activities"(val) {
		// 	this.valid = !!val.find((o) => o.value == 3) || this.person.addresses.length;
		// },
	},
	mounted() {
		// this.valid = this.person.activities.find((o) => o.value == 3) || this.person.addresses.length;
	},
};
</script>

<style></style>
