<template>
	<v-card class="mt-4 mx-auto" width="400" @click="navigate(type.data.length)" :ripple="false">
		<v-row no-gutters justify="space-between">
			<v-col cols="3" class="ml-4">
				<v-sheet class="v-sheet--offset mx-auto py-6 text-center" :class="type.class" rounded elevation="12" width="100%" height="100">
					<v-avatar>
						<v-icon x-large dark> {{ type.icon }} </v-icon>
					</v-avatar>
				</v-sheet>
			</v-col>
			<v-col cols="6">
				<div v-if="!!type.data" class="text-h3 font-weight-heavy pt-2 pr-3 text-right" :class="type.data.length === 0 ? 'green--text' : ''">
					{{ type.data.length }}
				</div>
				<div v-else class="text-h3 font-weight-heavy pt-2 pr-3 text-right"><v-progress-circular indeterminate color="primary"></v-progress-circular></div>
				<div class="subheading font-weight-light px-3 grey--text text-right">{{ type.title }}</div>
			</v-col>
		</v-row>
		<v-card-text class="pt-0">
			<v-divider></v-divider>
			<v-icon class="mr-2" x-small :color="type.smallIconColor">{{ type.smallIcon }} </v-icon>
			<span class="text-caption grey--text font-weight-light">{{ type.caption }}</span>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "DashCard",
	props: ["type"],
	methods: {
		navigate(count) {
			count > 0 ? this.$router.push(this.type.route) : "";
		},
	},
};
</script>

<style lang="scss" scoped>
.v-sheet--offset {
	top: -24px;
	position: relative;
}
</style>
