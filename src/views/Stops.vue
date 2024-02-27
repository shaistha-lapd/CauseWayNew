<template>
	<v-container>
		<transition name="page" mode="out-in">
			<router-view />
		</transition>
		<!-- <SubmitSuccess></SubmitSuccess>
		<Loader></Loader> -->
	</v-container>
	
</template>

<script>
export default {
	name: "AFDR",

	methods: {
		// ...mapMutations(["addPerson", "removePerson", "addStop", "addOfficer"]),
		navigate() {
			window.open("https://praetorian.azurewebsites.us", "_blank");
		},
	},
};
</script>
